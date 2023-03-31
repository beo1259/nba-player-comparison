import React, { useState } from 'react';
import { searchPlayer, getPlayerStats } from '../utils/api';
import PlayerCard from '../components/PlayerCard';
import crownImg from './crown.png'

const HomeScreen = () => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [stats1, setStats1] = useState(null);
  const [stats2, setStats2] = useState(null);
  const [greenStatsCount, setGreenStatsCount] = useState([0, 0]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!player1Name || !player2Name) return;
  
    try {
      const [searchResult1, searchResult2] = await Promise.all([
        searchPlayer(player1Name),
        searchPlayer(player2Name),
      ]);
  
      // Add console logs to inspect search results
      console.log("Search Result 1:", searchResult1);
      console.log("Search Result 2:", searchResult2);
  
      if (!searchResult1.length || !searchResult2.length) {
        throw new Error("One or both players not found.");
      }
  
      const [playerStats1, playerStats2] = await Promise.all([
        getPlayerStats(searchResult1[0].id),
        getPlayerStats(searchResult2[0].id),
      ]);
  
      // Add console logs to inspect player stats
      console.log("Player 1 Stats:", playerStats1);
      console.log("Player 2 Stats:", playerStats2);
  
      setPlayer1(searchResult1[0]);
      setStats1(playerStats1);
      setPlayer2(searchResult2[0]);
      setStats2(playerStats2);
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };
  

  const compareStats = (stat1, stat2) => {
    if (stat1 > stat2) {
      return [1, -1];
    } else if (stat2 > stat1) {
      return [-1, 1];
    } else {
      return [0, 0];
    }
  };

  const calculateGreenStatsCount = (stats1, stats2) => {
    const statNames = Object.keys(stats1);
    let greenStatsCount = [0, 0];
  
    statNames.forEach((stat) => {
      const [result1, result2] = compareStats(stats1[stat], stats2[stat]);
      if (result1 === 1) {
        greenStatsCount[0]++;
      } else if (result2 === 1) {
        greenStatsCount[1]++;
      }
    });
  
    return greenStatsCount;
  };
  

  const renderPlayerImage = (player) => {
    if (!player) return null;
    const imageSrc = `https://nba-players.herokuapp.com/players/${player.last_name}/${player.first_name}`;
    return <img src={imageSrc} alt={`${player.first_name} ${player.last_name}`} />;
  };

  const renderComparison = () => {
    if (!player1 || !player2 || !stats1 || !stats2) return null;
  
    const statNames = Object.keys(stats1);
  
    const greenStatsCount = calculateGreenStatsCount(stats1, stats2);
    const winnerIndex =
      greenStatsCount[0] > greenStatsCount[1]
        ? 0
        : greenStatsCount[1] > greenStatsCount[0]
        ? 1
        : -1;
  
    return (
      <div className="comparison">
        <div className="player-cards">
          <div className="player-card">
            {winnerIndex === 0 && <div className="winner">Winner!</div>}
            <div className="player-info">
              <div className="player-name">{player1.first_name + ' ' + player1.last_name} {stats1.TRB > stats2.TRB && <img src={crownImg} alt="crown" />}</div>
              <div className="player-team">{player1.team.full_name}</div>
            </div>
          </div>
          <div className="vs">VS</div>
          <div className="player-card">
            {winnerIndex === 1 && <div className="winner">Winner!</div>}
            <div className="player-info">
              <div className="player-name">{player2.first_name + ' ' + player2.last_name} {stats2.TRB > stats1.TRB && <img src={crownImg} alt="crown" />}</div>
              <div className="player-team">{player2.team.full_name}</div>
            </div>
          </div>
        </div>
        <div className="stats-container">
          {statNames.map((stat) => {
            const [result1, result2] = compareStats(stats1[stat], stats2[stat]);
            return (
              <div key={stat} className="stat-comparison">
                <div className="stat-name">{stat}</div>
                <div className="stats-value">
                  <div
                    className={`stat-value ${
                      result1 === 1 ? (stat === 'TO' ? 'lower' : 'higher') : result1 === -1 ? (stat === 'TO' ? 'higher' : 'lower') : ''
                    }`}
                  >
                    {stats1[stat]}
                  </div>
                </div>
                <div className="vs">VS</div>
                <div className="stats-value">
                  <div
                    className={`stat-value ${
                      result2 === 1 ? (stat === 'TO' ? 'lower' : 'higher') : result2 === -1 ? (stat === 'TO' ? 'higher' : 'lower') : ''
                    }`}
                  >
                    {stats2[stat]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  

return (
  <div className="container">
    <h1 className="title">NBA Player Comparison</h1>
    <form onSubmit={handleSubmit}>
      <div className="input-container">
        <div className="player-input">
          <label className='inputTitle' htmlFor="player1">Player 1:</label>
          <input
            className='input'
            type="text"
            id="player1"
            placeholder="Enter player 1 name"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
          />
        </div>
        <div className="player-input">
          <label className='inputTitle' htmlFor="player2">Player 2:</label>
          <input
            className='input'
            type="text"
            id="player2"
            placeholder="Enter player 2 name"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
          />
        </div>
        <button className="button" type="submit">
          Compare
        </button>
      </div>
    </form>
    {renderComparison()}
  </div>
);
  }


export default HomeScreen;