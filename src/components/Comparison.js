import PlayerCard from './PlayerCard';

const Comparison = ({ player1, player2, stats1, stats2 }) => {
  return (
    <div className="comparison">
      <PlayerCard player={player1} stats={stats1} />
      <div className="vs">VS</div>
      <PlayerCard player={player2} stats={stats2} />
    </div>
  );
};

export default Comparison;