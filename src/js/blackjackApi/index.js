import fetch from "node-fetch";

// TODO: Se hacen muchas llamadas a la api: deberia hacer una y guardarlas en un array

let gameObject = {
  players: [],
  lastPlayerIndex: 0,
  deck: {},
  numOfPlayers: 4
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
    // console.log("setup players", game);
    game.players = new Array(game.numOfPlayers + 1).fill().map(() => ({
      cards: [],
      score: 0,
      isBusted: false,
      isDealer: false
    }));
    game.players[game.numOfPlayers].isDealer = true;
    console.log("SetupPlayers() game is equals to", game);
    resolve(game);
  });
};

const calculatePlayerTotalScore = cardsArray => {
  return cardsArray
    .map(card => card.value)
    .reduce(function(a, b = 0) {
      return convertCardValueToInt(a) + convertCardValueToInt(b);
    });
};

const updateTotalScore = game => {
  let currentPlayer = game.players[game.lastPlayerIndex];

  currentPlayer.score = calculatePlayerTotalScore(currentPlayer.cards);
  return game;
};

// I add one so that in the last iteration
// we can give the dealer its cards
const drawFirstRound = async game => {
  for (let i = 0; i < game.numOfPlayers + 1; i++) {
    game.lastPlayerIndex = i;
    let cardsFromApi = await getCardFromApi(game, 2);
    game.players[i].cards = cardsFromApi;
    game.players[i].score = calculatePlayerTotalScore(game.players[i].cards);

    let isDealer =
      game.lastPlayerIndex === game.numOfPlayers
        ? "dealer"
        : game.lastPlayerIndex;

    renderCard(isDealer, game.players[i].cards);
    renderPlayerScore(game);
  }

  game.lastPlayerIndex = 0;
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
  let i = game.lastPlayerIndex;
  const newCard = await getCardFromApi(game, 1);
  game.players[i].cards = game.players[i].cards.concat(newCard);
  let isDealer =
    game.lastPlayerIndex === game.numOfPlayers
      ? "dealer"
      : game.lastPlayerIndex;
  renderCard(isDealer, newCard);
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

let bjGame = startGame(gameObject);

const renderPlayerScore = game => {
  let playerIdentifier =
    game.lastPlayerIndex === game.numOfPlayers
      ? "dealer"
      : game.lastPlayerIndex;

  const playerScoreDiv = document.getElementById(
    `player-${playerIdentifier}-score`
  );

  let currentPlayer = game.players[game.lastPlayerIndex];
  // console.log(playerScoreDiv);

  playerScoreDiv.innerHTML = currentPlayer.isBusted
    ? "Busted"
    : currentPlayer.score;

  return game;
};

const drawCardBtn = document.getElementById("drawCard");
drawCardBtn.addEventListener("click", () => {
  // console.log("bjGame", bjGame);

  bjGame = bjGame
    .then(game => drawCard(game))
    .then(game => updateTotalScore(game))
    .then(game => isBusted(game))
    .then(game => renderPlayerScore(game))
    .then(game => finishTurnIfBusted(game));
  // .then(game => );
});

const finishTurnIfBusted = game => {
  if (game.players[game.lastPlayerIndex].isBusted) {
    finishTurn(game);
  }
  return game;
};

const finishTurn = game => {
  game.lastPlayerIndex++;
  return game;
};

const endTurnBtn = document.getElementById("endTurn");
endTurnBtn.addEventListener("click", () => {
  console.log("bjGame", bjGame);

  bjGame = bjGame.then(game => finishTurn(game));
});
const isBusted = game => {
  if (game.players[game.lastPlayerIndex].score > 21) {
    game.players[game.lastPlayerIndex].isBusted = true;
  }
  return game;
};
