module.exports = {
  clientId: process.env.DS_CLIENT_ID,
  clientSecret: process.env.DS_CLIENT_SECRET,
  redirectUri: process.env.DS_REDIRECT_URI,
  refreshToken: process.env.DS_REFRESH_TOKEN,

  /**
   * One of:
   * - all-daily: shuffle all Spotify-created "Daily Mix" playlists
   * - specified: shuffle all specified playlists (see DS_PLAYLIST_IDS)
   */
  mode: process.env.DS_MODE || 'all-daily',
  /**
   * Comma-separated list of playlist IDs
   */
  playlistIDs: (process.env.DS_PLAYLIST_IDS || '')
    .split(',')
    .filter(v => !!v),
  /**
   * Playlist name, leave empty to use default
   */
  playlistName: process.env.DS_PLAYLIST_NAME || '',
  /**
   * Playlist description, leave empty to use default
   */
  playlistDescription: process.env.DS_PLAYLIST_DESCRIPTION || '',
};
