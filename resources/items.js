// ITEM CATALOGUE

class Misc {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.category = 2;
    }
}

class Weapon extends Misc {
    constructor(name, value, damage, hand) {
        super(name, value);
        this.damage = damage;
        this.hand = hand;
        this.category = 0;
    }
}

class Garment extends Misc {
    constructor(name, value, dt, piece) {
        super(name, value);
        this.dt = dt;
        this.piece = piece;
        this.category = 1;
    }
}

const items = {
    'sword': new Weapon("sword", 500, 5, 1),
    'axe': new Weapon("axe", 500, 6, 1),
    'bow': new Weapon("bow", 500, 11, 2),

    'helmet': new Garment("helmet", 300, 20, "head"),
    'hat': new Garment("hat", 10000, 1, "head"),
    'cuirass': new Garment("cuirass", 750, 20, "chest"),
    'gauntlets': new Garment("gauntlets", 100, 20, "arms"),
    'greaves': new Garment("greaves", 400, 20, "legs"),
    'boots': new Garment("boots", 150, 20, "feet"),

    'diamond': new Misc("diamond", 10000),
    'emerald': new Misc("emerald", 5000),
    'napkin': new Misc("napkin", 1),
    'compass': new Misc("compass", 100),
    'map': new Misc("map", 100)
}


module.exports = { Misc, Weapon, Garment, items }