import {
  calculateGameScore,
  generateAgendaPlan,
  PlannerGameCandidate,
  PlannerVibeInput,
} from './plannerLogic.js';

describe('Auto Planner Algorithm', () => {
  const sampleVibe: PlannerVibeInput = {
    attendingCount: 8,
    avgEnergy: 4.0,
    styleDistribution: {
      active: 6,
      calm: 1,
      brainy: 1,
    },
    skippedGameSlugs: ['boring-game'],
  };

  const sampleGames: PlannerGameCandidate[] = [
    {
      id: 'game-1',
      name: 'Quick Icebreaker',
      slug: 'icebreaker',
      version: 1,
      avgRating: 4.5,
      definition: {
        name: 'Quick Icebreaker',
        slug: 'icebreaker',
        level: 1,
        players: { min: 4, max: 20 },
        durationMin: 10,
        energy: 'low',
        teamMode: 'individual',
        tools: ['timer'],
        rulesShort: 'Short rules',
        rulesFull: 'Full rules',
      },
    },
    {
      id: 'game-2',
      name: 'High Energy Showdown',
      slug: 'high-energy-showdown',
      version: 1,
      avgRating: 4.8,
      definition: {
        name: 'High Energy Showdown',
        slug: 'high-energy-showdown',
        level: 2,
        players: { min: 4, max: 16 },
        durationMin: 25,
        energy: 'high',
        props: ['whistle', 'cards'],
        teamMode: 'teams',
        tools: ['timer', 'buzzer'],
        rulesShort: 'Short rules',
        rulesFull: 'Full rules',
      },
    },
    {
      id: 'game-3',
      name: 'Boring Game',
      slug: 'boring-game',
      version: 1,
      avgRating: 3.0,
      definition: {
        name: 'Boring Game',
        slug: 'boring-game',
        level: 1,
        players: { min: 2, max: 20 },
        durationMin: 15,
        energy: 'low',
        teamMode: 'individual',
        tools: [],
        rulesShort: 'Short',
        rulesFull: 'Full',
      },
    },
  ];

  it('calculates score giving higher preference to energy and rating matches', () => {
    const scoreHigh = calculateGameScore(sampleGames[1], sampleVibe);
    const scoreLow = calculateGameScore(sampleGames[0], sampleVibe);
    expect(scoreHigh).toBeGreaterThan(scoreLow);
  });

  it('filters out games on the skip list', () => {
    const plan = generateAgendaPlan(sampleVibe, sampleGames, 60);
    const includedSlugs = plan.agenda.map((a) => a.gameName);
    expect(includedSlugs).not.toContain('Boring Game');
  });

  it('arranges agenda with warm-up first and collects props checklist', () => {
    const plan = generateAgendaPlan(sampleVibe, sampleGames, 60);
    expect(plan.agenda.length).toBeGreaterThan(0);
    expect(plan.agenda[0].gameName).toBe('Quick Icebreaker');
    expect(plan.propsChecklist).toContain('whistle');
    expect(plan.propsChecklist).toContain('cards');
  });
});

