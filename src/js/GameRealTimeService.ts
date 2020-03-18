import { Player } from './models/Player';

export interface GameRealTimeService {



  initGame();
  waitingFor()
  newPlayer(player: Player);
  join();
}
