# Daily Shuffle

Take your daily mixes (or other playlists), put them into a single playlist, and shuffle them. That's it.

## Usage, Default Mode

1. Save/like/follow all your Daily Mixes in Spotify so they become visible in the API: https://community.spotify.com/t5/Spotify-for-Developers/How-can-I-get-access-to-Made-for-You-playlist-by-Web-API/td-p/5186504

2. Create a Spotify developer app with `http://localhost:8080/callback` as a redirect URI: https://developer.spotify.com/dashboard/applications

3. `npm install`

4. Run a local server to grab a refresh token: `DS_CLIENT_ID=your-client-id DS_CLIENT_SECRET=your-client-secret DS_REDIRECT_URI=http://localhost:8080/callback npm run serve`

5. Visit http://localhost:8080 , follow prompts, copy displayed refresh token, close server

6. Run `DS_CLIENT_ID=your-client-id DS_CLIENT_SECRET=your-client-secret DS_REDIRECT_URI=http://localhost:8080/callback DS_REFRESH_TOKEN=your-refresh-token npm run shuffle` to create or update a playlist named "Shuffled Daily Mix"

7. Set up that above command to run on some kind of schedule

Enjoy

## Usage, Specified Playlist Mode

1. Create a Spotify developer app with `http://localhost:8080/callback` as a redirect URI: https://developer.spotify.com/dashboard/applications

2. `npm install`

3. Run a local server to grab a refresh token: `DS_CLIENT_ID=your-client-id DS_CLIENT_SECRET=your-client-secret DS_REDIRECT_URI=http://localhost:8080/callback npm run serve`

4. Visit http://localhost:8080 , follow prompts, copy displayed refresh token, close server

5. Run `DS_CLIENT_ID=your-client-id DS_CLIENT_SECRET=your-client-secret DS_REDIRECT_URI=http://localhost:8080/callback DS_REFRESH_TOKEN=your-refresh-token DS_MODE=specified DS_PLAYLIST_IDS=4DuqOBYEPT68kcmjJLNQXH,5OZmj122jnzf3Z4kQb60En DS_PLAYLIST_NAME="My CD 123" DS_PLAYLIST_DESCRIPTION="Sample Text" npm run shuffle` to create or update a playlist named "My CD 123" containing a shuffled version of songs in your specified playlists

6. Set up that above command to run on some kind of schedule

Enjoy

## Workaround, inaccessible Daily Mix playlists

You might get a 404 error when attempting to access your Daily Mix playlists over the Spotify Web API.

Create an external command to retrieve them anyways. This is an exercise for the reader. Here's an example:

```go
package main

func main() {
  playlistIDs := strings.Split(",", os.Getenv("PLAYLIST_ID")) // base62 IDs separated by comma
  for _, playlistID := range playlistIDs {
    for _, trackInPlaylist := range getTracksInPlaylist(playlistID) {
      println(trackInPlaylist) // spotify:track:base62id
    }
  }
}
```

Specify this command and any required arguments in `DS_EXTERNAL_TOOL_COMMAND`, like `/path/to/command --foo=bar baz`.

Then, when you run daily-shuffle, you will see the text `Looking at playlist songs using external tool...` instead of just `Looking at playlist songs...`
