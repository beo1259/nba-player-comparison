import axios from 'axios';

const API_BASE_URL = 'https://www.balldontlie.io/api/v1';

export const searchPlayer = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/players`, {
      params: {
        search: query,
      },
    });
    return response.data.data;
    console.log(response.data.data);
  } catch (error) {
    console.error(error);
  }
};

export const getPlayerStats = async (playerId) => {
  try {
    const uniqueGames = new Set();
    const summedStats = {
      games_played: 0,
      pts: 0,
      reb: 0,
      dreb: 0,
      oreb: 0,
      ast: 0,
      stl: 0,
      blk: 0,
      turnover: 0,
      fg3_pct: 0,
      fg3a: 0,
      fg3m: 0,
      fg_pct: 0,
      fga: 0,
      fgm: 0,
      ft_pct: 0,
      fta: 0,
      ftm: 0,
    };
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      uniqueGames.clear();
      const response = await axios.get(`${API_BASE_URL}/stats`, {
        params: {
          player_ids: [playerId],
          page,
          per_page: 100,
        },
      });

      const stats = response.data.data;
      for (let i = 0; i < stats.length; i++) {
        const stat = stats[i];
        //console.log('season_type:', stat.season_type, 'min:', stat.min); // add this line to output the season_type and min

        const gameId = `${stat.game.id}-${stat.team.id}`;
        if (stat.min !== null && stat.min !== '0:00' && stat.season_type !== 'Pre Season' && !uniqueGames.has(gameId)) {
          console.log(summedStats.pts)
          uniqueGames.add(gameId);
          summedStats.games_played += 1;
          summedStats.pts += stat.pts;
          summedStats.reb += stat.reb;
          summedStats.dreb += stat.dreb;
          summedStats.oreb += stat.oreb;
          summedStats.ast += stat.ast;
          summedStats.stl += stat.stl;
          summedStats.blk += stat.blk;
          summedStats.turnover += stat.turnover;
          summedStats.fg3_pct += stat.fg3_pct;
          summedStats.fg3a += stat.fg3a;
          summedStats.fg3m += stat.fg3m;
          summedStats.fg_pct += stat.fg_pct;
          summedStats.fga += stat.fga;
          summedStats.fgm += stat.fgm;
          summedStats.ft_pct += stat.ft_pct;
          summedStats.fta += stat.fta;
          summedStats.ftm += stat.ftm;
        }
        
      }
      totalPages = response.data.meta.total_pages;
      page++;
    }

    console.log('games played: ', + summedStats.games_played);
    console.log('points: ', + summedStats.pts)
    

    const averagedStats = {
      PPG: ((summedStats.pts / summedStats.games_played) * 1.0).toFixed(1),
      RPG: ((summedStats.dreb + summedStats.oreb) / summedStats.games_played).toFixed(1),
      APG: (summedStats.ast / summedStats.games_played).toFixed(1),
      SPG: (summedStats.stl / summedStats.games_played).toFixed(1),
      BPG: (summedStats.blk / summedStats.games_played).toFixed(1),
      TO: (summedStats.turnover / summedStats.games_played).toFixed(1),
      FG: `${((summedStats.fgm / summedStats.fga) * 100).toFixed(1)}%`,
      FG3: `${((summedStats.fg3m / summedStats.fg3a) * 100).toFixed(1)}%`,
      FT: `${((summedStats.ftm / summedStats.fta) * 100).toFixed(1)}%`
    };

    return averagedStats;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving player stats.');
  }
};

