import fetch from "node-fetch";

// TODO: Se hacen muchas llamadas a la api: deberia hacer una y guardarlas en un array

// let gameObject = {
//   players: [],
//   lastPlayerIndex: 0,
//   deck: {},
//   numOfPlayers: 4,
//   isFinished: false
// };

export const startGame = game => {
  return fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
    .then(res => res.json())
    .then(body => {
      game.deck = body;
      return game;
    })
    .then(game => setupPlayers(game))
    .then(game => drawFirstRound(game))
    .then(game => game);
};

const setupPlayers = game => {
  game.players = new Array(game.numOfPlayers + 1).fill().map(() => ({
    cards: [],
    score: 0,
    isBusted: false,
    isDealer: false
  }));
  game.players[game.numOfPlayers].isDealer = true;

  console.log("SetupPlayers() game is equals to", game);
  return game;
};

const calculatePlayerTotalScore = cardsArray => {
  return cardsArray
    .map(card => card.value)
    .reduce((a, b = 0) => convertCardValueToInt(a) + convertCardValueToInt(b));
};

export const updateTotalScore = game => {
  let currentPlayer = game.players[game.lastPlayerIndex];

  currentPlayer.score = calculatePlayerTotalScore(currentPlayer.cards);
  return game;
};

// I add one so that in the last iteration
// we can give the dealer its cards
const drawFirstRound = async game => {
  for (let i = 0; i < game.numOfPlayers + 1; i++) {
    let cardsFromApi = await getCardFromApi(game, 2);

    game.lastPlayerIndex = i;
    game.players[i].cards = cardsFromApi;
    game.players[i].score = calculatePlayerTotalScore(game.players[i].cards);

    let isDealer =
      game.lastPlayerIndex === game.numOfPlayers
        ? "dealer"
        : game.lastPlayerIndex;

    renderCardInWebsite(isDealer, game.players[i].cards);
    renderPlayerScore(game);
  }

  game.lastPlayerIndex = 0;
  return game;
};

export const convertCardValueToInt = value => {
  // console.log("value", value, typeof value);
  if (value === "JACK" || value === "QUEEN" || value === "KING") {
    return 10;
  } else if (value === "ACE") {
    return 11;
  } else {
    return parseInt(value);
  }
};

export const drawCard = async game => {
  let i = game.lastPlayerIndex;
  const newCard = await getCardFromApi(game, 1);
  game.players[i].cards = game.players[i].cards.concat(newCard);
  let isDealer =
    game.lastPlayerIndex === game.numOfPlayers
      ? "dealer"
      : game.lastPlayerIndex;
  renderCardInWebsite(isDealer, newCard);
  return game;
};

const getCardFromApi = (game, numOfCards) => {
  // console.log("drawCard", game, numOfCards);
  return fetch(
    `https://deckofcardsapi.com/api/deck/${game.deck.deck_id}/draw/?count=${numOfCards}`
  )
    .then(res => res.json())
    .then(body => body.cards);
};

export const renderCardInWebsite = (id, cards) => {
  const playerCards = document.getElementById(`player-${id}`);

  cards.forEach(async card => {
    let img = document.createElement("img");
    img.src = card.images.png;
    img.classList = "card-img";
    img.display = "block";

    await playerCards.appendChild(img); //si no la hago asyn aveces alguna carta no se renderiza ??
  });
};

export const renderPlayerScore = game => {
  // si el indice es el ultimo hay que devolver dealer para encontrar el div por ID
  let playerIdentifier =
    game.lastPlayerIndex === game.numOfPlayers
      ? "dealer"
      : game.lastPlayerIndex;

  const playerScoreDiv = document.getElementById(
    `player-${playerIdentifier}-score`
  );

  playerScoreDiv.innerHTML = game.players[game.lastPlayerIndex].isBusted
    ? "Busted"
    : game.players[game.lastPlayerIndex].score;

  return game;
};

export const finishTurnIfBusted = game => {
  if (game.players[game.lastPlayerIndex].isBusted) {
    game = finishTurn(game);
  }
  return game;
};

export const finishTurn = game => {
  game.lastPlayerIndex++;
  console.log("game cuando es el turno del player", game.lastPlayerIndex, game);

  if (game.lastPlayerIndex === game.numOfPlayers) {
    console.log("game cuando es el turno del dealer", game);
    // return dealerFinalHand(game);
  }
  return game;
};

export const isBusted = game => {
  if (game.players[game.lastPlayerIndex].score > 21) {
    game.players[game.lastPlayerIndex].isBusted = true;
  }
  return game;
};

// let bjGame = startGame(gameObject);
// drawCardButton(bjGame);
// endTurnButton(bjGame);
