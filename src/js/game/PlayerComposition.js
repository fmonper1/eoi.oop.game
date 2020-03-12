let canSay = require("./actions/canSay");
let canGrowOlder = require("./actions/canGrowOlder");
let canHeal = require("./actions/canHeal");

const Player = (name = "Paco", hitpoints = 10) => {
  let state = {
    name,
    hitpoints,
    x: 0,
    y: 0,
    z: 0
  };

  return Object.assign(
    state,
    canGrowOlder(state),
    canHeal(state),
    canSay(state)
  );
};

module.exports = Player;
