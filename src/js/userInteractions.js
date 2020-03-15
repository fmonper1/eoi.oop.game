export const endTurnButton = game => {
  const endTurnBtn = document.getElementById('endTurn');
  endTurnBtn.addEventListener('click', async () => {
    console.log('turn ended');
    console.log('endTurnButton() game is equal to', game, typeof game);

    await game.finishTurnFromUI();
  });
};

export const drawCardButton = game => {
  const drawCardBtn = document.getElementById('drawCard');
  drawCardBtn.addEventListener('click', () => {
    game.drawCardLogic();
  });
};

export const restartGameButton = game => {
  const restartGameButton = document.getElementById('restartGame');
  restartGameButton.addEventListener('click', () => {
    game.restartGame();
  });
};
