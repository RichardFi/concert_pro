const express = require('express');
const router = express.Router();
const request = require('request-promise');
const async = require("async");

// spotify client id
const client_id = '';
// spotify secret
const client_secret = '';
// songkick key
const songkick_key = '';

// the  application requests authorization
const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

// search locations based on the input query by songkick
router.get('/location/:query', (req, res) => {
  const base_url_songkick = 'https://api.songkick.com/api/3.0/'
  request.get(base_url_songkick + "search/locations.json?query=" + req.params.query + "&apikey=" + songkick_key, function (error, response, body) {
    body = JSON.parse(body)
    // send empty if cannot find a location
    if (body.resultsPage.results.location== undefined){
      res.send([])
    }
    else{
      res.send(body.resultsPage.results.location)
    }
  })
});

// sending concert information around the location selected with geo information for showing on the leaflet map
router.get('/concert/:query', (req, res) => {
  const base_url_songkick = 'https://api.songkick.com/api/3.0/'
  request.get(base_url_songkick + "events.json?location=sk:" + req.params.query + "&apikey=" + songkick_key, function (error, response, body) {
    //+'&per_page=10'
    body = JSON.parse(body)
    res.send(body)
  })
});

// search related artists and their concert information
router.get('/artist/:query', (req, res) => {
  // search artist id of the input artist
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      // use the access token to access the Spotify Web API
      const token = body.access_token;
      const base_url_spotify = 'https://api.spotify.com/v1/';
      const fetch_artist_id_url = base_url_spotify + 'search?q=' + req.params.query + '&type=artist&limit=1';

      const options = {
        url: fetch_artist_id_url,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      // artists and thier conerts information to be sent at the end
      var artists_concerts = new Map();
      // use the input artist name to find artist id and other information
      request.get(options, function (error, response, body) {
        if (body.artists.items[0] == undefined) {
          res.send(artists_concerts)
        }
        else {
          artist_id = body.artists.items[0].id;

          const fetch_related_artist_url = base_url_spotify + 'artists/' + artist_id + '/related-artists';

          const options = {
            url: fetch_related_artist_url,
            headers: {
              'Authorization': 'Bearer ' + token
            },
            json: true
          };
          // get related artists information
          request.get(options, function (error, response, body) {
            artists_info = body.artists
            const base_url_songkick = 'https://api.songkick.com/api/3.0/'

            async.eachSeries(artists_info, (artist, callback) => {
              request.get(base_url_songkick + 'search/artists.json?apikey=' + songkick_key + '&query=' + artist.name, function (error, response, body) {
                body = JSON.parse(body)

                if (body.resultsPage.results.artist == undefined) {
                  artists_concerts.set(artist.name, NaN)
                }
                else {
                  //artists_songkick_id.push(body.resultsPage.results.artist[0].id)
                  //artists_songkick_id.set(artist.name, body.resultsPage.results.artist[0].id)
                  artist_songkick_id = body.resultsPage.results.artist[0].id
                  request.get(base_url_songkick + 'artists/' + artist_songkick_id + '/calendar.json?apikey=' + songkick_key, function (error, response, body) {
                    body = JSON.parse(body)
                    if (body.resultsPage.results.event == undefined) {
                      artists_concerts.set(artist.name, NaN)
                    }
                    else {
                      artists_concerts.set(artist.name, body.resultsPage.results.event[0])
                    }
                  })
                }
                callback()
              })
            },
              function (err) {
                //all done
                res.send({ artists_concerts: Array.from(artists_concerts) })
                artists_concerts = new Map()
              }
            );
          });
        }
      });

    }
  });
});


module.exports = router;




