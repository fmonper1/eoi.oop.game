const canHeal = state => ({
  curarse: () => (state.hitpoints = state.hitpoints + 3)
});

module.exports = canHeal;
