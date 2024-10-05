import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Landing() {
  return (
    // Three columns
    <div className="flex h-full w-full flex-col gap-4 p-6 md:flex-row">
      {/* Left column */}
      <div className="flex w-full flex-col justify-center md:max-w-60">
        <h2 className="text-xl font-bold">How to Play</h2>
        <ol className="list-decimal pl-6">
          <li>Create a game and invite up to 10 players</li>
          <li>
            AI chooses a scenario and gives each player an item that would be
            useful in the scenario
          </li>
          <li>Players must convince the AI why it should buy the item</li>
          <li>AI chooses 2 players to buy from</li>
        </ol>
      </div>

      {/* Middle column */}
      <div className="col-span-2 flex w-full flex-col items-center justify-center gap-3">
        <img
          className="w-1/2"
          src="https://www.pngkey.com/png/full/805-8051416_monopoly-man.png"
          alt="Monopoly man"
        ></img>
        <div className="relative font-mono text-7xl font-black uppercase tracking-tighter transition-transform hover:scale-110">
          <h1 className="absolute left-1 top-1 whitespace-pre opacity-20">
            Sell to AI
          </h1>
          <h1 className="whitespace-pre opacity-80">Sell to AI</h1>
        </div>
        <p>be the best salesperson</p>
      </div>

      {/* Right column */}
      <div className="flex w-full flex-col justify-center gap-2 md:max-w-60">
        <div className="flex flex-col gap-2 rounded-md border-2 p-4">
          <label htmlFor="room-code-input" className="absolute -top-full">
            Room code
          </label>
          <Input
            className="text-center"
            placeholder="Room code"
            id="room-code-input"
          />
          <p className="mx-auto">or</p>
          <a className={buttonVariants()} href="/game">
            Create room
          </a>
        </div>
      </div>
    </div>
  );
}
