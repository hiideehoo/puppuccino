const {Item, Weapon, items} = require('./items.js');

class Entity {
    constructor(name, silver, rawInv) {
        this.name = name,
            this.silver = silver,
            this.rawInv = rawInv;
    }
}

let player = new Entity("", 0, [[], [], [items['napkin']]]);

let pup = new Entity("Puppuccino", 501, [[], [], [items['compass'], items['map']]]);

module.exports = {Entity, player, pup}