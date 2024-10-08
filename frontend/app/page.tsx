'use client';

import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import halMonopolyMan from '../public/hal_monopoly_main.png';

export default function Landing() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState<string>('');

  return (
    // Two columns
    <>
      <div className="flex h-full flex-col items-center justify-center p-6">
        {/* Title */}
        <div className="flex w-full flex-col items-center justify-center gap-3">
          <Image width={300} src={halMonopolyMan} alt="AI monopoly man"></Image>
          <div className="relative text-4xl font-black uppercase tracking-tighter transition-transform hover:scale-110 md:text-6xl">
            <h1 className="absolute left-1 top-1 whitespace-pre opacity-20">
              Sell to AI
            </h1>
            <h1 className="-mb-1 whitespace-pre opacity-80">Sell to AI</h1>
          </div>
          <p>be the best salesperson</p>
        </div>

        {/* Left column */}
        <div className="flex flex-col items-center justify-center md:max-w-72">
          <div className="p-12">
            <h2 className="mb-4 text-xl font-bold">How to play</h2>
            <Carousel
              className="w-full"
              plugins={[
                Autoplay({
                  delay: 5000,
                }),
              ]}
            >
              <CarouselContent>
                <CarouselItem>
                  1. Create a game and invite up to 10 players
                </CarouselItem>
                <CarouselItem>
                  2. AI chooses a scenario and gives each player an item that
                  would be useful in the scenario
                </CarouselItem>
                <CarouselItem>
                  3. Players must convince the AI why it should buy the item
                </CarouselItem>
                <CarouselItem>
                  4. AI chooses one player to buy from
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>

        {/* Right column */}
        <div className="flex w-full flex-col items-center justify-center md:max-w-60">
          <Card className="flex flex-col gap-1 p-4">
            <label htmlFor="game-code-input" className="absolute -top-full">
              Game code
            </label>
            <Input
              className="text-center font-mono text-base"
              placeholder="Game code"
              id="game-code-input"
              value={gameCode}
              onChange={(e) => {
                if (!/^[0-9\b]{0,4}$/.test(e.target.value)) return;
                setGameCode(e.target.value);
              }}
              onKeyDown={(e) =>
                e.key === 'Enter' && router.push(`/game?g=${gameCode}`)
              }
            />
            <p className="mx-auto">or</p>
            <a className={buttonVariants()} href="/game">
              Create game
            </a>
          </Card>
        </div>
      </div>
    </>
  );
}
