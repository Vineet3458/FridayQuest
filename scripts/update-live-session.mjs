import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: 'server/.env' });

async function updateDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in server/.env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const Session = mongoose.model(
    'Session',
    new mongoose.Schema({}, { strict: false, collection: 'sessions' })
  );

  const res = await Session.updateOne(
    { joinCode: 'KIRXA-DEMO' },
    {
      $set: {
        title: 'Team Innovation Challenge',
        location: 'Innovation Lab',
        startTime: '16:00',
        durationMin: 90,
        status: 'live',
      },
    }
  );

  console.log('Updated session KIRXA-DEMO:', res);
  process.exit(0);
}

updateDb().catch((err) => {
  console.error(err);
  process.exit(1);
});

