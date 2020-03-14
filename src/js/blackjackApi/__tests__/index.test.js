import { initGame } from '../index';

describe('index', () => {
  describe('initGame', () => {
    // Test de andamino para saber por dónde ir metiendo mano.
    // El require puesto de esta forma no es nada bonito, pero el código está acoplado
    // y de momento es la forma menos invasiba
    test.skip('Al iniciar el juego se debe hacer un setup inicial de la baraja', async () => {
      const spy = jest.fn().mockResolvedValue({});
      require('../blackjack').setupDeckData = spy;

      await initGame();

      expect(spy).toBeCalledTimes(1);
    });

    // Al tener una dependencia con game.numOfPlayers el método setupPlayers falla
    // RangeError: Invalid array length.
    // Este es el problema de hacer las funciones impuras. Si quisiesemos probar esto
    // tendríamos que hacer un test andamio de todo el initiGame (lo pongo más abajo)
    // Nota: Pongo el .skip para que no ejecute el test ya que falla por lo de arriba ⬆️
    test.skip('Al iniciar el juego se deben inicializar los players', async () => {
      const spy = jest.fn().mockResolvedValue({});
      require('../blackjack').setupPlayers = spy;

      await initGame();

      expect(spy).toBeCalledTimes(1);
    });

    // Igual que en el caso anterior. Alta dependencia y acoplamiento
    test.skip('Al iniciar el juego debe repartir la primera ronda', async () => {
      const spy = jest.fn().mockResolvedValue({});
      require('../blackjack').drawFirstRound = spy;

      await initGame();

      expect(spy).toBeCalledTimes(1);
    });

    // TODO: andamio brutal este test no debería aparecer
    // Fíjense en el async en el segundo parámetro del test (para poder hacer el await initGame())
    test('Pruebo todo el initGame', async () => {
      const blackjackFunctions = require('../blackjack');
      // Tengo que generar este resultado xq es el que espera la función setupPlayers si no falla
      const fakeDeckAfterSetup = {
        numOfPlayers: 3,
        players: [{}, {}, {}]
      };
      const spySetupDeckData = jest.fn().mockResolvedValue(fakeDeckAfterSetup);
      blackjackFunctions.setupDeckData = spySetupDeckData;

      const fakeGameAfterSetupPlayers = {};
      const spySetupPlayers = jest.fn().mockResolvedValue(fakeGameAfterSetupPlayers);
      blackjackFunctions.setupPlayers = spySetupPlayers;

      const fakeGameAfterFirstRound = {};
      const spyDrawFirstRound = jest.fn().mockResolvedValue(fakeGameAfterFirstRound);
      blackjackFunctions.drawFirstRound = spyDrawFirstRound;

      const userInteractionsFunctions = require('../userInteractions');
      const spyDrawCardButton = jest.fn().mockResolvedValue({});
      userInteractionsFunctions.drawCardButton = spyDrawCardButton;

      const spyEndTurnButton = jest.fn().mockResolvedValue({});
      userInteractionsFunctions.endTurnButton = spyEndTurnButton;

      await initGame();

      expect(spySetupDeckData).toBeCalledTimes(1);
      expect(spySetupPlayers).toBeCalledTimes(1);
      expect(spyDrawFirstRound).toBeCalledTimes(1);
      expect(spyDrawCardButton).toBeCalledTimes(1);
      expect(spyEndTurnButton).toBeCalledTimes(1);
    });
  });
});
