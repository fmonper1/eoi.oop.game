class Wizard extends Player {
  constructor(name, health, type = "fire") {
    super(name, health);
    this.type = type;
  }

  static getType() {
    return "ENEMY";
  }

  fly() {}
}

module.exports = Wizard;
