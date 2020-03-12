let canSay = require("./actions/canSay");
let canGrowOlder = require("./actions/canGrowOlder");
let canHeal = require("./actions/canHeal");
let canAttack = require("./actions/canAttack");

const Wizard = (name = "Paco", hitpoints = 10, type = "fire") => {
  let state = {
    name,
    hitpoints,
    type,
    x: 0,
    y: 0,
    z: 0
  };

  return Object.assign(
    state,
    canGrowOlder(state),
    canHeal(state),
    canSay(state),
    canAttack(state)
  );
};

module.exports = Wizard;
