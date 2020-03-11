const fetch = require("../../../node_modules/node-fetch");

let gameObject = {
  dealer: [],
  players: [],
  houseCards: [],
  deck: {},
  numOfPlayers: 4
};

const setupPlayers = (game, body) => {
  return new Promise((resolve, reject) => {
    console.log("setup players", game);

    game.deck = body;
    game.players = new Array(game.numOfPlayers).fill([]);
    resolve(game);
  });
};

const drawTwoCards = (game, player) => drawCard(game, player, 2, false);
const dealerDrawTwoCards = game => drawCard(game, 0, 2, true);
const drawOneCard = (game, player) => drawCard(game, player, 1, false);
const dealerDrawOneCard = game => drawCard(game, 0, 1, true);

const drawCard = (game, player, numOfCards, isDealer) => {
  return new Promise((resolve, reject) => {
    console.log("drawcard-gameparam", game);
    fetch(
      `https://deckofcardsapi.com/api/deck/${game.deck.deck_id}/draw/?count=${numOfCards}`
    )
      .then(res => res.json())
      .then(body => {
        console.log(body);
        console.log(player);
        if (isDealer) {
          game.houseCards = game.houseCards.concat(body.cards);
          game.deck.remaining = body.remaining;
          renderCard(`dealer`, body.cards);
        } else {
          game.players[player] = game.players[player].concat(body.cards);
          game.deck.remaining = body.remaining;
          renderCard(`player-${player}`, body.cards);
        }
        resolve(game);
      });
  });
};

const renderCard = (id, cards) => {
  const playerCards = document.getElementById(id);
  cards.forEach(card => {
    let img = document.createElement("img");
    img.src = card.images.png;
    img.width = 50;
    playerCards.appendChild(img);
  });
};

const drawFirstRound = async game => {
  for (let i = 0; i < game.players.length; i++) {
    let gameObject = game;
    await drawTwoCards(gameObject, i);
  }
  await dealerDrawTwoCards(gameObject);

  return game;
};

fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
  .then(res => res.json())
  .then(body => setupPlayers(gameObject, body))
  .then(game => drawFirstRound(game))
  .then(game => drawOneCard(game, 1))
  .then(game => {
    console.log("last", game);
    console.log("last", game.players[0]);
  });
