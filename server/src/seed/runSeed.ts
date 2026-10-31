import { connectDB } from '../config/db.js';
import { seedFullDemo } from './seedFullDemo.js';
import { User } from '../models/User.js';
import { hashPassword } from '../utils/password.js';

async function run() {
  console.log('Connecting to database...');
  await connectDB();
  console.log('Connected! Running seedFullDemo...');
  const res = await seedFullDemo();
  console.log('Seed result:', res);

  // Guarantee all 4 trial logins with password 'friday123'
  const passwordHash = await hashPassword('friday123');
  const demoUsers = [
    { email: 'superadmin@kirxa.demo', role: 'superAdmin', name: 'Kirxa SuperAdmin' },
    { email: 'amit.admin@kirxa.demo', role: 'orgAdmin', name: 'Amit Verma' },
    { email: 'orgadmin@kirxa.demo', role: 'orgAdmin', name: 'Amit Verma' },
    { email: 'organizer@kirxa.demo', role: 'organizer', name: 'Riya Sharma' },
    { email: 'riya.organizer@kirxa.demo', role: 'organizer', name: 'Riya Sharma' },
    { email: 'player@kirxa.demo', role: 'player', name: 'Kirxa Player' },
  ];

  for (const d of demoUsers) {
    const updated = await User.findOneAndUpdate(
      { email: d.email },
      { $set: { passwordHash, role: d.role, status: 'active', name: d.name } },
      { new: true }
    );
    if (updated) {
      console.log(`Updated password for ${d.email} -> friday123`);
    } else {
      console.log(`User not found: ${d.email}`);
    }
  }

  console.log('Seed and password sync finished successfully.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});

