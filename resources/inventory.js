const readline = require('readline-sync');
const {Misc, Weapon, Garment, items} = require('./items.js');
const {Entity, armorFactor, weaponFactor, playerName, player, pup} = require('./npc.js');

// INVENTORY

class Container {
    constructor(name, silver, rawInv) {
        this.name = name;
        this.silver = silver;
        this.rawInv = rawInv;
    }
}

let caveKnapsack = new Container("the Dusty Ol' Knapsack", 7, [[items["sword"]]], []);
let homeChest = new Container(`${player.name}'s chest`, 0, [[], []]);

// TRADE FUNCTIONS

function displayInventory(entity) {
    return (`\n${entity.name.toUpperCase()}'S INVENTORY
Silver: ₵${entity.silver}
Weapons: ${entity.rawInv[0].filter(item => (item.category === 0)).map(item => `${item.name} (${item.damage}dmg, ₵${item.value})`).sort().join(", ")}
Garments: ${entity.rawInv[0].filter(item => (item.category === 1)).map(item => `${item.name} (${item.dt}dt, ₵${item.value})`).sort().join(", ")}
Misc: ${entity.rawInv[0].filter(item => (item.category === 2)).map(item => `${item.name} (₵${item.value})`).sort().join(", ")}`);
}

function gainItem(entity, item) { 
    entity.rawInv[0].push(item); }

function loseItem(entity, item) {
    if (entity.rawInv[0].includes(item) === true) {
        entity.rawInv[0].splice(entity.rawInv[0].indexOf(item), 1);
    }
}

function gainAll(loser, winner) {
    winner.silver += loser.silver;
    for (let item = 0; item < loser.rawInv[0].length; item++) {
        let id = items[loser.rawInv[0][item].name];
        winner.rawInv[0].push(id);
    }
    loser.silver = 0;
    loser.rawInv = [[], []];
};

function loseAll(loser) {
    loser.silver = 0;
    loser.rawInv = [[], []];
}

function barter(entity) {
    let selectTransfer = "";
    do {
        selectTransfer = readline.question(`> Would you like to 'buy,' 'sell,' or 'exit?'\n>> `).toLowerCase();
        if (selectTransfer === "sell") { sell() }
        else if (selectTransfer === "buy") { buy() }
        else if (selectTransfer === "exit") { return }
    } while (selectTransfer !== "exit");

    function buy() {
        let selectInherit = "";
        do {
            console.log(displayInventory(entity));
            console.log(displayInventory(player));
            selectInherit = readline.question(`\n> Type an item to buy or type 'sell' or 'exit.'\n>> `).split('').filter(letter => letter !== ' ').join('').toLowerCase();
            if (selectInherit === 'exit') { selectTransfer = 'exit'; return; }
            else if (selectInherit === 'sell') { sell(); return; }
            let id = items[selectInherit];
            try {
                if (entity.rawInv[0].includes(id) === true) {
                    if (player.silver < id.value) {
                        console.log(`\n> You can't afford the ${id.name} right now.`);
                    } else {
                        loseItem(entity, id);
                        entity.silver += id.value;
                        player.silver -= id.value;
                        gainItem(player, id);
                    }
                }
            } catch(err) {}
        } while (selectInherit !== 'exit' || selectInherit !== 'sell');
    }

    function sell() {
        let selectOffload = "";
        do {
            console.log(displayInventory(entity));
            console.log(displayInventory(player));
            selectOffload = readline.question(`\n> Type an item to sell or type 'buy' or 'exit.'\n>> `).split('').filter(letter => letter !== ' ').join('').toLowerCase();
            if (selectOffload === 'exit') { selectTransfer = 'exit'; return; }
            else if (selectOffload === 'buy') { buy(); return; }
            let id = items[selectOffload];
            try {
                if (player.rawInv[0].includes(id) === true) {
                    if (entity.silver < id.value) {
                        console.log(`\n> ${entity.name} can't afford the ${id.name} right now.`);
                    } else {
                        loseItem(player, id);
                        player.silver += id.value;
                        entity.silver -= id.value;
                        gainItem(entity, id);
                    }
                } 
            } catch(err) {}
        } while (selectOffload !== 'exit' || selectOffload !== 'buy');
    }
}

