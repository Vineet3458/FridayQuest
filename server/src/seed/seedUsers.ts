import { Organization } from '../models/Organization.js';
import { User, IUser } from '../models/User.js';
import { Session } from '../models/Session.js';
import { VibeCheck } from '../models/VibeCheck.js';
import { hashPassword } from '../utils/password.js';
import { logger } from '../utils/logger.js';
import { UserRole } from '../types/index.js';

export interface SeedPerson {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  xp: number;
  level: number;
  energyPreference: number;
  style: 'active' | 'calm' | 'brainy';
}

export const TWENTY_PEOPLE: SeedPerson[] = [
  // 1. Super Admin (Platform Owner)
  {
    name: 'Kirxa SuperAdmin (Aarav Mehta)',
    email: 'superadmin@kirxa.demo',
    role: 'superAdmin',
    department: 'Platform Operations',
    xp: 950,
    level: 5,
    energyPreference: 4,
    style: 'brainy',
  },

  // 2-3. Org Admins (HR & Operations Managers)
  {
    name: 'Riya Sharma (HR Admin)',
    email: 'riya.hr@kirxa.demo',
    role: 'orgAdmin',
    department: 'People & Culture',
    xp: 780,
    level: 4,
    energyPreference: 4,
    style: 'active',
  },
  {
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@kirxa.demo',
    role: 'orgAdmin',
    department: 'Operations',
    xp: 640,
    level: 4,
    energyPreference: 3,
    style: 'calm',
  },

  // 4-6. Organizers (Rotating Fun Friday Hosts / Emcees)
  {
    name: 'Kabir Patel (Friday Host)',
    email: 'kabir.host@kirxa.demo',
    role: 'organizer',
    department: 'Engineering',
    xp: 590,
    level: 3,
    energyPreference: 5,
    style: 'active',
  },
  {
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@kirxa.demo',
    role: 'organizer',
    department: 'Design',
    xp: 520,
    level: 3,
    energyPreference: 4,
    style: 'active',
  },
  {
    name: 'Rohan Verma',
    email: 'rohan.verma@kirxa.demo',
    role: 'organizer',
    department: 'Product',
    xp: 490,
    level: 3,
    energyPreference: 3,
    style: 'brainy',
  },

  // 7-20. Players (Employees across departments)
  {
    name: 'Ananya Sen',
    email: 'ananya.player@kirxa.demo',
    role: 'player',
    department: 'Design',
    xp: 350,
    level: 2,
    energyPreference: 4,
    style: 'active',
  },
  {
    name: 'Devraj Singh',
    email: 'devraj.singh@kirxa.demo',
    role: 'player',
    department: 'Engineering',
    xp: 410,
    level: 3,
    energyPreference: 5,
    style: 'active',
  },
  {
    name: 'Pooja Nair',
    email: 'pooja.nair@kirxa.demo',
    role: 'player',
    department: 'Engineering',
    xp: 320,
    level: 2,
    energyPreference: 3,
    style: 'brainy',
  },
  {
    name: 'Kunal Roy',
    email: 'kunal.roy@kirxa.demo',
    role: 'player',
    department: 'Engineering',
    xp: 290,
    level: 2,
    energyPreference: 4,
    style: 'active',
  },
  {
    name: 'Priya Deshmukh',
    email: 'priya.deshmukh@kirxa.demo',
    role: 'player',
    department: 'Design',
    xp: 380,
    level: 2,
    energyPreference: 3,
    style: 'calm',
  },
  {
    name: 'Zayn Farooqui',
    email: 'zayn.farooqui@kirxa.demo',
    role: 'player',
    department: 'Design',
    xp: 250,
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
    xp: 310,
    level: 2,
    energyPreference: 3,
    style: 'calm',
  },
  {
    name: 'Tara Sundaram',
    email: 'tara.sundaram@kirxa.demo',
    role: 'player',
    department: 'Marketing',
    xp: 190,
    level: 1,
    energyPreference: 4,
    style: 'brainy',
  },
  {
    name: 'Siddharth Rao',
    email: 'siddharth.rao@kirxa.demo',
    role: 'player',
    department: 'Product',
    xp: 430,
    level: 3,
    energyPreference: 4,
    style: 'brainy',
  },
  {
    name: 'Meera Iyer',
    email: 'meera.iyer@kirxa.demo',
    role: 'player',
    department: 'Product',
    xp: 370,
    level: 2,
    energyPreference: 3,
    style: 'calm',
  },
  {
    name: 'Farhan Akhtar',
    email: 'farhan.akhtar@kirxa.demo',
    role: 'player',
    department: 'Sales',
    xp: 280,
    level: 2,
    energyPreference: 5,
    style: 'active',
  },
  {
    name: 'Tanvi Bhatia',
    email: 'tanvi.bhatia@kirxa.demo',
    role: 'player',
    department: 'Sales',
    xp: 220,
    level: 1,
    energyPreference: 3,
    style: 'calm',
  },
  {
    name: 'Kavita Reddy',
    email: 'kavita.reddy@kirxa.demo',
    role: 'player',
    department: 'Operations',
    xp: 340,
    level: 2,
    energyPreference: 4,
    style: 'active',
  },
];

