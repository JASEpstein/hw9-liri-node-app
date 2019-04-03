require("dotenv").config();

var axios = require("axios");
var moment = require("moment");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);


var searchType = process.argv[2];
var searchTerm = process.argv.slice(3).join(" ");

function concertThis(searchTerm) {
    axios.get('https://rest.bandsintown.com/artists/' + searchTerm + '/events?app_id=codingbootcamp').then(function (response) {
            if (response.data === []) {
                console.log('There were no results for that artist.');
            }
            return response.data.map(function (event, index) {
                var name = event.venue.name;
                var dateTime = event.datetime;
                //For European locations that don't have a 'state' name
                var city = ''
                if (event.venue.region === '') {
                    city = event.venue.city + ', ' + event.venue.country;
                } else {
                    city = event.venue.city + ', ' + event.venue.region;
                }

                if (index <= 4) {
                    console.log('==========================================');
                    console.log('Event#' + (index + 1));
                    console.log('Venue Name: ' + name);
                    console.log('Location: ' + city);
                    console.log('Date: ' + moment(dateTime).format("dddd, MMMM Do YYYY, h:mm a"));
                    console.log('==========================================');
                } else {
                    return
                }
            })
        })
        .catch(function (error) {
            console.log('error');
        })
}

function spotifyThis(searchTerm) {
    spotify.search({
        type: 'track',
        query: searchTerm
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songs = data.tracks.items;
        songs.forEach(function (song, index) {
            if (index <= 4) {
                console.log('==========================================');
                console.log('Song#' + (index + 1));
                console.log('----------');
                console.log('Artist: ' + song.artists[0].name);
                console.log('Song: ' + song.name);
                console.log('URL: ' + song.preview_url);
                console.log('Album: ' + song.album.name);
            }
        });
    })
};

function defaultSpotifyThis() {
    spotify.search({
        type: 'track',
        query: 'the sign ace of base',
        limit: 1
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var song = data.tracks.items[0];
        console.log('==========================================');
        console.log('Artist: ' + song.artists[0].name);
        console.log('Song: ' + song.name);
        console.log('URL: ' + song.preview_url);
        console.log('Album: ' + song.album.name);
        console.log('==========================================');
    })
}

function movieThis(searchTerm) {
    axios.get('http://www.omdbapi.com/?t=' + searchTerm + '&apikey=eaa046d7')
        .then(function (response) {
            var res = response.data;
            console.log('===========================');
            console.log('Title: ' + res.Title);
            console.log('Year: ' + res.Year);
            console.log('IMDB Rating: ' + res.Ratings[0].Value);
            console.log('Rotten Tomatoes Rating: ' + res.Ratings[1].Value);
            console.log('Country Where Produced: ' + res.Country);
            console.log('Language: ' + res.Language);
            console.log('Plot: ' + res.Plot);
            console.log('Actors: ' + res.Actors);
            console.log('===========================');

        })
        .catch(function (error) {
            console.log('error');
        })
}

function defaultMovie() {

}


switch (searchType) {

    case 'concert-this':
        concertThis(searchTerm);
        break;

    case 'spotify-this-song':
        if (searchTerm) {
            spotifyThis(searchTerm);
        } else {
            defaultSpotifyThis();
        }
        break;

    case 'movie-this':
        if (searchTerm) {
            movieThis(searchTerm);
        } else {
            defaultMovie();
        }
        break;

}