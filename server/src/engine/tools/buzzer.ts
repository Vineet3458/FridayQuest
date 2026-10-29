export interface BuzzerStatus {
  locked: boolean;
  lockedByUserId?: string;
  lockedByUserName?: string;
  lockedAt?: Date;
}

export function attemptBuzz(
  current: BuzzerStatus,
  userId: string,
  userName: string
): { success: boolean; state: BuzzerStatus } {
  if (current.locked) {
    return { success: false, state: current };
  }

  const newState: BuzzerStatus = {
    locked: true,
    lockedByUserId: userId,
    lockedByUserName: userName,
    lockedAt: new Date(),
  };

  return { success: true, state: newState };
}

export function resetBuzzer(): BuzzerStatus {
  return {
    locked: false,
    lockedByUserId: undefined,
    lockedByUserName: undefined,
    lockedAt: undefined,
  };
}

