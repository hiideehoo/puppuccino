const readline = require('readline-sync');
const {Misc, Weapon, Garment, items} = require('./items.js');

class Entity {
    constructor(name, hp, silver, rawInv) {
        this.name = name;
        this.hp = hp;
        this.silver = silver;
        this.rawInv = rawInv;
        this.armor = armorFactor(this);
    }
}

function armorFactor(npc) {
    let sum = 0;
    let scan = npc.rawInv[1].filter( item => (item.category === 1) );
    scan.forEach( item => {sum += item.dt} );
    return sum;
}

function weaponFactor(npc) {
    let sum = 0;
    let scan = npc.rawInv[1].filter( item => (item.category === 0) );
    scan.forEach( item => {sum += item.damage} );
    return sum;
}

function playerName() {
    player.name = readline.question(`> What is your name?\n>> `);
}

let player = new Entity(
    "", 20, 10000, [
        [ items['sword'], items['axe'], items['bow'],
        items['helmet'],
        items['napkin'] ],

        []
    ]);

let pup = new Entity(
    "Puppuccino", 20, 501, [ 
        [ items['hat'], items['cuirass'], items['gauntlets'], items['greaves'], items['boots'],
        items['compass'], items['map'], items['emerald'], items['emerald'] ],

        []
    ]);

module.exports = {Entity, armorFactor, weaponFactor, playerName, player, pup}