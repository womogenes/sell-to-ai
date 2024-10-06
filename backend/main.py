from typing import List, Dict
import random
from dotenv import load_dotenv
import os
from openai import OpenAI
import json
from datetime import datetime, timedelta
from constants import TURN_TIME
from collections import defaultdict

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

# with open("scenarios.txt", encoding="utf8") as f:
#     SCENARIOS = f.read()
# SCENARIOS = SCENARIOS.split("\n")
# SCENARIOS = [s[:-1] + "!" for s in SCENARIOS]
# with open("english_nouns.txt", encoding="utf8") as f:
#     NOUN_LIST = f.read()
# NOUN_LIST = NOUN_LIST.split("\n")

with open("scenarios_with_answers.json", encoding="utf8") as f:
    SCENARIOS_WITH_ANSWERS = f.read()
SCENARIOS_WITH_ANSWERS = json.loads(SCENARIOS_WITH_ANSWERS)

with open("fruit_names.txt", encoding="utf8") as f:
    AI_NAMES = f.read().strip().split("\n")
class ConvincingGame:
    def __init__(self):
        self.number_ai_players = 2
        self.players: List[str] = []
        self.ai_players: List[str] = random.sample(AI_NAMES, self.number_ai_players)
        self.prompts: Dict[str, str] = {}
        self.pitches: defaultdict[str, str] = defaultdict(str)
        self.ai_prompts: Dict[str, str] = {}
        self.ai_pitches: Dict[str, str] = {}
        self.winner: str = None
        self.game_started: bool = False
        self.game_ended: bool = False
        scenario_with_answers = random.choice(SCENARIOS_WITH_ANSWERS)
        self.scenario = scenario_with_answers["scenario"]
        self.items: List[str] = scenario_with_answers["nouns"]
        self.scores: Dict[str, List[int]] = {}
        self.expiry_time = datetime.fromtimestamp(0)
        for a in self.ai_players:
            self.scores[a] = []
        

    def get_items(self):
        return self.items

    def start_game(self):
        if self.game_started:
            return self.pitches
        if len(self.players) + self.number_ai_players > len(self.items):
            return "Not enough items for all players."
        
        random.shuffle(self.items)
        for i, player in enumerate(self.players):
            self.prompts[player] = f"{self.scenario} Convince Alice to buy: {self.items[i]}!"
        for i, player in enumerate(self.ai_players):
            self.ai_prompts[player] = f"{self.scenario} Convince Alice to buy: {self.items[i + len(self.players)]}!"
            self.ai_pitches[player] = AIPlayer.get_response(self.ai_prompts[player])
        self.game_started = True
        self.expiry_time = datetime.now() + timedelta(seconds=TURN_TIME)
        print("set self.expiry_time to", self.expiry_time)
        return self.prompts

    def add_player(self, player: str):
        if player not in self.players:
            self.players.append(player)
            self.prompts[player] = None
            self.scores[player] = []
            return True
        return False

    def submit_pitch(self, player: str, pitch: str):
        if player in self.players and self.game_started:
            self.pitches[player] = pitch
            return True
        return False

    def get_evaluation_prompt(self):
        return ("\n".join([f"Username: {self.players[i]}. {self.players[i]} suggests buying: {self.items[i]}. Reasoning: {self.pitches.get(self.players[i], '')}" for i in range(len(self.players))]) 
            + ("\n" if len(self.ai_players) > 0 else "") 
            + "\n".join([f"Username: {self.ai_players[i]}. {self.ai_players[i]} suggests buying: {self.items[i + len(self.players)]}. Reasoning: {self.ai_pitches[self.ai_players[i]]}" for i in range(len(self.ai_players))])
        )

    def process_pitches(self):
        # Call the OpenAI API to evaluate the pitches
        self.game_ended = True
        print(self.get_evaluation_prompt())
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"You're Alice. You're playing a game with some other players. You're the judge of their responses. You love good humor and want the players to enjoy the game as much as possible, perhaps disregarding logic. Role play a person in the following scenario: {self.scenario}\nChoose the answer suggested that you think would make the game most enjoyable, which should be the most surprising or funny one. Don't make your own twists on their suggestions when juding their suggestions. Reason before answering with the correct answer. It's not fun if you choose the most standard one. Keep in mind that the players are randomly assigned a word and can't pick their own word. judge based on the pitch, not based on the suggestion!"},
                {"role": "user", "content": self.get_evaluation_prompt()}
            ]
        )
        print(response.choices[0].message)
        new_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": self.get_evaluation_prompt()},
                {"role": "assistant", "content": response.choices[0].message.content},
                {"role": "user", "content": "Please reply with only the username of the winning player. Make sure to keep EXACT STRING AGREEMENT between your response and the username given:"}
            ]
        )
        self.winner = new_response.choices[0].message.content
        for p in self.players + self.ai_players:
            if p == self.winner:
                self.scores[p].append(1)
            else:
                self.scores[p].append(0)
        return {'thoughts': response.choices[0].message.content, 'winner': self.winner, 'scores': self.scores}

    def reset_game(self):
        self.prompts: Dict[str, str] = {}
        self.pitches: Dict[str, str] = defaultdict(str)
        self.winner: str = None
        self.game_started: bool = False
        self.game_ended: bool = False
        scenario_with_answers = random.choice(SCENARIOS_WITH_ANSWERS)
        self.scenario = scenario_with_answers["scenario"]
        self.items: List[str] = scenario_with_answers["nouns"]
        self.expiry_time = datetime.fromtimestamp(0)
        self.ai_pitches: Dict[str, str] = {}  # Reset AI pitches
        return {'scores': self.scores}

    def serialize(self):
        return {
            'players': self.players,
            'prompts': self.prompts,
            'items': {player: self.items[i] for i, player in enumerate(self.players)},
            'pitches': dict(self.pitches),
            'winner': self.winner,
            'game_started': self.game_started,
            'scenario': self.scenario,
            'scores': self.scores,
            'expiry_time': self.expiry_time.isoformat(),
            'ai_players': self.ai_players,
            'ai_pitches': self.ai_pitches,
            'ai_prompts': self.ai_pitches,
        }

class AIPlayer:
    system_prompt = "You're a player in a game where you have to pitch a product to Alice that she doesn't know she needs. Keep your responses short and very funny! Write at most 20 words, trying to avoid being stringent on grammar and complete sentences. you should be concise and witty, perhaps like a high schooler :D. avoid emojis though. the other respondents only have twenty seconds to write a quick response, and you shouldn't write more than them,,,"
    @staticmethod
    def get_response(user_prompt):
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": AIPlayer.system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        return response.choices[0].message.content

if __name__ == "__main__":
    g = ConvincingGame()
    print(g.add_player("P"))
    print(g.add_player("Q"))
    print(g.start_game())
    print(g.submit_pitch("P", g.items[0] + "s give heat"))
    print(g.submit_pitch("Q", g.items[1] + "s give heat"))
    print(g.process_pitches())
