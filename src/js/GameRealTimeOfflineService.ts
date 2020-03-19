import { GameRealTimeService } from './GameRealTimeService';
import { Player } from './models/Player';

export class GameLANOfflineService implements GameRealTimeService {
  constructor() {
    channel.on('new-player', args => this.newPlayer(args));
  }

  newPlayer(player: Player) {
    player.remote = true;
    this.game.player.add(player);
  }

  initGame() {}

  waitingFor() {}

  join() {}

  playerCard();
}
