import { Button } from '@/components/ui/button';
import { cn, typed } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export default function Results({ gameState, startGame }: any) {
  const scenarioEl = useRef(null);
  const [ready, setReady] = useState(false);

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
          {},
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
      await typed(document.querySelector('#winner'), gameState.winner, {}, 500);

      await new Promise((r) => setTimeout(r, 1000));
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!gameState.round_ended[gameState.round_count]) return;
  }, [gameState]);

  return (
    <div className="mx-auto flex h-full w-full max-w-lg grow flex-col items-start justify-center p-6">
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
                <span id={`pitch-${name}`}></span>
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
          ready ? 'opacity-100' : 'opacity-0',
        )}
        onClick={startGame}
      >
        Next round
      </Button>
    </div>
  );
}
