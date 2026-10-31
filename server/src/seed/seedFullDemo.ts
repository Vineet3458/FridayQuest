import mongoose from 'mongoose';
import { Organization } from '../models/Organization.js';
import { User, IUser } from '../models/User.js';
import { Session, ISession } from '../models/Session.js';
import { SessionState } from '../models/SessionState.js';
import { Team } from '../models/Team.js';
import { VibeCheck } from '../models/VibeCheck.js';
import { Rating } from '../models/Rating.js';
import { ScoreEvent } from '../models/ScoreEvent.js';
import { Game } from '../models/Game.js';
import { hashPassword } from '../utils/password.js';
import { logger } from '../utils/logger.js';
import { UserRole } from '../types/index.js';

interface SeedPerson {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  xp: number;
  level: number;
  energyPreference: number;
  style: 'active' | 'calm' | 'brainy';
}

const DEMO_PEOPLE: SeedPerson[] = [
  // 1. Super Admin
  {
    name: 'Kirxa SuperAdmin',
    email: 'superadmin@kirxa.demo',
    role: 'superAdmin',
    department: 'Platform Operations',
    xp: 950,
    level: 5,
    energyPreference: 5,
    style: 'brainy',
  },
  // 2. Org Admin (Amit Verma)
  {
    name: 'Amit Verma',
    email: 'amit.admin@kirxa.demo',
    role: 'orgAdmin',
    department: 'People & Culture',
    xp: 880,
    level: 5,
    energyPreference: 4,
    style: 'active',
  },
  // 3. Org Admin 2
  {
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@kirxa.demo',
    role: 'orgAdmin',
    department: 'Operations',
    xp: 740,
    level: 4,
    energyPreference: 3,
    style: 'calm',
  },
  // 4. Organizer (Riya Sharma)
  {
    name: 'Riya Sharma',
    email: 'riya.organizer@kirxa.demo',
    role: 'organizer',
    department: 'People & Culture',
    xp: 720,
    level: 4,
    energyPreference: 4,
    style: 'active',
  },
  // 5. Organizer 2 (Kabir Patel)
  {
    name: 'Kabir Patel',
    email: 'kabir.host@kirxa.demo',
    role: 'organizer',
    department: 'Engineering',
    xp: 650,
    level: 4,
    energyPreference: 5,
    style: 'active',
  },
  // 6. Organizer 3
  {
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@kirxa.demo',
    role: 'organizer',
    department: 'Design',
    xp: 580,
    level: 3,
    energyPreference: 4,
    style: 'active',
  },
  // 7-26. Players across departments
  {
    name: 'Ananya Sen',
    email: 'ananya.sen@kirxa.demo',
    role: 'player',
    department: 'Design',
    xp: 450,
    level: 3,
    energyPreference: 4,
    style: 'active',
  },
  {
    name: 'Devraj Singh',
    email: 'devraj.singh@kirxa.demo',
    role: 'player',
    department: 'Engineering',
    xp: 510,
    level: 3,
    energyPreference: 5,
    style: 'active',
  },
  {
    name: 'Pooja Nair',
    email: 'pooja.nair@kirxa.demo',
    role: 'player',
    department: 'Engineering',
    xp: 420,
    level: 3,
    energyPreference: 3,
    style: 'brainy',
  },
  {
    name: 'Kunal Roy',
    email: 'kunal.roy@kirxa.demo',
    role: 'player',
    department: 'Engineering',
    xp: 380,
    level: 2,
    energyPreference: 4,
    style: 'active',
  },
  {
    name: 'Priya Deshmukh',
    email: 'priya.deshmukh@kirxa.demo',
    role: 'player',
    department: 'Design',
    xp: 390,
    level: 2,
    energyPreference: 3,
    style: 'calm',
  },
  {
    name: 'Zayn Farooqui',
    email: 'zayn.farooqui@kirxa.demo',
    role: 'player',
    department: 'Design',
    xp: 320,
    level: 2,
    energyPreference: 4,
    style: 'active',
  },
  {
    name: 'Neha Joshi',
    email: 'neha.joshi@kirxa.demo',
    role: 'player',
    department: 'Marketing',
    xp: 470,
    level: 3,
    energyPreference: 5,
    style: 'active',
  },
  {
    name: 'Arjun Kapoor',
    email: 'arjun.kapoor@kirxa.demo',
    role: 'player',
    department: 'Marketing',
    xp: 340,
    level: 2,
    energyPreference: 3,
    style: 'calm',
  },
  {
    name: 'Tara Sundaram',
    email: 'tara.sundaram@kirxa.demo',
    role: 'player',
    department: 'Marketing',
    xp: 290,
    level: 2,
    energyPreference: 4,
    style: 'brainy',
  },
  {
    name: 'Siddharth Rao',
    email: 'siddharth.rao@kirxa.demo',
    role: 'player',
    department: 'Product',
    xp: 460,
    level: 3,
    energyPreference: 4,
    style: 'brainy',
  },
  {
    name: 'Meera Iyer',
    email: 'meera.iyer@kirxa.demo',
    role: 'player',
    department: 'Product',
    xp: 380,
    level: 2,
    energyPreference: 3,
    style: 'calm',
  },
  {
    name: 'Farhan Akhtar',
    email: 'farhan.akhtar@kirxa.demo',
    role: 'player',
    department: 'Sales',
    xp: 350,
    level: 2,
    energyPreference: 5,
    style: 'active',
  },
  {
    name: 'Tanvi Bhatia',
    email: 'tanvi.bhatia@kirxa.demo',
    role: 'player',
    department: 'Sales',
    xp: 260,
    level: 2,
    energyPreference: 3,
    style: 'calm',
  },
  {
    name: 'Kavita Reddy',
    email: 'kavita.reddy@kirxa.demo',
    role: 'player',
    department: 'Operations',
    xp: 370,
    level: 2,
    energyPreference: 4,
    style: 'active',
  },
  {
    name: 'Rahul Khanna',
    email: 'rahul.khanna@kirxa.demo',
    role: 'player',
    department: 'Finance',
    xp: 410,
    level: 3,
    energyPreference: 3,
    style: 'brainy',
  },
  {
    name: 'Shreya Ghoshal',
    email: 'shreya.ghoshal@kirxa.demo',
    role: 'player',
    department: 'HR',
    xp: 360,
    level: 2,
    energyPreference: 4,
    style: 'active',
  },
  {
    name: 'Aditya Birla',
    email: 'aditya.birla@kirxa.demo',
    role: 'player',
    department: 'Finance',
    xp: 310,
    level: 2,
    energyPreference: 4,
    style: 'calm',
  },
  {
    name: 'Rohan Mehra',
    email: 'rohan.mehra@kirxa.demo',
    role: 'player',
    department: 'Engineering',
    xp: 480,
    level: 3,
    energyPreference: 5,
    style: 'active',
  },
];

