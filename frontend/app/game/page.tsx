'use client';

import { SERVER_URL, SERVER_WEBSOCKET_URL } from '@/constants';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Lobby from './Lobby';
import PlayerList from './PlayerList';
import { Loader2 } from 'lucide-react';
import Game from './Game';

export default function GamePage() {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // UI states
  const [isConnected, setIsConnected] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Important game-state variables
  const [gameState, setGameState] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);

  // Create a game
  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');

    (async () => {
      let gameCode = params.get('g');
      if (gameCode) {
        setGameCode(gameCode);
      } else {
        gameCode = (await (await fetch(`${SERVER_URL}/create_game`)).json())
          .game_code;
        setGameCode(gameCode);
        router.push(`${pathname}/?g=${gameCode}`);
      }

      const socket = new WebSocket(`${SERVER_WEBSOCKET_URL}/ws/${gameCode}`);
      setSocket(socket);
    })();

    // return () => socket?.close();
  }, []);

  // On socket change
  useEffect(() => {
    if (!socket) return;

    socket.onopen = () => {
      console.log('Connected to websocket server');
      if (username) joinGame();
      setIsConnected(true);
    };
    socket.onmessage = (e: { data: string }) => {
      try {
        const data = JSON.parse(e.data);
        if (!data) return;
        console.log('ws data:', data);

        // Handle errors
        if (data.error) console.log('Error:', data.error);

        // Server always sends list of players
        if (data.state) setGameState(data.state);

        if (data.type === 'connect') {
          if (!username) localStorage.getItem('username');
          if (username && !data.state.players.includes(username)) joinGame();
          setIsGameStarted(data.state.game_started);
        }
        if (data.type === 'join' && data.state.players.includes(username)) {
          setHasJoined(true);
          setIsJoining(false);
        }
        if (data.type === 'game_started') {
          console.log('prompts:', data.state.prompts);
          setIsGameStarted(true);
        }
      } catch (e) {
        console.log(e);
      }
    };
  }, [socket, username]);

  // Join game handler
  const joinGame = () => {
    setIsJoining(true);
    socket.send(JSON.stringify({ type: 'join', username }));
    localStorage.setItem('username', username);
  };

  const startGame = () => {
    socket.send(JSON.stringify({ type: 'start_game' }));
  };

  return (
    <div className="flex h-full flex-col gap-4 md:flex-row">
      {isGameStarted ? (
        <Game gameState={gameState} username={username} />
      ) : isConnected ? (
        <Lobby
          gameCode={gameCode}
          username={username}
          setUsername={setUsername}
          isJoining={isJoining}
          hasJoined={hasJoined}
          startGame={startGame}
          joinGame={joinGame}
        />
      ) : (
        <div className="flex w-full items-center justify-center">
          <Loader2 className="mr-2 animate-spin" /> Connecting to server...
        </div>
      )}

      {/* List of players */}
      <PlayerList
        players={gameState?.players || []}
        username={username}
        isGameStarted={isGameStarted}
      />
    </div>
  );
}
