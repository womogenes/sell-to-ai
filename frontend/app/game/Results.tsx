import { Button } from '@/components/ui/button';
import { cn, typed } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Results({ gameState, startGame, setShowWinner }: any) {
  const scenarioEl = useRef(null);
  const [readyNext, setReadyNext] = useState(false);
  const [hasClickedNext, setHasClickedNext] = useState(false);

  useEffect(() => {
    if (!gameState) return;
    if (!gameState.round_ended[gameState.round_count]) setHasClickedNext(false);
  }, [gameState]);

  useEffect(() => {
    (async () => {
      await typed(scenarioEl.current, gameState.scenario);
      for (let name of gameState.players) {
        await typed(document.querySelector(`#name-${name}`), name, {}, 1000);
        await typed(
          document.querySelector(`#item-${name}`),
          gameState.items[name],
          {},
          500,
        );
        await typed(
          document.querySelector(`#pitch-${name}`),
          gameState.pitches[name],
          { contentType: 'null' },
          500,
        );
      }
      await typed(
        document.querySelector('#alice-thoughts-label'),
        "Alice's thoughts:",
        {},
        500,
      );
      await typed(
        document.querySelector('#alice-thoughts'),
        gameState.thoughts,
        {},
        500,
      );
      await typed(
        document.querySelector('#winner'),
        gameState.winner,
        {},
        1000,
      );
      await new Promise((r) => setTimeout(r, 1000));
      setShowWinner(true);
      setReadyNext(true);
    })();
  }, []);

  useEffect(() => {
    if (!gameState.round_ended[gameState.round_count]) return;
  }, [gameState]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-start justify-center p-6 md:h-full md:grow">
      <div className="min-h-96">
        <h1 className="mb-2 text-2xl font-bold">
          Round {gameState.round_count}
        </h1>
        <p ref={scenarioEl}></p>

        {gameState.players.map((name: string) => {
          return (
            <div className="my-4" key={name}>
              <p className="flex items-center">
                <span className="text-neutral-400">player:</span>&nbsp;
                <span id={`name-${name}`}></span>&nbsp;
                <img
                  className="h-6 w-6"
                  src={`https://robohash.org/${name}.png?set=set3`}
                  alt="profile"
                />
              </p>
              <p>
                <span className="text-neutral-400">selling:</span>&nbsp;
                <span
                  className="font-bold text-yellow-600"
                  id={`item-${name}`}
                ></span>
              </p>
              <p>
                <span className="text-neutral-400">pitch:</span>&nbsp;
                <span
                  className={cn(
                    gameState.pitches[name] === '<no pitch>'
                      ? 'text-neutral-400'
                      : 'text-black',
                  )}
                  id={`pitch-${name}`}
                ></span>
              </p>
            </div>
          );
        })}

        <p className="mb-4">
          <span className="text-neutral-400" id="alice-thoughts-label"></span>
          &nbsp;
          <span id="alice-thoughts"></span>
        </p>

        <p>
          <span className="text-neutral-400">winner:</span>&nbsp;
          <span className="font-bold text-green-600" id="winner"></span>
        </p>
      </div>

      <Button
        className={cn(
          'mt-4 transition-all',
          readyNext ? 'opacity-100' : 'opacity-0',
        )}
        onClick={() => {
          setHasClickedNext(true);
          startGame();
        }}
        disabled={hasClickedNext}
      >
        Next round{' '}
        {hasClickedNext && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </Button>
    </div>
  );
}