export async function seedFullDemo() {
  try {
    logger.info('Starting Full Demo Data Seed...');

    // 1. Ensure Organizations (configured for Indian Standard Time - Asia/Kolkata)
    let org = await Organization.findOne({ slug: 'kirxa-demo' });
    if (!org) {
      org = await Organization.create({
        name: 'Kirxa Labs',
        slug: 'kirxa-demo',
        inviteCode: 'KIRXA-7F3Q',
        settings: { autoApprove: true, timezone: 'Asia/Kolkata' },
        plan: 'enterprise',
      });
    } else {
      if (org.settings?.timezone !== 'Asia/Kolkata') {
        org.settings = { ...org.settings, timezone: 'Asia/Kolkata' };
        await org.save();
      }
    }

    const otherOrgs = [
      { name: 'TechCorp Solutions', slug: 'techcorp-demo', inviteCode: 'TECH-8821', plan: 'growth' },
      { name: 'EduNext Learning', slug: 'edunext-demo', inviteCode: 'EDU-4412', plan: 'starter' },
      { name: 'HealthPlus Systems', slug: 'healthplus-demo', inviteCode: 'HLTH-9901', plan: 'starter' },
    ];
    for (const o of otherOrgs) {
      const exists = await Organization.findOne({ slug: o.slug });
      if (!exists) {
        await Organization.create({
          ...o,
          settings: { autoApprove: true, timezone: 'Asia/Kolkata' },
        });
      }
    }

    // 2. Upsert Demo People
    const defaultPasswordHash = await hashPassword('friday123');
    const seededUsers: IUser[] = [];

    for (const p of DEMO_PEOPLE) {
      let user = await User.findOne({ email: p.email.toLowerCase() });
      if (!user) {
        user = await User.create({
          orgId: org._id,
          name: p.name,
          email: p.email.toLowerCase(),
          passwordHash: defaultPasswordHash,
          role: p.role,
          department: p.department,
          status: 'active',
          xp: p.xp,
          level: p.level,
          preferences: {
            active: p.style === 'active',
            calm: p.style === 'calm',
            brainy: p.style === 'brainy',
            dislikes: [],
          },
        });
      } else {
        user.name = p.name;
        user.role = p.role;
        user.department = p.department;
        user.xp = p.xp;
        user.level = p.level;
        user.status = 'active';
        await user.save();
      }
      seededUsers.push(user);
    }

    // Also ensure trial demo logins match
    const trialLogins = [
      { email: 'player@kirxa.demo', name: 'Kirxa (Player)', role: 'player' as UserRole, dept: 'Engineering' },
      { email: 'organizer@kirxa.demo', name: 'Riya Sharma', role: 'organizer' as UserRole, dept: 'People & Culture' },
      { email: 'orgadmin@kirxa.demo', name: 'Amit Verma', role: 'orgAdmin' as UserRole, dept: 'Management' },
      { email: 'superadmin@kirxa.demo', name: 'Kirxa Platform Owner', role: 'superAdmin' as UserRole, dept: 'Platform' },
    ];
    for (const t of trialLogins) {
      const u = await User.findOne({ email: t.email });
      if (!u) {
        await User.create({
          orgId: org._id,
          name: t.name,
          email: t.email,
          passwordHash: defaultPasswordHash,
          role: t.role,
          department: t.dept,
          status: 'active',
          xp: 450,
          level: 3,
        });
      }
    }

    // 3. Find available games in DB for agenda
    const games = await Game.find({});
    const gameIds = games.map((g) => ({
      gameId: g._id.toString(),
      gameName: g.name,
      durationMin: (g.definition as any)?.estimatedTimeMin || 15,
      version: 1,
    }));

    const sampleAgenda = gameIds.slice(0, 4).map((g, idx) => ({
      gameId: g.gameId,
      gameName: g.gameName,
      durationMin: g.durationMin,
      version: 1,
      order: idx + 1,
      start: `${16 + Math.floor((idx * 20) / 60)}:${((idx * 20) % 60).toString().padStart(2, '0')}`,
    }));

    // 4. Primary Live Session: Fun Friday Kickoff (KIRXA-DEMO)
    let liveSession = await Session.findOne({ joinCode: 'KIRXA-DEMO' });
    const organizerUser = seededUsers.find((u) => u.role === 'organizer') || seededUsers[3];

    // Indian Standard Time (IST, UTC+5:30): Next Friday is Nov 6, 2026, 4:00 PM - 5:30 PM IST
    const nextFridayDate = new Date('2026-11-06T16:00:00+05:30');

    if (!liveSession) {
      liveSession = await Session.create({
        orgId: org._id,
        organizerId: organizerUser._id,
        title: 'Team Innovation Challenge',
        date: nextFridayDate,
        startTime: '16:00',
        durationMin: 90,
        location: 'Innovation Lab',
        status: 'live',
        joinCode: 'KIRXA-DEMO',
        agenda: sampleAgenda,
        propsChecklist: ['Whiteboard & Markers', 'Buzzer bell sound', 'Team bandanas', 'Mic and projector'],
      });
      logger.info('Created primary live demo session: Team Innovation Challenge (KIRXA-DEMO) [IST Nov 6, 2026]');
    } else {
      liveSession.title = 'Team Innovation Challenge';
      liveSession.date = nextFridayDate;
      liveSession.location = 'Innovation Lab';
      liveSession.startTime = '16:00';
      liveSession.durationMin = 90;
      liveSession.status = 'live';
      if (!liveSession.agenda || liveSession.agenda.length === 0) {
        liveSession.agenda = sampleAgenda;
      }
      await liveSession.save();
    }

    // 5. Seed Teams for KIRXA-DEMO
    const teamConfigs = [
      { name: 'Team Alpha', color: '#EF4444', members: seededUsers.slice(6, 11).map((u) => u._id) },
      { name: 'Team Bravo', color: '#3B82F6', members: seededUsers.slice(11, 16).map((u) => u._id) },
      { name: 'Team Charlie', color: '#8B5CF6', members: seededUsers.slice(16, 20).map((u) => u._id) },
      { name: 'Team Delta', color: '#F59E0B', members: seededUsers.slice(20, 24).map((u) => u._id) },
    ];

    await Team.deleteMany({ sessionId: liveSession._id });
    for (const tc of teamConfigs) {
      await Team.create({
        sessionId: liveSession._id,
        orgId: org._id,
        name: tc.name,
        color: tc.color,
        memberIds: tc.members,
        scope: 'session',
      });
    }

    // 6. Ensure SessionState for live play
    let state = await SessionState.findOne({ sessionId: liveSession._id });
    if (!state) {
      state = await SessionState.create({
        sessionId: liveSession._id,
        orgId: org._id,
        currentGameIdx: 0,
        stepIdx: 1,
        round: 2,
        timers: {
          running: true,
          durationSec: 30,
          endsAt: new Date(Date.now() + 25000),
        },
        roleAssignments: [
          {
            userId: seededUsers[6]._id.toString(),
            roleKey: 'detective',
            roleLabel: 'Detective',
            secretValue: 'Find the Liar in Team Alpha',
          },
          {
            userId: seededUsers[7]._id.toString(),
            roleKey: 'liar',
            roleLabel: 'The Secret Liar',
            secretValue: 'Bluff your teammates smoothly!',
          },
        ],
        scores: {
          'Team Alpha': 80,
          'Team Bravo': 60,
          'Team Charlie': 40,
          'Team Delta': 20,
        },
        buzzerState: { locked: false },
        votes: [],
        paused: false,
        status: 'in_progress',
      });
    } else {
      state.scores = {
        'Team Alpha': 80,
        'Team Bravo': 60,
        'Team Charlie': 40,
        'Team Delta': 20,
      };
      state.status = 'in_progress';
      state.buzzerState = { locked: false };
      await state.save();
    }

    // 7. Seed Vibe Checks for 20 attendees on KIRXA-DEMO
    await VibeCheck.deleteMany({ sessionId: liveSession._id });
    for (let i = 0; i < Math.min(22, seededUsers.length); i++) {
      const u = seededUsers[i];
      const p = DEMO_PEOPLE[i] || DEMO_PEOPLE[0];
      await VibeCheck.create({
        sessionId: liveSession._id,
        userId: u._id,
        orgId: org._id,
        attending: i >= 20 ? 'maybe' : 'yes',
        energy: p.energyPreference,
        style: p.style,
        skipGameIds: [],
      });
    }

    // 8. Ensure Upcoming & Past Sessions (in Indian Standard Time)
    const otherSessions = [
      {
        title: 'Diwali Special Extravaganza',
        joinCode: 'DIWALI26',
        status: 'planned',
        location: 'Main Hall & Terrace, Noida',
        date: new Date('2026-11-13T16:30:00+05:30'),
        startTime: '16:30',
        durationMin: 120,
      },
      {
        title: 'Fun Friday Kickoff',
        joinCode: 'KICKOFF26',
        status: 'planned',
        location: 'Cafeteria, Noida',
        date: new Date('2026-11-20T16:00:00+05:30'),
        startTime: '16:00',
        durationMin: 90,
      },
      {
        title: 'September Fun Friday',
        joinCode: 'SEP2026',
        status: 'done',
        location: 'Cafeteria, Noida',
        date: new Date('2026-09-25T16:00:00+05:30'),
        startTime: '16:00',
        durationMin: 90,
      },
      {
        title: 'Independence Special',
        joinCode: 'AUG2026',
        status: 'done',
        location: 'Amphitheater',
        date: new Date('2026-08-14T15:30:00+05:30'),
        startTime: '15:30',
        durationMin: 90,
      },
      {
        title: 'Team Bonding Day',
        joinCode: 'JUL2026',
        status: 'done',
        location: 'Terrace Lounge',
        date: new Date('2026-07-31T16:00:00+05:30'),
        startTime: '16:00',
        durationMin: 90,
      },
    ];

    for (const os of otherSessions) {
      const s = await Session.findOne({ joinCode: os.joinCode });
      if (!s) {
        await Session.create({
          orgId: org._id,
          organizerId: organizerUser._id,
          title: os.title,
          date: os.date,
          startTime: os.startTime,
          durationMin: os.durationMin,
          location: os.location,
          status: os.status,
          joinCode: os.joinCode,
          agenda: sampleAgenda.slice(0, 2),
          propsChecklist: ['Standard games kit'],
        });
      }
    }

    // 9. Seed Ratings for past sessions
    const pastSession = await Session.findOne({ joinCode: 'SEP2026' });
    if (pastSession) {
      const ratingComments = [
        { score: 5, comment: 'Best Friday session ever! The energy was through the roof.' },
        { score: 5, comment: 'Loved Two Truths & a Lie! Great bonding experience.' },
        { score: 4, comment: 'Super engaging and fun. Would love more trivia next time.' },
        { score: 5, comment: 'The buzzer round had our entire team screaming with excitement!' },
      ];
      for (let i = 0; i < ratingComments.length; i++) {
        const rc = ratingComments[i];
        await Rating.findOneAndUpdate(
          { sessionId: pastSession._id, userId: seededUsers[i]._id },
          {
            $set: {
              orgId: org._id,
              gameId: 'all',
              score: rc.score,
              comment: rc.comment,
            },
          },
          { upsert: true }
        );
      }
    }

    // 10. Seed Score Events for past session
    if (pastSession) {
      await ScoreEvent.deleteMany({ sessionId: pastSession._id });
      await ScoreEvent.create([
        {
          sessionId: pastSession._id,
          orgId: org._id,
          round: 1,
          points: 120,
          reason: 'Round 1 Winner: Speed Buzz',
          createdBy: organizerUser._id,
        },
        {
          sessionId: pastSession._id,
          orgId: org._id,
          round: 2,
          points: 100,
          reason: 'Flawless Secret Role Bluff',
          createdBy: organizerUser._id,
        },
      ]);
    }

    logger.info('Full Demo Data Seed Completed Successfully!');
    return {
      success: true,
      orgCount: 4,
      userCount: seededUsers.length,
      liveSessionCode: 'KIRXA-DEMO',
    };
  } catch (error) {
    logger.error({ error }, 'Error in seedFullDemo');
    throw error;
  }
}
