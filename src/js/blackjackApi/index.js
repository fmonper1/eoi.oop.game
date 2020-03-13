const fetch = require("../../../node_modules/node-fetch");

//TODO: Se hacen muchas llamadas a la api: deberia hacer una y guardarlas en un array

let gameObject = {
  players: [],
  lastPlayerIndex: 0,
  dealer: { cards: [], score: 0, isBusted: false },
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
    .then(game => game);
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

// I add one so that in the last iteration
// we can give the dealer its cards
const drawFirstRound = async game => {
  for (let i = 0; i < game.numOfPlayers; i++) {
    let cardsFromApi = await getCardFromApi(game, 2);
    let player = game.players[i];
    player.cards = cardsFromApi;
    player.score = player.cards
      .map(card => card.value)
      .reduce(function(a, b = 0) {
        return convertCardValueToInt(a) + convertCardValueToInt(b);
      });
    renderCard(i, game.players[i].cards);
  }
  game.dealer.cards = await getCardFromApi(game, 2);
  renderCard("dealer", game.dealer.cards);
  return game;
};

const convertCardValueToInt = value => {
  console.log("value", value, typeof value);
  if (value === "JACK" || value === "QUEEN" || value === "KING") {
    return 10;
  } else if (value === "ACE") {
    return 11;
  } else {
    return parseInt(value);
  }
};

const drawCard = async game => {
  if (game.lastPlayerIndex < game.numOfPlayers) {
    let i = game.lastPlayerIndex;
    const newCard = await getCardFromApi(game, 1);
    game.players[i].cards = game.players[i].cards.concat(newCard);
    renderCard(i, newCard);
    return game;
  } else {
    const newCard = await getCardFromApi(game, 1);
    game.dealer.cards = game.dealer.cards.concat(newCard);
    renderCard("dealer", newCard);
    return game;
  }
};

const getCardFromApi = (game, numOfCards) => {
  console.log("drawCard", game, numOfCards);
  return fetch(
    `https://deckofcardsapi.com/api/deck/${game.deck.deck_id}/draw/?count=${numOfCards}`
  )
    .then(res => res.json())
    .then(body => {
      console.log(body);
      return body.cards;
    });
};

const checkCardSumTotal = (game, lastPlayerIndex) => {};

const renderCard = (id, cards) => {
  const playerCards = document.getElementById(`player-${id}`);

  cards.forEach(async card => {
    let img = document.createElement("img");
    img.src = card.images.png;
    img.classList = "card-img";
    img.display = "block";

    playerCards.appendChild(img); //si no la hago asyn aveces alguna carta no se renderiza ??
  });
};

console.log("gameObject", gameObject);
let bjGame = startGame(gameObject);
console.log("gameObject", gameObject);

const drawCardBtn = document.getElementById("drawCard");
drawCardBtn.addEventListener("click", () => {
  console.log("bjGame", bjGame);

  bjGame = bjGame.then(game => drawCard(game));
});

const endTurnBtn = document.getElementById("endTurn");
endTurnBtn.addEventListener("click", () => {
  console.log("bjGame", bjGame);

  bjGame = bjGame.then(game => {
    game.lastPlayerIndex++;
    return game;
  });
});