function rummage(entity) {
    let selectTransfer = "";
    do {
        selectTransfer = readline.question(`> Would you like to 'loot' ${entity.name}, 'store' your belongings, or 'exit?'\n>> `).toLowerCase();
        if (selectTransfer === "loot") { loot() }
        else if (selectTransfer === "store") { store() }
        else if (selectTransfer === "exit") { return }
    } while (selectTransfer !== "exit");

    function loot() {
        let selectInherit = "";
        do {
            console.log(displayInventory(entity));
            console.log(displayInventory(player));
            selectInherit = readline.question(`\n> Type an item to loot or 'all,' or type 'store' or 'exit.'\n>> `).split('').filter(letter => letter !== ' ').join('').toLowerCase();
            if (selectInherit === 'exit') { selectTransfer = 'exit'; return; }
            else if (selectInherit === 'store') { store(); return; }
            else if ( selectInherit === 'all') {
                gainAll(entity, player);
            }
            else if (selectInherit === "silver") {
                player.silver += Number(entity.silver);
                entity.silver = 0;
            } else {
                let id = items[selectInherit];
                try {
                    if (entity.rawInv[0].includes(id) === true) {
                        loseItem(entity, id);
                        gainItem(player, id);
                    }
                } catch(err) {}
            }
        } while (selectInherit !== 'exit' || selectInherit !== 'store');
    }

    function store() {
        let selectOffload = "";
        do {
            console.log(displayInventory(entity));
            console.log(displayInventory(player));
            selectOffload = readline.question(`\n> Type an item to store or type 'loot' or 'exit.'\n>> `).split('').filter(letter => letter !== ' ').join('').toLowerCase();
            if (selectOffload === 'exit') { selectTransfer = 'exit'; return; }
            else if (selectOffload === 'loot') { loot(); return; }
            else if (selectOffload === 'silver') {
                let howMuch = readline.question(`> How much?\n>> `);
                if (typeof Number(howMuch) === "number" && howMuch <= player.silver && howMuch >= 0) {
                    player.silver -= Number(howMuch);
                    entity.silver += Number(howMuch);
                } else if (typeof Number(howMuch) === "number" && howMuch > player.silver) {
                    entity.silver += Number(player.silver);
                    player.silver = 0;
                } else if (howMuch === "all" || howMuch === "total" || howMuch === "everything") {
                    entity.silver += Number(player.silver);
                    player.silver = 0;
                }
            } else {
                let id = items[selectOffload];
                try {
                    if (player.rawInv[0].includes(id) === true) {
                        loseItem(player, id);
                        gainItem(entity, id);
                    }
                } catch(err) {}
            }
        } while (selectOffload !== 'exit' || selectOffload !== 'loot');
    }
}

