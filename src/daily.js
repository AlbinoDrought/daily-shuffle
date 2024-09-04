module.exports = {
  /**
   * @param {import('spotify-web-api-node')} spotifyApi 
   * @param {string} name 
   * @returns {Promise<{ id: string }|null}>
   */
  findPlaylistByName: async (spotifyApi, name) => {
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
  
      const playlist = resp.body.items
        .find((item) => {
          return item.name === name
            && item.owner.uri === user.body.uri;
        });

      if (playlist) {
        return playlist;
      }
  
      iterations++;
    } while (resp.body.items.length && (iterations < 1000));

    return null;
  },

  /**
   * @param {import('spotify-web-api-node')} spotifyApi 
   * @returns {Promise<{ id: string }[]}>
   */
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
          // for some reason I'm getting duplicates of daily mix 2, 2024-09-03
          if (!dailyMixPlaylists.find(p => p.id === playlist.id)) {
            dailyMixPlaylists.push(playlist);
          }
        });
  
      iterations++;
    } while (resp.body.items.length && (iterations < 1000));

    return dailyMixPlaylists;
  },

  /**
   * @param {import('spotify-web-api-node')} spotifyApi 
   * @param {string} playlistID 
   * @returns {Promise<{ id: string }[]>}
   */
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

  /**
   * @param {Array} things 
   * @returns {Array}
   */
  shuffle: (things) => {
    return things
      .map((thing) => ({ thing: thing, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((wrapped) => wrapped.thing);
  },
};
