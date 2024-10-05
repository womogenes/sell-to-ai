export default function Game({ gameState }: any) {
  return (
    <div className="flex w-full items-center justify-center">
      <h1>{gameState.scenario}</h1>
    </div>
  );
}
