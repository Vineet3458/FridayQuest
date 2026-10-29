import { GameRoleDefinition } from '../../types/index.js';
import { IRoleAssignment } from '../../models/SessionState.js';

export function assignRoles(
  playerIds: string[],
  roleDefs: GameRoleDefinition[]
): IRoleAssignment[] {
  const rolePool: Array<{ key: string; label: string; visible?: boolean }> = [];

  for (const role of roleDefs) {
    const count = role.count || 1;
    for (let i = 0; i < count; i++) {
      rolePool.push({
        key: role.key,
        label: role.label,
        visible: role.visible,
      });
    }
  }

  // If there are more players than defined roles, fill remainder with default villager/player role
  while (rolePool.length < playerIds.length) {
    rolePool.push({ key: 'player', label: 'Player', visible: false });
  }

  // Fisher-Yates shuffle
  const shuffledPool = [...rolePool];
  for (let i = shuffledPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
  }

  // Assign to players
  return playerIds.map((userId, index) => {
    const assigned = shuffledPool[index];
    return {
      userId,
      roleKey: assigned.key,
      roleLabel: assigned.label,
    };
  });
}

