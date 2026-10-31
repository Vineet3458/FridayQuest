import { Game } from '../models/Game.js';
import { logger } from '../utils/logger.js';
import { GameDefinition } from '../types/index.js';

export interface SeedGame {
  name: string;
  slug: string;
  level: 1 | 2 | 3;
  status: 'published';
  version: number;
  packs: string[];
  avgRating: number;
  definition: GameDefinition;
}

export const OFFICIAL_GAMES: SeedGame[] = [
  // 1. Mafia / Werewolf
  {
    name: 'Mafia / Werewolf',
    slug: 'mafia-werewolf',
    level: 2,
    status: 'published',
    version: 1,
    packs: ['classic', 'party', 'deception'],
    avgRating: 4.8,
    definition: {
      name: 'Mafia / Werewolf',
      slug: 'mafia-werewolf',
      level: 2,
      players: { min: 6, max: 20 },
      durationMin: 30,
      energy: 'medium',
      noise: 'medium',
      props: [],
      tags: ['Social Deduction', 'Bluffing', 'Secret Roles', 'Popular'],
      teamMode: 'individual',
      tools: ['secretRole', 'timer', 'voting'],
      roles: [
        { key: 'mafia', label: 'Mafia', count: 2 },
        { key: 'detective', label: 'Detective', count: 1 },
        { key: 'doctor', label: 'Doctor', count: 1 },
        { key: 'villager', label: 'Villager', count: 6 },
      ],
      rulesShort:
        'Night falls and Mafia eliminates in secret. Day arrives: colleagues debate and vote out suspects.',
      rulesFull:
        'The app deals secret roles privately to each phone. During the night phase, Mafia players secretly choose a target on their phones; Doctor picks someone to protect; Detective checks one suspect. During the day phase, the eliminated coworker is revealed, a discussion timer starts, and all surviving members cast their vote.',
    },
  },

  // 2. Chor-Police (Raja, Mantri, Chor, Sipahi)
  {
    name: 'Chor-Police',
    slug: 'chor-police',
    level: 2,
    status: 'published',
    version: 1,
    packs: ['desi-classics', 'quick', 'office'],
    avgRating: 4.9,
    definition: {
      name: 'Chor-Police',
      slug: 'chor-police',
      level: 2,
      players: { min: 4, max: 12 },
      durationMin: 15,
      energy: 'medium',
      noise: 'high',
      props: [],
      tags: ['Desi Classic', 'Bluffing', 'Fast Rounds', 'Trending'],
      teamMode: 'rounds-of-n',
      tools: ['secretRole', 'timer', 'scorekeeper'],
      roles: [
        { key: 'raja', label: 'Raja (1000 pts)', count: 1 },
        { key: 'mantri', label: 'Mantri (800 pts)', count: 1 },
        { key: 'chor', label: 'Chor (0 pts)', count: 1 },
        { key: 'sipahi', label: 'Sipahi (500 pts)', count: 1 },
      ],
      rulesShort:
        'Raja commands Mantri to deduce who is the Chor. Mantri has 60 seconds to pick the suspect.',
      rulesFull:
        'Roles (Raja, Mantri, Chor, Sipahi) are dealt privately on phones. The Raja announces "Mantri, find the Chor!" The Mantri has 60 seconds to deduce and select who is holding the Chor role. If correct, Mantri scores 800 pts; if wrong, the Chor scores 800 pts. Raja (1000) and Sipahi (500) keep fixed points.',
    },
  },

  // 3. Team Trivia with Buzzer
  {
    name: 'Team Trivia with Buzzer',
    slug: 'team-trivia-buzzer',
    level: 2,
    status: 'published',
    version: 1,
    packs: ['corporate', 'trivia', 'competitive'],
    avgRating: 4.7,
    definition: {
      name: 'Team Trivia with Buzzer',
      slug: 'team-trivia-buzzer',
      level: 2,
      players: { min: 6, max: 40 },
      durationMin: 20,
      energy: 'high',
      noise: 'high',
      props: [],
      tags: ['Buzzer Battle', 'Trivia', 'Team vs Team', 'High Energy'],
      teamMode: 'teams',
      tools: ['buzzer', 'timer', 'scorekeeper'],
      rulesShort:
        'Projector displays the trivia question; the fastest team to slam the phone buzzer answers.',
      rulesFull:
        'The cafeteria projector displays questions on company trivia, tech culture, and general knowledge. Teams huddle and tap their phone buzzer. The server records millisecond-accurate lockout. First team gets 30 seconds to answer verbally. Correct answer scores 100 pts; wrong answer unlocks the buzzer for opponents.',
    },
  },

  // 4. Two Truths and a Lie (Office Edition)
  {
    name: 'Two Truths and a Lie',
    slug: 'two-truths-and-a-lie',
    level: 2,
    status: 'published',
    version: 1,
    packs: ['icebreaker', 'office', 'getting-to-know'],
    avgRating: 4.6,
    definition: {
      name: 'Two Truths and a Lie',
      slug: 'two-truths-and-a-lie',
      level: 2,
      players: { min: 4, max: 20 },
      durationMin: 15,
      energy: 'low',
      noise: 'low',
      props: [],
      tags: ['Icebreaker', 'Getting to Know You', 'Calm', 'Conversational'],
      teamMode: 'individual',
      tools: ['timer', 'voting'],
      rulesShort:
        'Colleagues submit 3 statements with 1 lie. The room votes to sniff out the deception.',
      rulesFull:
        'Each coworker enters 2 true facts and 1 convincing lie in the app. One by one, their statements appear on the room screen and player phones. Everyone has 45 seconds to vote for which statement is a lie. Earn points for guessing right, and bonus points for every colleague you fooled!',
    },
  },

  // 5. Jargon Charades
  {
    name: 'Jargon Charades',
    slug: 'jargon-charades',
    level: 1,
    status: 'published',
    version: 1,
    packs: ['office', 'acting', 'humor'],
    avgRating: 4.5,
    definition: {
      name: 'Jargon Charades',
      slug: 'jargon-charades',
      level: 1,
      players: { min: 6, max: 30 },
      durationMin: 20,
      energy: 'high',
      noise: 'high',
      props: [],
      tags: ['Charades', 'Acting', 'Corporate Humor', 'Team vs Team'],
      teamMode: 'teams',
      tools: ['timer', 'scorekeeper'],
      rulesShort:
        'Actor receives secret tech/office jargon on their phone and acts it out silently for their team.',
      rulesFull:
        'The designated actor receives a secret corporate term or jargon (e.g. "Sprint Retrospective", "Production Outage", "Synergy", "Bandwidth") on their phone. They have 60 seconds to act it out without speaking or mouthing words. The team shouts guesses; the host records passes and correct guesses.',
    },
  },

  // 6. Blind Pictionary
  {
    name: 'Blind Pictionary',
    slug: 'blind-pictionary',
    level: 1,
    status: 'published',
    version: 1,
    packs: ['creative', 'drawing', 'party'],
    avgRating: 4.6,
    definition: {
      name: 'Blind Pictionary',
      slug: 'blind-pictionary',
      level: 1,
      players: { min: 4, max: 20 },
      durationMin: 15,
      energy: 'medium',
      noise: 'medium',
      props: ['Paper', 'Markers / Whiteboard'],
      tags: ['Drawing', 'Creative', 'Hilarious', 'Physical Props'],
      teamMode: 'teams',
      tools: ['timer', 'voting', 'scorekeeper'],
      rulesShort:
        'Drawer gets a secret prompt and must sketch it blindfolded while teammates guess.',
      rulesFull:
        'The drawer gets a secret prompt on their phone and must close their eyes or wear a blindfold while sketching on paper or whiteboard. The team has 60 seconds to guess what is being drawn. At round end, everyone votes on the most artistic and funniest drawings for bonus points!',
    },
  },

  // 7. Spaghetti & Marshmallow Tower
  {
    name: 'Marshmallow Tower',
    slug: 'marshmallow-tower',
    level: 1,
    status: 'published',
    version: 1,
    packs: ['engineering', 'physical', 'team-building'],
    avgRating: 4.4,
    definition: {
      name: 'Marshmallow Tower',
      slug: 'marshmallow-tower',
      level: 1,
      players: { min: 4, max: 24 },
      durationMin: 15,
      energy: 'medium',
      noise: 'medium',
      props: ['Spaghetti Sticks', 'Marshmallows', 'Masking Tape'],
      tags: ['Team Building', 'Engineering', 'Hands-On', 'Physical Props'],
      teamMode: 'teams',
      tools: ['timer', 'scorekeeper', 'voting'],
      rulesShort:
        'Build the tallest freestanding tower using raw spaghetti and marshmallows in 15 minutes.',
      rulesFull:
        'Each team receives 20 sticks of raw spaghetti, 1 meter of tape, 1 meter of string, and 1 marshmallow. Teams have 15 minutes to design and erect the tallest freestanding tower with the marshmallow sitting on top. Structures must stand unsupported when the timer ends.',
    },
  },

  // 8. Antakshari Team Battle
  {
    name: 'Antakshari Team Battle',
    slug: 'antakshari-team-battle',
    level: 2,
    status: 'published',
    version: 1,
    packs: ['desi-classics', 'music', 'high-energy'],
    avgRating: 4.9,
    definition: {
      name: 'Antakshari Team Battle',
      slug: 'antakshari-team-battle',
      level: 2,
      players: { min: 8, max: 40 },
      durationMin: 25,
      energy: 'high',
      noise: 'high',
      props: [],
      tags: ['Music', 'Desi Classic', 'Buzzer Battle', 'Audience Favorite'],
      teamMode: 'teams',
      tools: ['buzzer', 'timer', 'scorekeeper'],
      rulesShort:
        'Relay song competition with live buzzer lockout and strict 15-second response timers.',
      rulesFull:
        'Host triggers a starting syllable or theme on the screen. Teams hit their phone buzzer to lock in. The fastest team has 15 seconds to sing a 2-line verse starting with the required letter. No repeat songs permitted. Crowd cheers and points update live on the cafeteria projector!',
    },
  },
];

export async function seedGames() {
  try {
    for (const gameData of OFFICIAL_GAMES) {
      await Game.findOneAndUpdate(
        { slug: gameData.slug, orgId: null },
        { ...gameData, orgId: null },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    logger.info(`Successfully seeded ${OFFICIAL_GAMES.length} official FridayQuest games.`);
  } catch (err: any) {
    logger.error('Failed to seed official games:', err.message);
  }
}

