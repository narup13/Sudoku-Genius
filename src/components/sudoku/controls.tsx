'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Undo, Redo, Lightbulb, CheckCircle, RotateCcw, LoaderCircle } from 'lucide-react';

type ControlsProps = {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onHint: () => void;
  onSolve: () => void;
  onRestart: () => void;
  isSolving: boolean;
};

export function Controls({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onHint,
  onSolve,
  onRestart,
  isSolving,
}: ControlsProps) {
  const controlButtons = [
    {
      label: 'Undo',
      icon: <Undo className="h-5 w-5" />,
      action: onUndo,
      disabled: !canUndo,
    },
    {
      label: 'Redo',
      icon: <Redo className="h-5 w-5" />,
      action: onRedo,
      disabled: !canRedo,
    },
    {
      label: 'Hint',
      icon: <Lightbulb className="h-5 w-5" />,
      action: onHint,
    },
    {
      label: 'Solve',
      icon: isSolving ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />,
      action: onSolve,
      disabled: isSolving,
    },
    {
      label: 'Restart',
      icon: <RotateCcw className="h-5 w-5" />,
      action: onRestart,
    },
  ];

  return (
    <div className="rounded-lg border bg-card p-2 text-card-foreground">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-2">
        {controlButtons.map(({ label, icon, action, disabled }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center">
                 <Button
                    variant="ghost"
                    size="lg"
                    onClick={action}
                    disabled={disabled}
                    className="h-16 w-full flex-col gap-1"
                >
                    {icon}
                    <span className="text-xs">{label}</span>
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
