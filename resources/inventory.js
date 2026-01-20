const readline = require('readline-sync');
const {Item, Weapon, items} = require('./items.js');
const {Entity, player, pup} = require('./npc.js');

// INVENTORY

class Container {
    constructor(name, silver, rawInv) {
        this.name = name,
            this.silver = silver,
            this.rawInv = rawInv;
    }
}

let caveKnapsack = new Container("the Dusty Ol' Knapsack", 7, [[items["sword"]], [], []]);
let homeChest = new Container(`${player.name}'s chest`, 0, [[], [], []]);

// TRADE FUNCTIONS

function displayInventory(entity) {
    return `\n${entity.name.toUpperCase()}'S INVENTORY
Silver: ₵${entity.silver}
Weapons: ${entity.rawInv[0].map(i => `${i.name} (${i.damage}dmg, ₵${i.value})`).sort().join(", ")}
Gems: ${entity.rawInv[1].map(i => `${i.name} (₵${i.value})`).sort().join(", ")}
Misc: ${entity.rawInv[2].map(i => `${i.name} (₵${i.value})`).sort().join(", ")}`;
}

function gainItem(entity, item) {
    if (item.category === "weapon") {
        entity.rawInv[0].push(item);
    } else if (item.category === "gem") {
        entity.rawInv[1].push(item);
    } else {
        entity.rawInv[2].push(item);
    }
}

function loseItem(entity, item) {
    for (let i = 0; i < entity.rawInv.length; i++) {
        if (entity.rawInv[i].includes(item) === true) {
            entity.rawInv[i].splice(entity.rawInv[i].indexOf(item), 1);
        }
    }
}

function barter(entity) {
    let selectTransfer = "";
    do {
        selectTransfer = readline.question(`> Would you like to buy, sell, or exit?\n>> `).toLowerCase();
        if (selectTransfer === "sell") { sell() }
        else if (selectTransfer === "buy") { buy() }
        else if (selectTransfer === "exit") { return }
    } while (selectTransfer !== "exit");

    function buy() {
        let selectPurchase = "";
        do {
            console.log(displayInventory(entity));
            console.log(displayInventory(player));
            selectPurchase = readline.question(`\n> Type an item to buy or type 'return.'\n>> `).toLowerCase();
            if (selectPurchase === 'return') { return };
            for (let i = 0; i < entity.rawInv.length; i++) {
                if (entity.rawInv[i].includes(items[selectPurchase]) === true) {
                    if (player.silver < items[selectPurchase].value) {
                        console.log(`\n> You can't afford the ${items[selectPurchase].name} right now.`);
                    } else {
                        loseItem(entity, items[selectPurchase]);
                        entity.silver += items[selectPurchase].value;
                        player.silver -= items[selectPurchase].value;
                        gainItem(player, items[selectPurchase]);
                    }
                }
            }
        } while (selectPurchase !== 'return');
    }

    function sell() {
        let selectOffload = "";
        do {
            console.log(displayInventory(entity));
            console.log(displayInventory(player));
            selectOffload = readline.question(`\n> Type an item to sell or type 'return.'\n>> `).toLowerCase();
            if (selectOffload === 'return') { return };
            for (let i = 0; i < player.rawInv.length; i++) {
                if (player.rawInv[i].includes(items[selectOffload]) === true) {
                    if (entity.silver < items[selectOffload].value) {
                        console.log(`\n> ${entity.name} can't afford the ${items[selectOffload].name} right now.`);
                    } else {
                        loseItem(player, items[selectOffload]);
                        player.silver += items[selectOffload].value;
                        entity.silver -= items[selectOffload].value;
                        gainItem(entity, items[selectOffload]);
                    }
                }
            }
        } while (selectOffload !== 'return');
    }
}

function container(entity) {
    let selectTransfer = "";
    do {
        selectTransfer = readline.question(`> Would you like to 'loot' ${entity.name}, 'store' your belongings, or 'exit?'\n>> `).toLowerCase();
        if (selectTransfer === "loot") { loot() }
        else if (selectTransfer === "store") { store() }
        else if (selectTransfer === "exit") { return }
    } while (selectTransfer !== "exit");

    function loot() {
        let selectPurchase = "";
        do {
            console.log(displayInventory(entity));
            console.log(displayInventory(player));
            selectPurchase = readline.question(`\n> Type an item to loot or type 'return.'\n>> `).toLowerCase();
            if (selectPurchase === 'return') { return }
            else if (selectPurchase === "silver") {
                player.silver += entity.silver;
                entity.silver -= entity.silver;
            }
            for (let i = 0; i < entity.rawInv.length; i++) {
                if (entity.rawInv[i].includes(items[selectPurchase]) === true) {
                    loseItem(entity, items[selectPurchase]);
                    gainItem(player, items[selectPurchase]);
                }
            }
        } while (selectPurchase !== 'return');
    }

    function store() {
        let selectOffload = "";
        do {
            console.log(displayInventory(entity));
            console.log(displayInventory(player));
            selectOffload = readline.question(`\n> Type an item to store or type 'return.'\n>> `).toLowerCase();
            if (selectOffload === 'return') { return }
            else if (selectOffload === 'silver') {
                let howMuch = Number(readline.question(`> How much?\n>> `));
                if (typeof howMuch === "number" && howMuch <= player.silver && howMuch >= 0) {
                    player.silver -= howMuch;
                    entity.silver += howMuch;
                } else if (typeof howMuch === "number" && howMuch > player.silver) {
                    entity.silver += player.silver;
                    player.silver = 0;
                }
            }
            for (let i = 0; i < player.rawInv.length; i++) {
                if (player.rawInv[i].includes(items[selectOffload]) === true) {
                    loseItem(player, items[selectOffload]);
                    gainItem(entity, items[selectOffload]);
                }
            }
        } while (selectOffload !== 'return');
    }
}

module.exports = {Item, Weapon, items, Container, caveKnapsack, homeChest, displayInventory, gainItem, loseItem, barter, container}