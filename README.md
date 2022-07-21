# Daily Shuffle

Take your daily mixes, put them into a single playlist, and shuffle them. That's it.

## Usage

1. Save/like/follow all your Daily Mixes in Spotify so they become visible in the API: https://community.spotify.com/t5/Spotify-for-Developers/How-can-I-get-access-to-Made-for-You-playlist-by-Web-API/td-p/5186504

2. Create a Spotify developer app with `http://localhost:8080/callback` as a redirect URI: https://developer.spotify.com/dashboard/applications

3. `npm install`

4. Run a local server to grab a refresh token: `DS_CLIENT_ID=your-client-id DS_CLIENT_SECRET=your-client-secret DS_REDIRECT_URI=http://localhost:8080/callback npm run serve`

5. Visit http://localhost:8080 , follow prompts, copy displayed refresh token, close server

6. Run `DS_CLIENT_ID=your-client-id DS_CLIENT_SECRET=your-client-secret DS_REDIRECT_URI=http://localhost:8080/callback DS_REFRESH_TOKEN=your-refresh-token npm run shuffle` to create or update a playlist named "Shuffled Daily Mix"

7. Set up that above command to run on some kind of schedule

Enjoy
