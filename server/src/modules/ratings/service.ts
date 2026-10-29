import { Rating } from '../../models/Rating.js';
import { Game } from '../../models/Game.js';

export class RatingsService {
  public static async submitRating(
    sessionId: string,
    userId: string,
    orgId: string,
    data: { gameId: string; score: number; comment?: string }
  ) {
    const rating = await Rating.findOneAndUpdate(
      { sessionId, userId, gameId: data.gameId },
      {
        $set: {
          orgId,
          score: data.score,
          comment: data.comment || '',
        },
      },
      { upsert: true, new: true }
    );

    // Recompute game average rating
    const allRatings = await Rating.find({ gameId: data.gameId });
    if (allRatings.length > 0) {
      const sum = allRatings.reduce((acc, r) => acc + r.score, 0);
      const avg = parseFloat((sum / allRatings.length).toFixed(2));
      await Game.findByIdAndUpdate(data.gameId, { $set: { avgRating: avg } });
    }

    return rating;
  }

  public static async getSessionRatings(sessionId: string, orgId: string) {
    return Rating.find({ sessionId, orgId }).populate('userId', 'name avatar');
  }
}

