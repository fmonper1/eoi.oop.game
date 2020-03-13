const fetch = require("../../../node_modules/node-fetch");

let gameObject = {
  players: [],
  lastPlayerIndex: 0,
  houseCards: [],
  deck: {},
  numOfPlayers: 4,
  playersLeft: 4
};

const startGame = gameObject => {
  return fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
    .then(res => res.json())
    .then(body => {
      gameObject.deck = body;
      return gameObject;
    })
    .then(game => setupPlayers(game))
    .then(game => drawFirstRound(game))
    .then(game => {
      console.log("last", game);
      return game;
    });
};

const setupPlayers = game => {
  return new Promise((resolve, reject) => {
    console.log("setup players", game);

    game.players = new Array(game.numOfPlayers).fill().map(() => ({
      cards: [],
      score: 0,
      isBusted: false
    }));
    resolve(game);
  });
};

const drawFirstRound = async game => {
  for (let i = 0; i < game.numOfPlayers; i++) {
    game.players[i].cards = await drawCard(game, 2);
  }
  return game;
};

const drawCard = (game, numOfCards) => {
  console.log("drawCard", game, numOfCards);
  return new Promise((resolve, reject) => {
    fetch(
      `https://deckofcardsapi.com/api/deck/${game.deck.deck_id}/draw/?count=${numOfCards}`
    )
      .then(res => res.json())
      .then(body => {
        console.log(body);
        resolve(body.cards);
      });
  });
};

const addCardsToUsersDeck = (game, playerIndex, cards) => {
  console.log(game.players[playerIndex]);
  game.players[playerIndex].cards = game.players[playerIndex].cards.concat(
    cards
  );
};

const checkCardSumTotal = (game, lastPlayerIndex) => {};

const renderCard = (id, cards) => {
  const playerCards = document.getElementById(id);

  cards.forEach(card => {
    let img = document.createElement("img");
    img.src = card.images.png;
    img.classList = "card-img";
    img.display = "block";

    return playerCards.appendChild(img);
  });
};

const startGameBtn = document.getElementById("startGame");
startGameBtn.addEventListener("click", async () => {
  startGameBtn.hidden = "true";
});

const drawCardBtn = document.getElementById("drawCard");
drawCardBtn.addEventListener("click", () => {
  drawOneCard(gameObject, gameObject.lastPlayerIndex);
});

const endTurnBtn = document.getElementById("endTurn");
endTurnBtn.addEventListener("click", () => {
  gameObject.lastPlayerIndex++;
});

console.log("gameObject", gameObject);
gameObject = startGame(gameObject);
