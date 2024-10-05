from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List
import uuid

app = FastAPI()

class ConnectionManager:
    def __init__(self, game_code: str):
        self.game_code = game_code
        self.connections: List[WebSocket] = []

    def add_connection(self, websocket: WebSocket):
        self.connections.append(websocket)

    def remove_connection(self, websocket: WebSocket):
        self.connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.connections:
            await connection.send_text(message)

class GameManager:
    def __init__(self):
        self.games: Dict[str, ConnectionManager] = {}

    def create_game(self) -> str:
        game_code = str(uuid.uuid4())[:8]
        self.games[game_code] = ConnectionManager(game_code)
        return game_code

    def get_game(self, game_code: str) -> ConnectionManager:
        return self.games.get(game_code)

    def remove_game(self, game_code: str):
        if game_code in self.games:
            del self.games[game_code]

game_manager = GameManager()

@app.websocket("/ws/{game_code}")
async def websocket_endpoint(websocket: WebSocket, game_code: str):
    await websocket.accept()
    connection_manager = game_manager.get_game(game_code)
    if not connection_manager:
        await websocket.send_text(f"Game {game_code} not found")
        await websocket.close()
        return
    connection_manager.add_connection(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received: {data}")
            await connection_manager.broadcast(f"Client says: {data}")
    except WebSocketDisconnect:
        connection_manager.remove_connection(websocket)
        await connection_manager.broadcast(f"Client left the game")

@app.get("/create_game")
async def create_game():
    game_code = game_manager.create_game()
    return {"game_code": game_code}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)