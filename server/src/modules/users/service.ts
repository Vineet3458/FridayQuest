import { User } from '../../models/User.js';
import { UserRole } from '../../types/index.js';

export class UsersService {
  public static async getMe(userId: string) {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) throw new Error('User not found');
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      department: user.department,
      designation: user.designation || 'Team Member',
      bio: user.bio || '',
      avatar: user.avatar || '',
      employeeId: user.employeeId || '',
      favoritePlayStyle: user.favoritePlayStyle || '⚡ Active',
      snackPreference: user.snackPreference || '☕ Masala Chai',
      slackHandle: user.slackHandle || '',
      location: user.location,
      status: user.status,
      orgId: user.orgId?.toString(),
      xp: user.xp || 0,
      level: user.level || 1,
    };
  }

  public static async updateMe(userId: string, updateData: Record<string, any>) {
    // Prevent updating protected fields
    delete updateData.role;
    delete updateData.orgId;
    delete updateData.passwordHash;
    delete updateData.status;

    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase().trim();
      const existing = await User.findOne({ email: updateData.email, _id: { $ne: userId } });
      if (existing) {
        throw new Error('Email address is already in use by another team member');
      }
    }

    const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select(
      '-passwordHash'
    );
    if (!user) throw new Error('User not found');
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      department: user.department,
      designation: user.designation || 'Team Member',
      bio: user.bio || '',
      avatar: user.avatar || '',
      employeeId: user.employeeId || '',
      favoritePlayStyle: user.favoritePlayStyle || '⚡ Active',
      snackPreference: user.snackPreference || '☕ Masala Chai',
      slackHandle: user.slackHandle || '',
      location: user.location,
      status: user.status,
      orgId: user.orgId?.toString(),
      xp: user.xp || 0,
      level: user.level || 1,
    };
  }

  public static async getOrgUsers(orgId: string) {
    return User.find({ orgId }).select('-passwordHash').sort({ createdAt: -1 });
  }

  public static async approveUser(orgId: string, targetUserId: string) {
    const user = await User.findOneAndUpdate(
      { _id: targetUserId, orgId },
      { $set: { status: 'active' } },
      { new: true }
    ).select('-passwordHash');

    if (!user) throw new Error('User not found in your organization');
    return user;
  }

  public static async updateUserRole(orgId: string, targetUserId: string, role: UserRole) {
    const user = await User.findOneAndUpdate(
      { _id: targetUserId, orgId },
      { $set: { role }, $inc: { tokenVersion: 1 } },
      { new: true }
    ).select('-passwordHash');

    if (!user) throw new Error('User not found in your organization');
    return user;
  }
}
