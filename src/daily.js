module.exports = {
  findShuffledDailyMixPlaylist: async (spotifyApi) => {
    const user = await spotifyApi.getMe();

    const limit = 50;
    let offset = 0;
    let iterations = 0;
    let resp;
    do {
      resp = await spotifyApi.getUserPlaylists({
        offset: offset,
        limit: limit,
      });
      offset += limit;
  
      const shuffledDailyMixPlaylist = resp.body.items
        .find((item) => {
          return item.name === 'Shuffled Daily Mix'
            && item.owner.uri === user.body.uri;
        });

      if (shuffledDailyMixPlaylist) {
        return shuffledDailyMixPlaylist;
      }
  
      iterations++;
    } while (resp.body.items.length && (iterations < 1000));

    return null;
  },

  findDailyMixPlaylists: async (spotifyApi) => {
    const dailyMixPlaylists = [];
    const limit = 50;
    let offset = 0;
    let iterations = 0;
    let resp;
    do {
      resp = await spotifyApi.getUserPlaylists({
        offset: offset,
        limit: limit,
      });
      offset += limit;
  
      resp.body.items
        .filter((item) => {
          return item.name.startsWith('Daily Mix')
            && item.owner.uri === 'spotify:user:spotify';
        })
        .forEach((playlist) => {
          dailyMixPlaylists.push(playlist);
        });
  
      iterations++;
    } while (resp.body.items.length && (iterations < 1000));

    return dailyMixPlaylists;
  },

  findPlaylistSongs: async (spotifyApi, playlistID) => {
    const allSongURIs = [];

    const limit = 50;
    let offset = 0;
    let iterations = 0;
    let resp;

    do {
      resp = await spotifyApi.getPlaylistTracks(playlistID, {
        offset: offset,
        limit: limit,
      });
      offset += limit;
  
      resp.body.items
        .forEach((item) => {
          allSongURIs.push(item.track.uri);
        });
  
      iterations++;
    } while (resp.body.items.length && (iterations < 1000));

    return allSongURIs;
  },

  shuffle: (things) => {
    return things
      .map((thing) => ({ thing: thing, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((wrapped) => wrapped.thing);
  },
};
