let Player = require("./PlayerComposition");

class World {
  constructor() {
    this.player1 = Player();
  }
}

const world = new World();
setInterval(() => {
  world.player1.envejecer();
  console.log(world.player1);
}, 2000);
