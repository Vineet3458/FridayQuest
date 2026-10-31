import mongoose from 'mongoose';
import { Organization } from '../models/Organization.js';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { Rating } from '../models/Rating.js';
import { VibeCheck } from '../models/VibeCheck.js';
import { Game } from '../models/Game.js';
import { connectDB } from '../config/db.js';

export async function seedRichAnalytics() {
  await connectDB();

  const org = await Organization.findOne({ slug: { $regex: /kirxa/i } }) || await Organization.findOne({});
  if (!org) {
    console.log('No organization found to seed analytics');
    return;
  }

  const users = await User.find({ orgId: org._id });
  if (users.length === 0) {
    console.log('No users found in organization');
    return;
  }

  const games = await Game.find({});
  const organizer = users.find((u) => u.role === 'organizer') || users[0];

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // 1. Seed realistic historical and upcoming sessions
  const sessionDefs = [
    {
      title: 'October Fun Friday Fiesta',
      joinCode: 'OCT2026',
      status: 'done',
      date: new Date(now - 7 * dayMs),
      createdAt: new Date(now - 10 * dayMs),
      location: 'Main Cafeteria & Lounge, Noida',
    },
    {
      title: 'September Game Fest',
      joinCode: 'SEP2026',
      status: 'done',
      date: new Date(now - 35 * dayMs),
      createdAt: new Date(now - 38 * dayMs),
      location: 'Cafeteria, Noida',
    },
    {
      title: 'Independence Day Special',
      joinCode: 'AUG2026',
      status: 'done',
      date: new Date(now - 75 * dayMs),
      createdAt: new Date(now - 80 * dayMs),
      location: 'Amphitheater',
    },
    {
      title: 'Mid-Year Team Bonding',
      joinCode: 'JUL2026',
      status: 'done',
      date: new Date(now - 105 * dayMs),
      createdAt: new Date(now - 110 * dayMs),
      location: 'Terrace Lounge',
    },
    {
      title: 'Summer Splash Friday',
      joinCode: 'JUN2026',
      status: 'done',
      date: new Date(now - 135 * dayMs),
      createdAt: new Date(now - 140 * dayMs),
      location: 'Cafeteria & Terrace',
    },
    {
      title: 'Spring Innovation Kickoff',
      joinCode: 'MAY2026',
      status: 'done',
      date: new Date(now - 165 * dayMs),
      createdAt: new Date(now - 170 * dayMs),
      location: 'Town Hall',
    },
    {
      title: 'Fun Friday Kickoff',
      joinCode: 'KIRXA-DEMO',
      status: 'live',
      date: new Date(),
      createdAt: new Date(now - 2 * 60 * 60 * 1000), // 2 hours ago
      location: 'Cafeteria, Noida',
    },
    {
      title: 'Diwali Special Extravaganza',
      joinCode: 'DIWALI26',
      status: 'planned',
      date: new Date(now + 6 * dayMs),
      createdAt: new Date(now - 4 * 60 * 60 * 1000), // 4 hours ago
      location: 'Main Hall & Terrace, Noida',
    },
    {
      title: 'Team Innovation Challenge',
      joinCode: 'INNOV26',
      status: 'planned',
      date: new Date(now + 20 * dayMs),
      createdAt: new Date(now - 24 * 60 * 60 * 1000), // 1 day ago
      location: 'Innovation Lab',
    },
  ];

  const savedSessions: any[] = [];
  for (const s of sessionDefs) {
    let session = await Session.findOne({ joinCode: s.joinCode });
    if (!session) {
      session = await Session.create({
        orgId: org._id,
        organizerId: organizer._id,
        title: s.title,
        date: s.date,
        createdAt: s.createdAt,
        updatedAt: s.createdAt,
        startTime: '16:00',
        durationMin: 90,
        location: s.location,
        status: s.status,
        joinCode: s.joinCode,
        agenda: games.slice(0, 3).map((g, i) => ({
          gameId: g._id.toString(),
          gameName: g.name,
          durationMin: 20,
          version: 1,
          order: i + 1,
          start: `16:${(i * 20).toString().padStart(2, '0')}`,
        })),
        propsChecklist: ['Whiteboard & Markers', 'Buzzer bell sound', 'Team bandanas'],
      });
    } else {
      session.date = s.date;
      session.createdAt = s.createdAt;
      session.status = s.status as any;
      await session.save();
    }
    savedSessions.push(session);
  }

  // 2. Seed realistic employee ratings and feedback comments
  const feedbackData = [
    {
      comment: 'Antakshari round was pure nostalgia! Engineering vs Product was so close and exciting.',
      score: 5,
      offsetMin: 25, // 25 mins ago
    },
    {
      comment: 'Loved Two Truths & a Lie! I discovered so many unexpected talents about my teammates.',
      score: 5,
      offsetMin: 70, // 1 hour ago
    },
    {
      comment: 'The buzzer latency was super low on mobile. Buzzer battle was exhilarating!',
      score: 5,
      offsetMin: 180, // 3 hours ago
    },
    {
      comment: 'Great break from the sprint deadline stress. Exactly what we needed on a Friday afternoon.',
      score: 4,
      offsetMin: 320, // 5 hours ago
    },
    {
      comment: 'Chor-Police kept everyone guessing. The detective role cards were brilliant.',
      score: 5,
      offsetMin: 1440, // 1 day ago
    },
    {
      comment: 'Loved the healthy competition between departments! Marketing brought great vibes.',
      score: 5,
      offsetMin: 1800, // 1.2 days ago
    },
    {
      comment: 'Interactive UI and TV projector screen view looked very modern and crisp.',
      score: 4,
      offsetMin: 2880, // 2 days ago
    },
    {
      comment: 'The team maker balanced junior and senior members nicely. Made new friends across teams.',
      score: 5,
      offsetMin: 4320, // 3 days ago
    },
    {
      comment: 'Snack rewards and coffee vouchers at the end were awesome! Can we do this every week?',
      score: 5,
      offsetMin: 6000, // 4 days ago
    },
    {
      comment: 'Super engaging energy throughout. Looking forward to the Diwali special next week!',
      score: 5,
      offsetMin: 8000, // 5 days ago
    },
    {
      comment: 'QR Treasure Hunt got everyone moving around the cafeteria. Great physical activity!',
      score: 4,
      offsetMin: 10000, // 7 days ago
    },
    {
      comment: 'Well organized session. Kudos to Riya and Kabir for keeping the energy high.',
      score: 5,
      offsetMin: 14000, // 10 days ago
    },
  ];

  await Rating.deleteMany({ orgId: org._id });

  const pastSess = savedSessions.find((s) => s.status === 'done') || savedSessions[0];
  const liveSess = savedSessions.find((s) => s.joinCode === 'KIRXA-DEMO') || savedSessions[0];

  for (let i = 0; i < feedbackData.length; i++) {
    const item = feedbackData[i];
    const user = users[i % users.length];
    const sess = i % 2 === 0 ? pastSess : liveSess;
    const createdAt = new Date(now - item.offsetMin * 60 * 1000);

    await Rating.create({
      sessionId: sess._id,
      orgId: org._id,
      gameId: 'all',
      userId: user._id,
      score: item.score,
      comment: item.comment,
      createdAt,
      updatedAt: createdAt,
    });
  }

  // 3. Seed real Vibe Checks across sessions
  await VibeCheck.deleteMany({ orgId: org._id });
  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    const createdAt = new Date(now - (i * 35 + 10) * 60 * 1000);
    await VibeCheck.create({
      sessionId: liveSess._id,
      userId: u._id,
      orgId: org._id,
      attending: i < 28 ? 'yes' : 'maybe',
      energy: (i % 3) + 3, // 3 to 5
      style: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'brainy' : 'calm',
      skipGameIds: [],
      createdAt,
      updatedAt: createdAt,
    });
  }

  // Seed vibes for past sessions as well to power multi-month aggregations
  const completedSessions = savedSessions.filter((s) => s.status === 'done');
  for (const s of completedSessions) {
    for (let j = 0; j < Math.min(25, users.length); j++) {
      const u = users[j];
      const sessDate = new Date(s.date || now);
      await VibeCheck.create({
        sessionId: s._id,
        userId: u._id,
        orgId: org._id,
        attending: 'yes',
        energy: (j % 3) + 3,
        style: j % 2 === 0 ? 'active' : 'brainy',
        skipGameIds: [],
        createdAt: sessDate,
        updatedAt: sessDate,
      });
    }
  }

  console.log(`✅ Rich analytics seeded successfully for ${org.name}:`);
  console.log(`- ${sessionDefs.length} sessions`);
  console.log(`- ${feedbackData.length} genuine employee ratings & comments`);
  console.log(`- ${users.length} active vibe checks`);
}

if (process.argv[1]?.endsWith('seedRichAnalytics.ts')) {
  seedRichAnalytics()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

