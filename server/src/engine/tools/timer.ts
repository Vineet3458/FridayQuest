export interface TimerState {
  endsAt?: Date;
  durationSec: number;
  remainingSec: number;
  running: boolean;
}

export function startTimer(durationSec: number): TimerState {
  const endsAt = new Date(Date.now() + durationSec * 1000);
  return {
    endsAt,
    durationSec,
    remainingSec: durationSec,
    running: true,
  };
}

export function pauseTimer(currentTimer: TimerState): TimerState {
  if (!currentTimer.running || !currentTimer.endsAt) {
    return currentTimer;
  }
  const remainingMs = Math.max(0, currentTimer.endsAt.getTime() - Date.now());
  return {
    ...currentTimer,
    remainingSec: Math.ceil(remainingMs / 1000),
    running: false,
    endsAt: undefined,
  };
}

export function resumeTimer(currentTimer: TimerState): TimerState {
  if (currentTimer.running) {
    return currentTimer;
  }
  const durationSec = currentTimer.remainingSec > 0 ? currentTimer.remainingSec : currentTimer.durationSec;
  return startTimer(durationSec);
}

export function getRemainingSec(timer: TimerState): number {
  if (!timer.running || !timer.endsAt) {
    return timer.remainingSec || 0;
  }
  const remainingMs = timer.endsAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

