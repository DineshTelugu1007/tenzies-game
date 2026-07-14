import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Dice from "./Dice.jsx";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import VictoryModal from "./components/VictoryModel.jsx";

export default function App() {

  const [IsdiceNumber, setDiceNumber] = useState(generateAllNewDice());
  const [rollcount, setRollCount] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [scores, setScores] = useState([]);
  const [showGame, setShowGame] = useState(false);
  const [playerRank, setPlayerRank] = useState(null);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

const [showVictoryModal, setShowVictoryModal] = useState(false);
const [showLeaderboard, setShowLeaderboard] = useState(false);
const [isNewHighScore, setIsNewHighScore] = useState(false);

  const buttonRef = useRef(null);
  const leaderboardRef = useRef(null);

  const gameWon =
    IsdiceNumber.every(dice => dice.isHeld) &&
    IsdiceNumber.every(dice => dice.value === IsdiceNumber[0].value);

useEffect(() => {
  if (gameWon && !scoreSaved) {
    buttonRef.current.focus();
    saveScore();
    setScoreSaved(true);
    setShowVictoryModal(true);
  }
}, [gameWon, scoreSaved]);

  useEffect(() => {
    let timer;

    if (gameStarted && !gameWon) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gameStarted, gameWon]);

  useEffect(() => {
    loadScores();
  }, []);

  function hold(id) {
    setDiceNumber(oldDice =>
      oldDice.map(dice =>
        dice.id === id ? { ...dice, isHeld: !dice.isHeld } : dice
      )
    );
  }

  function generateAllNewDice() {
    return Array(10)
      .fill(0)
      .map(() => ({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid(),
      }));
  }

 async function loadScores() {

  const response = await fetch("https://tenzies-backend-production.up.railway.app/scores");

  const data = await response.json();

  setScores(data);


  const rank = data.findIndex(
    score => score.playerName === playerName
  );


  if (rank !== -1) {
    setPlayerRank(rank + 1);
  }

}

  async function saveScore() {

 
  const previousScore = scores.find(
    score => score.playerName === playerName
  );

  let newHighScore = true;

  if (previousScore) {

    newHighScore =
      rollcount < previousScore.rolls ||
      (rollcount === previousScore.rolls &&
        time < previousScore.time);

  }

  setIsNewHighScore(newHighScore);

  const score = {
    playerName,
    rolls: rollcount,
    time,
    playedAt: new Date(),
  };

  await fetch("https://tenzies-backend-production.up.railway.app/scores", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(score),
});

  await loadScores();
}
  function startNewGame() {
  setDiceNumber(generateAllNewDice());
  setRollCount(0);
  setTime(0);
  setGameStarted(false);
  setScoreSaved(false);

  setShowVictoryModal(false);
  setShowLeaderboard(false);
}

  function rolldice() {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (!gameWon) {

  if (!gameStarted) {
    setGameStarted(true);
  }

  setIsRolling(true);

  setTimeout(() => {

    setRollCount(prev => prev + 1);

    setDiceNumber(oldDice =>
      oldDice.map(dice =>
        dice.isHeld
          ? dice
          : {
              ...dice,
              value: Math.ceil(Math.random() * 6),
            }
      )
    );

    setIsRolling(false);

  }, 250);

} else {
  startNewGame();
}
  }

  const diceElement = IsdiceNumber.map(diceObj => (
   <Dice
  key={diceObj.id}
  value={diceObj.value}
  isHeld={diceObj.isHeld}
  hold={hold}
  id={diceObj.id}
  isRolling={isRolling}
/>
  ));

if (!showGame) {
  return (
    <main className="login-screen">

      <div className="login-card">

        <div className="dice-icon">
          🎲
        </div>

        <h1 className="login-title">
          TENZIES
        </h1>

        <p className="login-subtitle">
          Roll • Hold • Win
        </p>

        <input
          type="text"
          placeholder="👤 Enter your name..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <button
          className="start-btn"
          disabled={playerName.trim() === ""}
          onClick={() => setShowGame(true)}
        >
          🚀 Start Game
        </button>

      </div>

    </main>
  );
}


  return (
    <main>

      {gameWon && <Confetti />}

      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>
            Congratulations! You won! Press "New Game" to start again.
          </p>
        )}
      </div>

      <h1 className="title">Tenzies</h1>

      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>

      <h3>Player: {playerName}</h3>

      <p>
        Rolls: <strong>{rollcount}</strong> | Time:{" "}
        <strong>{time} sec</strong>
      </p>

      {gameWon && (
        <p className="score">
          🎉 You won in {rollcount} rolls and {time} seconds!
        </p>
      )}

      <div className="dice-container">
        {diceElement}
      </div>

      <button
        ref={buttonRef}
        className="roll"
        onClick={rolldice}
      >
        {gameWon ? "New Game" : "Roll"}
      </button>
      {showVictoryModal && (
  <VictoryModal
    playerName={playerName}
    rolls={rollcount}
    time={time}
    rank={playerRank}
    isNewHighScore={isNewHighScore}
    onPlayAgain={startNewGame}
    onViewLeaderboard={() => {
    setShowVictoryModal(false);
    setShowLeaderboard(true);

  setTimeout(() => {
    leaderboardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 150);
}}
  />
)}
{showLeaderboard && scores.length > 0 &&   (
  <div
  ref={leaderboardRef}
  className="leaderboard-container"
   >

    <h2>🏆 Hall of Fame</h2>
     {playerRank && (
        <div className="my-rank">
            ⭐ Your Rank: #{playerRank}
        </div>
    )}

    <div className="leaderboard-list">

      {scores.map((score, index) => (

        <div
          className={`leader-card ${index < 3 ? "top-player" : ""}`}
          key={score.id}
        >

          <div className="position">
            {index === 0 ? "🥇" :
             index === 1 ? "🥈" :
             index === 2 ? "🥉" :
             `#${index + 1}`}
          </div>


          <div className="player-info">
            <h3>{score.playerName}</h3>
            <p>Best Game</p>
          </div>


          <div className="stats">

            <div>
              🎲
              <strong>{score.rolls}</strong>
              <small> Rolls</small>
            </div>

            <div>
              ⏱️
              <strong>{score.time}</strong>
              <small> Sec</small>
            </div>

          </div>


        </div>

      ))}

    </div>

  </div>
)}
    </main>
  );
}