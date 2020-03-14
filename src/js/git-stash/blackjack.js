import fetch from 'node-fetch';

import { calculatePlayerTotalScore, updateTotalScore, convertCardValueToInt } from '../utils';

// TODO: Se hacen muchas llamadas a la api: deberia hacer una y guardarlas en un array

export const setupDeckData = game => {
  return fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(res => res.json())
    .then(body => {
      game.deck = body;
      return game;
    });
};

export const setupPlayers = game => {
  game.players = new Array(game.numOfPlayers + 1).fill().map(() => ({
    cards: [],
    score: 0,
    isBusted: false,
    isDealer: false
  }));
  game.players[game.numOfPlayers].isDealer = true;

  console.log('SetupPlayers() game is equals to', game);
  return game;
};

// I add one so that in the last iteration
// we can give the dealer its cards
export const drawFirstRound = async game => {
  for (let i = 0; i < game.numOfPlayers + 1; i++) {
    const cardsFromApi = await getCardFromApi(game, 2);

    game.lastPlayerIndex = i;
    game.players[i].cards = cardsFromApi;
    game.players[i].score = calculatePlayerTotalScore(game.players[i].cards);

    const isDealer = game.players[i].isDealer ? 'dealer' : game.lastPlayerIndex;

    renderCards(isDealer, game.players[i].cards);
    renderPlayerScore(game);
  }

  game.lastPlayerIndex = 0;
  return game;
};

export const drawCard = async game => {
  const i = game.lastPlayerIndex;
  const newCard = await getCardFromApi(game, 1);
  game.players[i].cards = game.players[i].cards.concat(newCard);
  const isDealer = game.players[i].isDealer ? 'dealer' : game.lastPlayerIndex;

  renderCards(isDealer, newCard);
  return game;
};

const getCardFromApi = (game, numOfCards) => {
  // console.log("drawCard", game, numOfCards);
  return fetch(`https://deckofcardsapi.com/api/deck/${game.deck.deck_id}/draw/?count=${numOfCards}`)
    .then(res => res.json())
    .then(body => body.cards);
};

export const renderCards = (id, cards) => {
  const playerCards = document.getElementById(`player-${id}-cards`);

  cards.forEach(async card => {
    const img = document.createElement('img');
    img.src = card.images.png;
    img.classList = 'card-img';
    img.display = 'block';

    await playerCards.appendChild(img); // si no la hago asyn aveces alguna carta no se renderiza ??
  });
};

export const renderPlayerScore = game => {
  // si el indice es el ultimo hay que devolver dealer para encontrar el div por ID
  const playerIdentifier = game.players[game.lastPlayerIndex].isDealer ? 'dealer' : game.lastPlayerIndex;

  const playerScoreDiv = document.getElementById(`player-${playerIdentifier}-score`);

  playerScoreDiv.innerHTML = game.players[game.lastPlayerIndex].isBusted ? 'Busted' : game.players[game.lastPlayerIndex].score;

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
  console.log('game cuando es el turno del player', game.lastPlayerIndex, game);

  if (game.lastPlayerIndex === game.numOfPlayers) {
    console.log('game cuando es el turno del dealer', game);
    game = dealerFinalHand(game);
  }
  return game;
};

const dealerFinalHand = game => {
  if (game.lastPlayerIndex === game.numOfPlayers) {
    while (game.players[game.numOfPlayers].score < 16) {
      return drawCardLogic(game);
    }
  }
  return game;
};

export const isBusted = game => {
  if (game.players[game.lastPlayerIndex].score > 21) {
    game.players[game.lastPlayerIndex].isBusted = true;
  }
  return game;
};

export const drawCardLogic = async game => {
  console.log('drawCardLogic() game is equal to', game, typeof game);

  game = await drawCard(game);
  game = updateTotalScore(game);
  game = isBusted(game);
  game = renderPlayerScore(game);
  game = finishTurnIfBusted(game);

  return game;
};
