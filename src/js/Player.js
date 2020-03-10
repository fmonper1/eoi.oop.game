class Player {
  constructor(n = "Paco", l = 10) {
    this.name = n;
    this.life = l;
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  static getType() {
    return "PLAYER";
  }

  envejecer() {
    this.life -= 1;
    console.log(`${this.name} ha envejecido; hp ${this.life} `);
  }

  curarse() {
    this.life += 3;
  }

  say(msg) {
    console.log(msg);
  }
}

module.exports = Player;
