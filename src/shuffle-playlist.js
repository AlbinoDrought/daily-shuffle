const SpotifyWebApi = require('spotify-web-api-node');
const config = require('./config');
const daily = require('./daily');

const spotifyApi = new SpotifyWebApi({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  redirectUri: config.redirectUri,
});

if (!config.clientId || !config.clientSecret || !config.redirectUri) {
  console.error('Please set DS_CLIENT_ID DS_CLIENT_SECRET DS_REDIRECT_URI');
  process.exit(1);
}

if (!config.refreshToken) {
  console.error('Please set DS_REFRESH_TOKEN');
  console.error('You can get this with "npm run serve" and visiting http://localhost:8080');
  process.exit(1);
}

spotifyApi.setRefreshToken(config.refreshToken);

let findPlaylists;
if (config.mode === 'all-daily') {
  /**
   * @return {Promise<string[]>}
   */
  findPlaylists = async () => {
    const dailyMixPlaylists = await daily.findDailyMixPlaylists(spotifyApi);
    if (dailyMixPlaylists.length <= 0) {
      console.error('You must favorite/like/follow your Daily Mix playlists for them to show through API access! 0 found');
      process.exit(1);
    }
    return dailyMixPlaylists.map(p => p.id);
  };
} else if (config.mode === 'specified') {
  /**
   * @return {Promise<string[]>}
   */
  findPlaylists = async () => {
    const playlists = config.playlistIDs.slice();
    if (playlists.length <= 0) {
      console.error('When using "specified" mode, you must specify at least one playlist ID with DS_PLAYLIST_IDS');
      process.exit(1);
    }
    return playlists;
  };
} else {
  console.error(`Unsupported DS_MODE: ${config.mode}`);
  console.error('Try one of: all-daily, specified');
  process.exit(1);
}

const playlistName = config.playlistName || 'Shuffled Daily Mix';
const playlistDescription = config.playlistDescription || 'Your shuffled daily mix!';

(async () => {
  console.log('Fetching new access token...');
  spotifyApi.setAccessToken(
    (await spotifyApi.refreshAccessToken()).body.access_token
  );
  console.log('Fetched!');

  console.log('Looking for playlists...');
  const playlistIDs = await findPlaylists();
  playlistIDs.sort();

  console.log(`Found ${playlistIDs.length}: ${playlistIDs.join(', ')}`);

  console.log('Looking at playlist songs...');
  const songsWrapped = await Promise.all(
    playlistIDs.map((playlistID) => daily.findPlaylistSongs(spotifyApi, playlistID))
  );
  let songs = [];
  songsWrapped.forEach((dms) => {
    songs = songs.concat(dms);
  });
  songs = daily.shuffle(songs);

  const dedupedSongs = [...new Set(songs)];
  const dupes = songs.length - dedupedSongs.length;

  songs = dedupedSongs;
  console.log(`Found ${songs.length} songs (${dupes} duplicates)`);

  console.log(`Looking for existing "${playlistName}" playlist...`);
  let playlist = await daily.findPlaylistByName(spotifyApi, playlistName);
  if (!playlist) {
      console.log(`Creating "${playlistName}" playlist...`);
      playlist = (await spotifyApi.createPlaylist(playlistName, {
      collaborative: false,
      description: playlistDescription,
      public: false,
    })).body;
  }

  console.log(`Updating "${playlistName}" playlist...`);
  const songsPerLoop = 100;
  for (let i = 0; i < songs.length; i += songsPerLoop) {
    const songsPart = songs.slice(i, i+songsPerLoop);
    if (i === 0) {
      // remove all other songs from the list, replace with our songs
      // by passing some songs here, we prevent the playlist from ever being completely emptied
      await spotifyApi.replaceTracksInPlaylist(playlist.id, songsPart);
    } else {
      await spotifyApi.addTracksToPlaylist(playlist.id, songsPart);
    }
  }

  console.log('Done!');
  console.log(playlist.external_urls.spotify);
})();
