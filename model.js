var apiURL = "https://games-world.herokuapp.com";

function getGameList() {
  return fetch(apiURL + "/games", {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then((response) => response.json());
}

//definim functia
function deleteGame(gameID) {
  return fetch(apiURL + "/games/" + gameID, {
    method: "DELETE",
  }).then((r) => r.text());
}

//=================================

//AICI SE CREAZA UN NOU JOC============

function createGameRequest(gameObj) {
  return fetch(apiURL + "/games", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: gameObj,
  }).then((response) => response.json());
}
//===========================

function updateGameRequest(gameid, updatedGameObj) {
  return fetch(apiURL + "/games/" + gameid, {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: updatedGameObj,
  }).then((response) => response.json());
}
