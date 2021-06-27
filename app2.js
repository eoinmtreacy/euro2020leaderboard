const express = require('express')
const ejs = require('ejs')
const https = require('https')
const request = require('request')

let app = express()

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs')

let paul = {
  name: 'Paul',
  teams: ['Belgium', 'Croatia', 'Russia', 'Sweden'],
  teamOdds: [6, 36,60,78],
  teamRanks: [],
  teamPoints: [],
  r16Points: [0,0,0,0],
  teamFlag: [],
  playerPoints: 0
}
let daniel = {
  name: 'Daniel',
  teams: ['France', 'Netherlands', 'Ukraine', 'FYR Macedonia'],
  teamOdds: [6, 18,78,480],
  teamRanks: [],
  teamPoints: [],
  r16Points: [0,0,0,0],
  teamFlag: [],
  playerPoints: 0
}
let aoibhin = {
  name: 'Aoibhín',
  teams: ['France', 'Italy', 'Poland', 'Scotland'],
  teamOdds: [6, 12,60,180],
  teamRanks: [],
  teamPoints: [],
  r16Points: [0,2,0,0],
  teamFlag: [],
  playerPoints: 0
}
let shayne = {
  name: 'Shayne',
  teams: ['France', 'Portugal', 'Switzerland', 'Scotland'],
  teamOdds: [6, 12,60,180],
  teamRanks: [],
  teamPoints: [],
  r16Points: [0,0,0,0],
  teamFlag: [],
  playerPoints: 0
}
let roise = {
  name: 'Róise',
  teams: ['Italy', 'Turkey', 'Poland', 'Hungary'],
  teamOdds: [12, 60,60,240],
  teamRanks: [],
  teamPoints: [],
  r16Points: [2,0,0,0],
  teamFlag: [],
  playerPoints: 0
}
let eoin = {
  name: 'Eoin',
  teams: ['Denmark', 'Poland', 'Turkey', 'Ukraine'],
  teamOdds: [36, 60,60,78],
  teamRanks: [],
  teamPoints: [],
  r16Points: [6,0,0,0],
  teamFlag: [],
  playerPoints: 0
}

let players = [paul, daniel, aoibhin, shayne, roise, eoin]

let calculateT2 = function(players,ranks) {
  for (i = 0; i < players.length; i++) {
    for (j = 0; j < 4; j++) {
      for (k = 0; k < ranks.length; k++) {
        if (ranks[k].Name === players[i].teams[j]) {
          players[i].teamRanks[j] = ranks[k].Rank
        }
      }
    }
  }
}

let getFlags = function(players,ranks) {
  for (i = 0; i < players.length; i++) {
    for (j = 0; j < 4; j++) {
      for (k = 0; k < ranks.length; k++) {
        if (ranks[k].Name === players[i].teams[j]) {
          players[i].teamFlag[j] = ranks[k].Flag
        }
      }
    }
  }
}

let calculatePoints = function(players) {
  for (i = 0; i < players.length; i++) {
    for (j = 0; j < 4; j++) {
      if (players[i].teamRanks[j] === 1 || players[i].teamRanks[j] === 2) {
        players[i].teamPoints[j] = players[i].teamOdds[j] * (1/3)
      } else {
        players[i].teamPoints[j] = 0
      }
    }
  }
}

let calculateTotal = function(players) {
  for (i = 0; i < players.length; i++) {
      players[i].playerPoints = players[i].teamPoints[0] + players[i].teamPoints[1] + players[i].teamPoints[2] + players[i].teamPoints[3] + players[i].r16Points[0] + players[i].r16Points[1] + players[i].r16Points[2] + players[i].r16Points[3]
  }
}

function compare(a,b) {
        return b.playerPoints - a.playerPoints
      }

app.get('/', function (req, res) {

  // var options = {
  //   'method': 'GET',
  //   'hostname': 'v3.football.api-sports.io',
  //   'path': '/teams?league=4&season=2020',
  //   'headers': {
  //     'x-rapidapi-host': 'v3.football.api-sports.io',
  //     'x-rapidapi-key': 'f20ef6a75df4495ad60cabbb56810574'
  //   },
  //   'maxRedirects': 20
  // };

  var options2 = {
    'method': 'GET',
    'hostname': 'v3.football.api-sports.io',
    'path': '/teams?season=2020&league=4&h2h=1-27',
    'headers': {
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': 'f20ef6a75df4495ad60cabbb56810574'
    },
    'maxRedirects': 20
  };

  var request = https.request(options2, function (response) {
    console.log(response.statusCode)
    let chunks =''

    response.on("data", function(data) {
      chunks += data
    })

    response.on("end", function() {
      let clean = JSON.parse(chunks)
      // let teamId = []
      // for (i = 0; i < (clean.response).length; i++) {
      //   let grab = {
      //     team: clean.response[i].team.name,
      //     id: clean.response[i].team.id
      //   }
      //   teamId.push(grab)
      // }
      console.log(clean.response[0]);
      // console.log(teamId);
      res.render('index', {players: players})
      // console.log(players)
    })

    response.on("error", function (error) {
      console.error(error)
    })
  })



  request.end()



  // console.log(players)

})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log('Server is runnig on port 3000.')
})
