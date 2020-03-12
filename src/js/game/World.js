const Player = require("./PlayerComposition");
const Wizard = require("./Wizard");

const World = () => {
  let player1 = Player();
  let enemy1 = Wizard();
};

const gameWorld = World();

setInterval(() => {
  gameWorld.player1.envejecer();
  console.log(world.player1);
}, 2000);
