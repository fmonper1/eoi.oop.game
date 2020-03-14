export const endTurnButton = game => {
  const endTurnBtn = document.getElementById('endTurn');
  endTurnBtn.addEventListener('click', () => {
    console.log('turn ended');
    console.log('endTurnButton() game is equal to', game, typeof game);

    game.finishTurn();
  });
};

export const drawCardButton = game => {
  const drawCardBtn = document.getElementById('drawCard');
  drawCardBtn.addEventListener('click', () => {
    game.drawCardLogic();
  });
};
