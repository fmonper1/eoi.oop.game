const canDefend = status => ({
  defend: () => console.log(status.name + " defended himself")
});

module.exports = canDefend;
