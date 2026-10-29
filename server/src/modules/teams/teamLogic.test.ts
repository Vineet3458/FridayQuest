import {
  generateTeams,
  calculatePartitionCost,
  Attendee,
  PairingInteraction,
} from './teamLogic.js';

describe('Team Maker Algorithm', () => {
  const sampleAttendees: Attendee[] = [
    { userId: 'u1', name: 'Alice', department: 'Engineering' },
    { userId: 'u2', name: 'Bob', department: 'Engineering' },
    { userId: 'u3', name: 'Charlie', department: 'Design' },
    { userId: 'u4', name: 'Diana', department: 'Design' },
    { userId: 'u5', name: 'Eve', department: 'Marketing' },
    { userId: 'u6', name: 'Frank', department: 'Marketing' },
  ];

  it('generates equal sized teams', () => {
    const teams = generateTeams(sampleAttendees, 2, [], 'mixed');
    expect(teams.length).toBe(2);
    expect(teams[0].members.length).toBe(3);
    expect(teams[1].members.length).toBe(3);
  });

  it('minimizes same-department clustering in mixed mode', () => {
    const teams = generateTeams(sampleAttendees, 2, [], 'mixed');
    // In an optimal 3 vs 3 partition of 2 Eng, 2 Design, 2 Mkt, each team should have 1 from each dept
    const deptsTeam0 = new Set(teams[0].members.map((m) => m.department));
    const deptsTeam1 = new Set(teams[1].members.map((m) => m.department));
    expect(deptsTeam0.size).toBe(3);
    expect(deptsTeam1.size).toBe(3);
  });

  it('penalizes repeated pairings from past interactions', () => {
    const pastInteractions: PairingInteraction[] = [
      { userA: 'u1', userB: 'u2', count: 10 },
    ];
    const map = new Map<string, number>();
    map.set('u1:u2', 10);

    const badTeam: Attendee[][] = [
      [sampleAttendees[0], sampleAttendees[1]], // u1 & u2 together
      [sampleAttendees[2], sampleAttendees[3]],
    ];

    const goodTeam: Attendee[][] = [
      [sampleAttendees[0], sampleAttendees[2]], // u1 with u3
      [sampleAttendees[1], sampleAttendees[3]], // u2 with u4
    ];

    const costBad = calculatePartitionCost(badTeam, map);
    const costGood = calculatePartitionCost(goodTeam, map);
    expect(costBad).toBeGreaterThan(costGood);
  });
});

