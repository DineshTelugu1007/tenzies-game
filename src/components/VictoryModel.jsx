import React from "react";

export default function VictoryModal({
  playerName,
  rolls,
  time,
  rank,
  isNewHighScore,
  onPlayAgain,
  onViewLeaderboard,
}) {
  return (
    <div className="modal-overlay">
      <div className="victory-modal">

        <div className="trophy">🏆</div>

        <h1>YOU WIN!</h1>

        {isNewHighScore ? (
          <h2 className="new-record">🔥 NEW PERSONAL BEST</h2>
        ) : (
          <h2 className="good-game">🎉 Great Game!</h2>
        )}

        <div className="modal-stats">

          <div>
            <span>👤 Player</span>
            <strong>{playerName}</strong>
          </div>

          <div>
            <span>🎲 Rolls</span>
            <strong>{rolls}</strong>
          </div>

          <div>
            <span>⏱ Time</span>
            <strong>{time} sec</strong>
          </div>

          <div>
            <span>⭐ Rank</span>
            <strong>#{rank}</strong>
          </div>

        </div>

        <div className="modal-buttons">

          <button
            className="play-btn"
            onClick={onPlayAgain}
          >
            🎮 Play Again
          </button>

          <button
            className="leader-btn"
            onClick={onViewLeaderboard}
          >
            🏆 Hall of Fame
          </button>

        </div>

      </div>
    </div>
  );
}