function gearUp() {
    let selectTransfer = "";
    do {
        selectTransfer = readline.question(`  Would you like to 'equip' or 'unequip' your gear, or 'exit?'\n>> `).toLowerCase();
        if (selectTransfer === "equip") { equip() }
        else if (selectTransfer === "unequip") { unequip() }
        else if (selectTransfer === "exit") { return }
    } while (selectTransfer !== "exit");

    function equip() {
       let selectInherit = "";
        do {

            console.log(`
${player.name.toUpperCase()}'S GEAR
Equipped: [${weaponFactor(player)} damage] ${player.rawInv[1].filter(item => (item.category === 0)).map(item => `${item.name} (${item.damage}dmg)`).join(", ")} ||  [${armorFactor(player)} armor] ${player.rawInv[1].filter(item => (item.category === 1)).map(item => `${item.name} (${item.dt}dt)`).join(", ")}
Weapons: ${player.rawInv[0].filter(item => (item.category === 0)).map(item => `${item.name} (${item.damage}dmg)`).sort().join(", ")}
Garments: ${player.rawInv[0].filter(item => (item.category === 1)).map(item => `${item.name} (${item.dt}dt)`).sort().join(", ")}`);

            selectInherit = readline.question(`\n> Type an item to equip or type 'unequip' or 'exit.'\n>> `).split('').filter(letter => letter !== ' ').join('').toLowerCase();
            if (selectInherit === 'exit') { selectTransfer = 'exit'; return; }
            else if (selectInherit === 'unequip') { unequip(); return; }
            else {
                let id = items[selectInherit];
                try {
                    function checkHand() {
                        let sum = id.hand;
                        let scan = player.rawInv[1].filter(item => (item.category === 0));
                        scan.forEach(item => { sum += item.hand });
                        return sum;
                    }
                    if (player.rawInv[0].includes(id) === true) {
                        if (id.category === 0 && checkHand() > 2) {
                            if (checkHand() === 3) {
                                let onlyWeapons = player.rawInv[1].filter((item) => item.category === 0);
                                let overEquipped = onlyWeapons[onlyWeapons.length - 1];
                                player.rawInv[0].push(overEquipped);
                                player.rawInv[1].splice(overEquipped, 1);
                            } else if (checkHand() === 4) {
                                let onlyWeapons = player.rawInv[1].filter((item) => item.category === 0);
                                player.rawInv[0].push(onlyWeapons[0], onlyWeapons[1]);
                                player.rawInv[1] = player.rawInv[1].filter((item) => (item.category === 1));
                            }
                        } else if (id.category === 1) {
                            for (let i = 0; i < player.rawInv[1].length; i++) {
                                if (id.piece === player.rawInv[1][i].piece) {
                                    player.rawInv[0].push(player.rawInv[1][i]);
                                    player.rawInv[1].splice(player.rawInv[1].indexOf(i), 1);
                                }
                            }
                        }

                        player.rawInv[1].unshift(id);
                        player.rawInv[0].splice(player.rawInv[0].indexOf(id), 1);

                        armorFactor(player);
                    weaponFactor(player);
                    }
                } catch(err) {}
            }
        } while (selectInherit !== 'exit' || selectInherit !== 'unequip');
    }

    function unequip() {
       let selectInherit = "";
        do {
                    console.log(`
${player.name.toUpperCase()}'S GEAR
Equipped: [${weaponFactor(player)} damage] ${player.rawInv[1].filter(item => (item.category === 0)).map(item => `${item.name} (${item.damage}dmg)`).join(", ")} ||  [${armorFactor(player)} armor] ${player.rawInv[1].filter(item => (item.category === 1)).map(item => `${item.name} (${item.dt}dt)`).join(", ")}
Weapons: ${player.rawInv[0].filter(item => (item.category === 0)).map(item => `${item.name} (${item.damage}dmg)`).sort().join(", ")}
Garments: ${player.rawInv[0].filter(item => (item.category === 1)).map(item => `${item.name} (${item.dt}dt)`).sort().join(", ")}`
            );
            selectInherit = readline.question(`\n> Type an item to unequip or type 'equip' or 'exit.'\n>> `).split('').filter(letter => letter !== ' ').join('').toLowerCase();
            if (selectInherit === 'exit') { selectTransfer = 'exit'; return; }
            else if (selectInherit === 'equip') { equip(); return; }
            else {
                let id = items[selectInherit];
                try {
                    if (player.rawInv[1].includes(id) === true) {
                        player.rawInv[0].unshift(id);
                        player.rawInv[1].splice(player.rawInv[1].indexOf(id), 1);
                        armorFactor(player);
                        weaponFactor(player);
                    }
                } catch(err) {}
            }
        } while (selectInherit !== 'exit' || selectInherit !== 'equip');
    }
}

module.exports = {Container, caveKnapsack, homeChest, displayInventory, gainItem, loseItem, gainAll, loseAll, barter, rummage, gearUp}