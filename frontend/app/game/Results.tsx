import { typed } from '@/lib/utils';
import { useEffect, useRef } from 'react';

export default function Results({ gameState }: any) {
  const scenarioEl = useRef(null);

  useEffect(() => {
    (async () => {
      await typed(scenarioEl.current, gameState.scenario);
      for (let name of gameState.players) {
        await typed(document.querySelector(`#name-${name}`), name ?? '');
        await typed(
          document.querySelector(`#item-${name}`),
          gameState.items[name] ?? '',
        );
        await typed(
          document.querySelector(`#pitch-${name}`),
          gameState.pitches[name] ?? '',
        );
      }
    })();
  });

  useEffect(() => {
    if (!gameState.round_ended[gameState.round_count]) return;
  }, [gameState]);

  return (
    <div className="mx-auto flex h-full w-full max-w-lg grow flex-col justify-center p-6">
      <div className="min-h-96">
        <h1 className="mb-2 text-2xl font-bold">
          Round {gameState.round_count}
        </h1>
        <p ref={scenarioEl}></p>

        {gameState.players.map((name: string) => {
          return (
            <div className="my-4" key={name}>
              <p id={`name-${name}`}></p>
              <p className="">
                <span className="text-neutral-400">item:</span>&nbsp;
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
          <span className="text-neutral-400">Alice's thoughts:</span>&nbsp;
          {gameState.thoughts}
        </p>

        <p>
          <span className="text-neutral-400">winner:</span>&nbsp;
          <span className="font-bold text-yellow-600">{gameState.winner}</span>
        </p>
      </div>
    </div>
  );
}
