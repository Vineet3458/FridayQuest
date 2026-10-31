import mongoose from 'mongoose';
import { User } from '../../models/User.js';
import { Game } from '../../models/Game.js';
import { safeGetIO } from '../../sockets/index.js';

export class ApprovalsService {
  public static async getPendingApprovals(orgId: string, role: string) {
    const isSuperAdmin = role === 'superAdmin';
    const orgObjectId = new mongoose.Types.ObjectId(orgId);

    // 1. Pending Users
    const userQuery: any = { status: 'pending' };
    if (!isSuperAdmin) {
      userQuery.orgId = orgObjectId;
    }
    const pendingUsers = await User.find(userQuery)
      .select('_id name email role department createdAt status orgId')
      .populate('orgId', 'name')
      .lean();

    // 2. Pending Custom Games
    const gameQuery: any = { status: 'submitted' };
    if (!isSuperAdmin) {
      gameQuery.$or = [{ orgId: orgObjectId }, { orgId: null }];
    }
    const pendingGames = await Game.find(gameQuery)
      .populate('createdBy', 'name email department')
      .populate('orgId', 'name')
      .lean();

    return {
      pendingUsers,
      pendingGames,
      totalPending: pendingUsers.length + pendingGames.length,
    };
  }

  public static async approveUser(orgId: string, userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.status = 'active';
    await user.save();

    const io = safeGetIO();
    if (io) {
      io.to(`org:${user.orgId}`).emit('user:approved', { userId: user._id, name: user.name, email: user.email });
      io.to(`org:${user.orgId}`).emit('analytics:update');
      io.to(`org:${user.orgId}`).emit('dashboard:update');
    }

    return user;
  }

  public static async rejectUser(orgId: string, userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    await User.findByIdAndDelete(userId);

    const io = safeGetIO();
    if (io) {
      io.to(`org:${user.orgId}`).emit('approvals:updated');
      io.to(`org:${user.orgId}`).emit('analytics:update');
    }

    return { success: true, message: 'User registration request rejected' };
  }

  public static async approveGame(orgId: string, gameId: string) {
    const game = await Game.findById(gameId);
    if (!game) throw new Error('Game not found');

    game.status = 'approved';
    await game.save();

    const io = safeGetIO();
    if (io) {
      io.to(`org:${game.orgId || orgId}`).emit('game:approved', game);
      io.to(`org:${game.orgId || orgId}`).emit('analytics:update');
      io.to(`org:${game.orgId || orgId}`).emit('dashboard:update');
    }

    return game;
  }

  public static async rejectGame(orgId: string, gameId: string, reason?: string) {
    const game = await Game.findById(gameId);
    if (!game) throw new Error('Game not found');

    game.status = 'draft';
    await game.save();

    const io = safeGetIO();
    if (io) {
      io.to(`org:${game.orgId || orgId}`).emit('approvals:updated', { gameId, reason });
      io.to(`org:${game.orgId || orgId}`).emit('analytics:update');
    }

    return { success: true, message: 'Game sent back to draft', game };
  }
}

