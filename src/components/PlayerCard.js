const PlayerCard = ({ player, stats }) => {
  return (
    <div className="player-card">
      <div className="player-info">
        <div className="player-name">{player.player}</div>
        <div className="player-team">{player.team.full_name}</div>
      </div>
      <div className="player-stats">
        <div className="stat">
          <div className="stat-label">Points:</div>
          <div className="stat-value">{stats.pts}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Rebounds:</div>
          <div className="stat-value">{stats.reb}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Assists:</div>
          <div className="stat-value">{stats.ast}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Steals:</div>
          <div className="stat-value">{stats.stl}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Blocks:</div>
          <div className="stat-value">{stats.blk}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Turnovers:</div>
          <div className="stat-value">{stats.turnover}</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
