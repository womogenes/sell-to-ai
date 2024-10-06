import { useEffect } from 'react';

export default function Results({ gameState }: any) {
  useEffect(() => {
    if (!gameState.round_ended[gameState.round_count]) return;
  }, [gameState]);

  return (
    <div className="flex h-full w-full flex-col justify-center p-6">
      <div className="min-h-96">
        <h1 className="mb-2 text-2xl font-bold">
          Round {gameState.round_count}
        </h1>
        <p>{gameState.scenario}</p>

        {gameState.players.map((name: string) => {
          return (
            <div className="my-8">
              <p>{name}</p>
              <p className="">
                <span className="text-neutral-400">item:</span>&nbsp;
                <span className="font-black text-yellow-600">
                  {gameState.items[name]}
                </span>
              </p>
              <p>
                <span className="text-neutral-400">pitch:</span>&nbsp;
                <span>{gameState.pitches[name]}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
