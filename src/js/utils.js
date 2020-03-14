export const calculatePlayerTotalScore = cardsArray => {
  return cardsArray
    .map(card => card.value)
    .reduce((a, b = 0) => convertCardValueToInt(a) + convertCardValueToInt(b));
};

export const updateTotalScore = game => {
  let currentPlayer = game.players[game.lastPlayerIndex];

  currentPlayer.score = calculatePlayerTotalScore(currentPlayer.cards);
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
