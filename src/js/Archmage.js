class Archmage extends Wizard {
  constructor(name, health, type = "fire") {
    super(name, health);
    this.type = type;
  }

  fly() {
    this.y += 10;
  }
}

module.exports = Archmage;
