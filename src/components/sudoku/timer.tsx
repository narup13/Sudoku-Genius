'use client';

import React from 'react';
import { Timer as TimerIcon, PauseCircle } from 'lucide-react';

type TimerProps = {
  time: number;
  isPaused: boolean;
};

export function Timer({ time, isPaused }: TimerProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 text-xl font-semibold tabular-nums tracking-wider text-foreground">
      {isPaused ? <PauseCircle className="h-6 w-6 text-muted-foreground" /> : <TimerIcon className="h-6 w-6 text-muted-foreground" />}
      <span>{formatTime(time)}</span>
    </div>
  );
}
