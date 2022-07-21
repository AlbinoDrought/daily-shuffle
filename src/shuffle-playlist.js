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

(async () => {
  console.log('Fetching new access token...');
  spotifyApi.setAccessToken(
    (await spotifyApi.refreshAccessToken()).body.access_token
  );
  console.log('Fetched!');

  console.log('Looking for "Daily Mix" playlists...');
  const dailyMixPlaylists = await daily.findDailyMixPlaylists(spotifyApi);

  if (dailyMixPlaylists.length <= 0) {
    console.error('You must favorite/like/follow your Daily Mix playlists for them to show through API access! 0 found');
    process.exit(1);
  }

  console.log('Found ' + dailyMixPlaylists.length);

  console.log('Looking at Daily Mix songs...');
  const dailyMixSongsWrapped = await Promise.all(
    dailyMixPlaylists.map((p) => daily.findPlaylistSongs(spotifyApi, p.id))
  );
  let dailyMixSongs = [];
  dailyMixSongsWrapped.forEach((dms) => {
    dailyMixSongs = dailyMixSongs.concat(dms);
  });
  dailyMixSongs = daily.shuffle(dailyMixSongs);
  console.log('Found ' + dailyMixSongs.length);

  console.log('Looking for existing "Shuffled Daily Mix" playlist...');
  let playlist = await daily.findShuffledDailyMixPlaylist(spotifyApi);
  if (!playlist) {
      console.log('Creating "Shuffled Daily Mix" playlist...');
      playlist = (await spotifyApi.createPlaylist('Shuffled Daily Mix', {
      collaborative: false,
      description: 'Your shuffled daily mix!',
      public: false,
    })).body;
  }

  console.log('Updating "Shuffled Daily Mix" playlist...');
  await spotifyApi.replaceTracksInPlaylist(playlist.id, []);
  for (let i = 0; i < dailyMixSongs.length; i += 50) {
    await spotifyApi.addTracksToPlaylist(playlist.id, dailyMixSongs.slice(i, i+50));
  }

  console.log('Done!');
  console.log(playlist.external_urls.spotify);
})();
