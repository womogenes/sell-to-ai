import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';

export default function Game({
  gameState,
  username,
  submitPitch: submitPitchToServer,
}: any) {
  const scenarioEl: any = useRef(null);
  const convinceEl: any = useRef(null);
  const itemEl: any = useRef(null);
  const [isAnimationFinished, setIsAnimationFinished] = useState<boolean>(true);
  const [isSubmittingPitch, setIsSubmittingPitch] = useState<boolean>(false);
  const [hasSubmittedPitch, setHasSubmittedPitch] = useState<boolean>(false);

  const [playerPitch, setPlayerPitch] = useState<string>('');
  const [timer, setTimer] = useState<number>(20);
  const charLimit = 140;

  useEffect(() => {
    if (!gameState) return;

    new Typed(scenarioEl.current, {
      strings: [gameState.scenario],
      showCursor: false,
      onComplete: () => {
        new Typed(convinceEl.current, {
          strings: [`Convince Alice to buy:`],
          showCursor: false,
          onComplete: async () => {
            await new Promise((r) => setTimeout(r, 500));
            new Typed(itemEl.current, {
              strings: [gameState.items[username]],
              showCursor: false,
              typeSpeed: 200,
              onComplete: () => setIsAnimationFinished(true),
            });
          },
        });
      },
    });
  }, [gameState]);

  useEffect(() => {
    if (!isAnimationFinished) return;

    // Start the countdown
    const endTime = new Date(gameState.expiry_time).getTime();
    const handle = window.setInterval(() => {
      const timer = Math.max((endTime - new Date().getTime()) / 1000, 0);
      if (timer < 0) {
        window.clearInterval(handle);

        // Submit
        console.log('submitting pitch...');
        if (!isSubmittingPitch && !hasSubmittedPitch) submitPitch();
      }
      setTimer(timer);
    });
    return () => window.clearInterval(handle);
  }, [isAnimationFinished]);

  const submitPitch = () => {
    setIsSubmittingPitch(true);
    submitPitchToServer(playerPitch.trim());
    setTimeout(() => {
      setIsSubmittingPitch(false);
      setHasSubmittedPitch(true);
    }, 500);
  };

  return (
    <>
      {/* Timer */}
      {isAnimationFinished && (
        <div className="absolute w-full">
          <div
            className="h-1 bg-yellow-400"
            style={{ width: `${(timer / 20) * 100}vw` }}
          ></div>
          <div className="mt-1 flex flex-col items-center font-mono">
            <span className="text-xs">Time remaining:</span>
            <span className="-mt-1 font-mono text-4xl font-black text-yellow-600">
              {Math.ceil(timer)}
            </span>
          </div>
        </div>
      )}
      <div className="flex w-full flex-col items-center p-6 pt-16">
        <div className="flex h-full w-full flex-col gap-4 md:max-w-md">
          {/* Prompt */}
          <div className="flex h-full grow flex-col justify-end">
            <p className="font-bold">Scenario</p>
            <p ref={scenarioEl}></p>
            <p className="mt-4" ref={convinceEl}></p>
            <p
              className="text-4xl font-black text-yellow-600 md:text-7xl"
              ref={itemEl}
            ></p>
          </div>

          {/* Textbox */}
          <div
            className={cn(
              'flex h-full grow flex-col items-start gap-4 transition-opacity duration-1000',
              isAnimationFinished ? 'opacity-100' : 'opacity-0',
            )}
          >
            <div className="relative w-full pt-2">
              <p className="absolute bottom-2 right-4 text-neutral-400">
                {playerPitch.trim().length} / 140
              </p>
              <Textarea
                className="resize-none px-4 py-3"
                rows={6}
                id="pitch-input"
                value={playerPitch}
                onChange={(e) =>
                  e.target.value.trim().length <= charLimit &&
                  setPlayerPitch(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) submitPitch();
                }}
                spellCheck={false}
                placeholder={`Why should Alice buy ${gameState.items[username]}?`}
                disabled={isSubmittingPitch || hasSubmittedPitch}
              />
              <label
                className="absolute left-2.5 top-0 bg-white px-2 text-sm font-medium text-yellow-600"
                htmlFor="pitch-input"
              >
                Your pitch...
              </label>
            </div>
            <Button
              className="items-center transition-opacity"
              onClick={() => submitPitch()}
              disabled={
                isSubmittingPitch ||
                hasSubmittedPitch ||
                playerPitch.trim().length === 0
              }
            >
              Confirm
              {isSubmittingPitch && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
              {hasSubmittedPitch && <Check className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
