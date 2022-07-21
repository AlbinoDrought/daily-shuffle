const config = require('./config');

if (!config.clientId || !config.clientSecret || !config.redirectUri) {
  console.error('Please set DS_CLIENT_ID DS_CLIENT_SECRET DS_REDIRECT_URI');
  process.exit(1);
}

// stuff below this line is 99% from the spotify oauth demo

/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const querystring = require('querystring');

const app = express();

app.get('/', function(req, res) {
  // your application requests authorization
  const scope = 'user-read-private playlist-read-private playlist-modify-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: config.clientId,
      scope: scope,
      redirect_uri: config.redirectUri,
      state: 'stateless',
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(config.clientId + ':' + config.clientSecret).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body.refresh_token);
      res.header('Content-Type', 'text/plain');
      res.send(body.refresh_token);
    } else {
      console.error(error, response);
      res.sendStatus(500);
    }
  });
});

console.log('Listening on 8080');
app.listen(8080);
