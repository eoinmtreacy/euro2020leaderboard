const express = require('express')
const ejs = require('ejs')
const https = require('https')
const request = require('request')

let app = express()

app.set('view engine', 'ejs')

let paul = {
  name: 'Paul',
  teams: ['Belgium', 'Croatia', 'Russia', 'Sweden'],
  teamOdds: [6, 36,60,78],
  teamRanks: [],
  teamPoints: [],
  playerPoints: 0
}
let daniel = {
  name: 'Daniel',
  teams: ['France', 'Netherlands', 'Ukraine', 'FYR Macedonia'],
  teamOdds: [6, 18,78,480],
  teamRanks: [],
  teamPoints: [],
  playerPoints: 0
}
let aoibhin = {
  name: 'Aoibhín',
  teams: ['France', 'Italy', 'Poland', 'Scotland'],
  teamOdds: [6, 12,60,180],
  teamRanks: [],
  teamPoints: [],
  playerPoints: 0
}
let shayne = {
  name: 'Shayne',
  teams: ['France', 'Portugal', 'Switzerland', 'Scotland'],
  teamOdds: [6, 12,60,180],
  teamRanks: [],
  teamPoints: [],
  playerPoints: 0
}
let roise = {
  name: 'Róise',
  teams: ['Italy', 'Turkey', 'Poland', 'Hungary'],
  teamOdds: [12, 60,60,240],
  teamRanks: [],
  teamPoints: [],
  playerPoints: 0
}
let eoin = {
  name: 'Eoin',
  teams: ['Denmark', 'Poland', 'Turkey', 'Ukraine'],
  teamOdds: [36, 60,60,78],
  teamRanks: [],
  teamPoints: [],
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
      players[i].playerPoints = players[i].teamPoints[0] + players[i].teamPoints[1] + players[i].teamPoints[2] + players[i].teamPoints[3]
  }
}

function compare(a,b) {
        return b.playerPoints - a.playerPoints
      }

app.get('/', function (req, res) {

  var options = {
    'method': 'GET',
    'hostname': 'v3.football.api-sports.io',
    'path': '/standings?league=4&season=2020',
    'headers': {
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': 'f20ef6a75df4495ad60cabbb56810574'
    },
    'maxRedirects': 20
  };

  var request = https.request(options, function (response) {
    console.log(response.statusCode)
    let chunks =''

    response.on("data", function(data) {
      chunks += data
    })

    response.on("end", function() {
      let clean = JSON.parse(chunks)
      let groupA = (clean.response[0].league.standings[0])
      let groupB = (clean.response[0].league.standings[1])
      let groupC = (clean.response[0].league.standings[2])
      let groupD = (clean.response[0].league.standings[3])
      let groupE = (clean.response[0].league.standings[4])
      let groupF = (clean.response[0].league.standings[5])

      let teamRanks = []

      for (i = 0; i < 4; i++) {
        let team = {
          Name: groupA[i].team.name,
          Rank: groupA[i].rank
        }
        teamRanks.push(team)
      }
      for (i = 0; i < 4; i++) {
        let team = {
          Name: groupB[i].team.name,
          Rank: groupB[i].rank
        }
        teamRanks.push(team)
      }
      for (i = 0; i < 4; i++) {
        let team = {
          Name: groupC[i].team.name,
          Rank: groupC[i].rank
        }
        teamRanks.push(team)
      }
      for (i = 0; i < 4; i++) {
        let team = {
          Name: groupD[i].team.name,
          Rank: groupD[i].rank
        }
        teamRanks.push(team)
      }
      for (i = 0; i < 4; i++) {
        let team = {
          Name: groupE[i].team.name,
          Rank: groupE[i].rank
        }
        teamRanks.push(team)
      }
      for (i = 0; i < 4; i++) {
        let team = {
          Name: groupF[i].team.name,
          Rank: groupF[i].rank
        }
        teamRanks.push(team)
      }
      calculateT2(players,teamRanks)
      calculatePoints(players)
      calculateTotal(players)
      players.sort(compare)
      res.render('index', {players: players})
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
