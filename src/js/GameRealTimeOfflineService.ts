import { GameRealTimeService } from './GameRealTimeService';
import { Player } from './models/Player';

export class GameLANOfflineService implements GameRealTimeService {

  /next
   2A
  /next
  /finish



  constructor() {
    channel.on('new-player', (args) => this.newPlayer(args));
  }

  newPlayer(player: Player) {
    player.remote = true;
    this.game.player.add(player);
  }

  JKon() {
    setTimeout(() => {
      console.log('EY! new user');
    }, 4000);
  }

  initGame() {
  }

  waitingFor() {
  }

  join() {
  }


  playerCard()
}
