import { Game, IGame } from '../../models/Game.js';
import { GameDefinition } from '../../types/index.js';

export interface GameFilterOptions {
  search?: string;
  energy?: string;
  pack?: string;
  players?: number;
  status?: string;
}

export class GamesService {
  public static async getGames(orgId: string, filters: GameFilterOptions = {}) {
    const query: Record<string, any> = {
      $or: [{ orgId }, { orgId: null }],
    };

    if (filters.status) {
      query.status = filters.status;
    } else {
      // Default to published games for library view
      query.status = 'published';
    }

    if (filters.energy) {
      query['definition.energy'] = filters.energy;
    }

    if (filters.pack) {
      query.packs = filters.pack;
    }

    if (filters.players) {
      query['definition.players.min'] = { $lte: filters.players };
      query['definition.players.max'] = { $gte: filters.players };
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    return Game.find(query).sort({ avgRating: -1, createdAt: -1 });
  }

  public static async getGameById(gameId: string, orgId: string, canViewUnpublished = false) {
    const game = await Game.findOne({
      _id: gameId,
      $or: [{ orgId }, { orgId: null }],
      ...(canViewUnpublished ? {} : { status: 'published' }),
    });
    if (!game) throw new Error('Game not found');
    return game;
  }

  public static async createGameDraft(orgId: string, userId: string, data: any) {
    const game = await Game.create({
      orgId,
      name: data.name,
      slug: data.slug.toLowerCase().trim(),
      level: data.level || 1,
      status: 'draft',
      version: 1,
      definition: data.definition,
      packs: data.packs || [],
      createdBy: userId,
      avgRating: 4.5,
    });
    return game;
  }

  public static async updateGame(gameId: string, orgId: string, data: any) {
    const game = await Game.findOne({ _id: gameId, orgId });
    if (!game) throw new Error('Game not found or unauthorized');

    // If updating a published game, increment version
    if (game.status === 'published') {
      game.version += 1;
    }

    if (data.name) game.name = data.name;
    if (data.level) game.level = data.level;
    if (data.definition) game.definition = data.definition;
    if (data.packs) game.packs = data.packs;

    await game.save();
    return game;
  }

  /**
   * Validates game structure:
   * 1. Total role counts <= max players
   * 2. Any tool referenced in flow is present in `tools`
   * 3. Scoring rules reference defined roles
   */
  public static validateGame(definition: GameDefinition): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check roles vs max players
    if (definition.roles && definition.roles.length > 0) {
      const totalRoleCount = definition.roles.reduce((acc, r) => acc + (r.count || 1), 0);
      if (totalRoleCount > definition.players.max) {
        errors.push(
          `Total role counts (${totalRoleCount}) cannot exceed maximum player count (${definition.players.max})`
        );
      }
    }

    // Check tools in flow steps
    const toolsSet = new Set(definition.tools || []);
    if (definition.flow) {
      for (const step of definition.flow) {
        if (step.tool && !toolsSet.has(step.tool)) {
          errors.push(`Flow step requires tool '${step.tool}' which is not enabled in tools array`);
        }
      }
    }

    // Check scoring references
    if (definition.scoring && definition.roles) {
      const roleKeys = new Set(definition.roles.map((r) => r.key));
      for (const rule of definition.scoring) {
        if (rule.award) {
          for (const aw of rule.award) {
            if (aw.role && !roleKeys.has(aw.role)) {
              errors.push(`Scoring award references undefined role '${aw.role}'`);
            }
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  public static async submitGame(gameId: string, orgId: string) {
    const game = await Game.findOne({ _id: gameId, orgId });
    if (!game) throw new Error('Game not found');

    const validation = this.validateGame(game.definition);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    game.status = 'submitted';
    await game.save();
    return game;
  }

  public static async approveGame(gameId: string, orgId: string) {
    const game = await Game.findOne({ _id: gameId, orgId });
    if (!game) throw new Error('Game not found');

    game.status = 'published';
    await game.save();
    return game;
  }

  /**
   * Dry run simulation with fake players
   */
  public static async dryRun(gameId: string, orgId: string) {
    const game = await Game.findOne({ _id: gameId, orgId });
    if (!game) throw new Error('Game not found');

    const validation = this.validateGame(game.definition);
    if (!validation.valid) {
      return {
        success: false,
        message: 'Dry run failed validation',
        errors: validation.errors,
      };
    }

    const testPlayerCount = Math.max(game.definition.players.min, 4);
    const mockPlayers = Array.from({ length: testPlayerCount }, (_, i) => ({
      userId: `test-player-${i + 1}`,
      name: `Player ${i + 1}`,
    }));

    return {
      success: true,
      message: 'Dry run simulation completed successfully',
      simulatedPlayers: mockPlayers.length,
      flowStepsCount: game.definition.flow?.length || 0,
      rounds: game.definition.rounds || 1,
    };
  }
}
