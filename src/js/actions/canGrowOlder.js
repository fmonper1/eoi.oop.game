const canGrowOlder = state => ({
  envejecer: () => (state.hitpoints = state.hitpoints - 1)
});

module.exports = canGrowOlder;
