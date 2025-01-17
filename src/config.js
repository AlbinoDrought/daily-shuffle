module.exports = {
  clientId: process.env.DS_CLIENT_ID,
  clientSecret: process.env.DS_CLIENT_SECRET,
  redirectUri: process.env.DS_REDIRECT_URI,
  refreshToken: process.env.DS_REFRESH_TOKEN,

  findPlaylistSongsBulkExternalCommand: process.env.DS_EXTERNAL_TOOL_COMMAND,

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
  /**
   * If truthy: (DS_PLAYLIST_INTERLEAVE="true")
   * - split the list of playlists in half
   * - shuffle each half independently
   * - interleave the two halves back together
   * The intention is to ensure a mostly-even share if
   * playlists from multiple users are specified.
   * 
   * When using this mode, 
   * also specify your DS_PLAYLIST_IDS in a first half / last half format:
   * 
   * person1id1,person1id2,person1id3,person2id1,person2id2,person2id3
   * 
   * Then, all of person1's playlists will be in the first half,
   * and all of person2's playlists will be in the second half.
   */
  playlistInterleave: process.env.DS_PLAYLIST_INTERLEAVE || '',
};