export async function seedTwentyUsers() {
  try {
    // 1. Ensure Organization exists
    let org = await Organization.findOne({ slug: 'kirxa-demo' });
    if (!org) {
      org = await Organization.create({
        name: 'Kirxa Demo Workspace',
        slug: 'kirxa-demo',
        inviteCode: 'KIRXA-7F3Q',
        settings: { autoApprove: true, timezone: 'UTC' },
        plan: 'enterprise',
      });
      logger.info('Created organization: Kirxa Demo Workspace');
    }

    const defaultPasswordHash = await hashPassword('friday123');

    // 2. Upsert the 20 people
    const seededUsers: IUser[] = [];
    for (const p of TWENTY_PEOPLE) {
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
        // Update role and department if already present
        user.role = p.role;
        user.department = p.department;
        user.status = 'active';
        user.xp = p.xp;
        user.level = p.level;
        await user.save();
      }
      seededUsers.push(user);
    }

    logger.info(`Successfully seeded/verified ${seededUsers.length} users with assigned roles.`);

    // 3. Ensure a live/voting demo session exists with vibe checks from attendees
    let session = await Session.findOne({ orgId: org._id });
    if (!session) {
      const nextFriday = new Date();
      nextFriday.setDate(nextFriday.getDate() + ((5 + 7 - nextFriday.getDay()) % 7 || 7));

      session = await Session.create({
        orgId: org._id,
        organizerId: seededUsers[3]._id, // Kabir Patel
        title: 'Fun Friday Extravaganza',
        date: nextFriday,
        startTime: '16:00',
        durationMin: 90,
        location: 'Cafeteria & Lounge',
        status: 'voting',
        joinCode: 'KIRX7F',
        agenda: [],
        propsChecklist: [],
      });
      logger.info('Created initial Friday session: Fun Friday Extravaganza (Code: KIRX7F)');
    }

    // 4. Seed Vibe Checks for first 14 members so Auto Planner & Vibe summaries have real data
    for (let i = 0; i < 14; i++) {
      const u = seededUsers[i];
      const personData = TWENTY_PEOPLE[i];
      await VibeCheck.findOneAndUpdate(
        { sessionId: session._id, userId: u._id },
        {
          $set: {
            orgId: org._id,
            attending: i === 13 ? 'maybe' : 'yes',
            energy: personData.energyPreference,
            style: personData.style,
            skipGameIds: [],
          },
        },
        { upsert: true }
      );
    }

    logger.info('Seeded initial Vibe Checks for session.');

    return {
      organization: org,
      session,
      users: seededUsers,
      count: seededUsers.length,
    };
  } catch (error) {
    logger.error({ error }, 'Error while seeding 20 users');
    throw error;
  }
}

