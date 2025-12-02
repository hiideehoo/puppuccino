const readline = require('readline-sync');

// LOCATIONS

class Location {
    constructor(name, coords, explore) {
        this.name = name
        this.coords = coords
        this.explore = explore
    }
}

const locations = {}
locations["home"] = new Location("Home", [0, 0], findHome);
locations["cave"] = new Location("Cave", [0, 1], findCave);

let xAxis = 0;
let yAxis = 0;
let theEnd = false;
let rawDiscoveredMap = ["Home"];
let rawFullMap = [locations["home"], locations["cave"]];
let playerMove = false;
let statusCompass = 0;
let statusMap = 0;

let arrange = [];
function displayChoices(choose) {
    console.log(`\n> What do you do?`)
    for (let i = 0; i < arrange.length; i++) {
        console.log(`  [${i + 1}] ${choose[arrange[i]].display}`);
    }
}
class Choice {
        constructor(act, display) {
            this.act = act
            this.display = display
        }
}

function findHome() {

    let choose = {}
    choose["a"] = new Choice(a, `Trade with Puppuccino.`);
    choose["b"] = new Choice(b, `Have a fireside chat.`);
    choose["c"] = new Choice(c, `Lodge in your room.`);
    choose["z"] = new Choice(z, `Meander some more.`); 
    arrange = ["a", "b", "c", "z"]

    let enter = "n";
    do {
        enter = readline.question(`\n> You find your way back home.\n  Do you wish to enter? (y/n)\n>> `).toLowerCase();
        if (enter === "y") {
            console.log(`\n> You return home from your adventure.\n  Puppuccino is there to greet you at the counter.\n \n "[PUPPUCCINO] Hilo, friendo!\n  I got a treat or two if you wanna trade.\n  I'm also good for a chat :3"`);
            let explore = false;
            do {
                displayChoices(choose);
                explore = readline.question(`\n>> `)
                let exploreFunction = choose[`${arrange[explore - 1]}`]
                if (0 < explore && explore <= arrange.length) { exploreFunction.act(); }
                else { console.log(`\n> You ponder for a moment.`); }
                if (arrange[explore - 1] === "z") { return; }
            } while (explore !== false);
        } else if (enter === "n") { return; }
        else { console.log(`> You ponder for a moment.`); }
    } while (enter !== "n");

    function a() { console.log(`\n "[PUPPUCCINO] Let's see what we got."\n`); barter(pup); return; }
    function b() { console.log(`\n "[PUPPUCCINO] What's new with you?"`); return; }
    function c() { console.log(`\n> You pop a squat and take a load off in your room.`); container(homeChest); return; }
    function z() { console.log(`\n> You head outside for another adventure.`); explore = false; enter = "n"; return; }

}

function findCave() {

    let choose = {}
    choose["a"] = new Choice(a, `Check the knapsack.`);
    choose["b"] = new Choice(b, `Jump down the sinkhole.`);
    choose["z"] = new Choice(z, `Leave.`);
    arrange = ["a", "b", "z"];

    if (rawDiscoveredMap.includes("Cave") === false) { rawDiscoveredMap.push(locations["cave"].name); }
    let enter = "n";
    do {
        enter = readline.question(`\n> You find a spooky cave.\n  Do you wish to enter? (y/n)\n>> `).toLowerCase();
        if (enter === "y") {
            console.log(`\n> You enter the cave.\n  To the left is a dusty old knapsack.\n  On your right is a bottomless(?) sinkhole.`);
            let explore = false;
            do {
                displayChoices(choose);
                explore = readline.question(`\n>> `)
                let exploreFunction = choose[`${arrange[explore - 1]}`]
                if (0 < explore && explore <= arrange.length) { exploreFunction.act(); } 
                else { console.log(`\n> You ponder for a moment.`); }
                if (arrange[explore - 1] === "b" || arrange[explore - 1] === "z") { return; }
            } while (explore !== false);
        } else if (enter === "n") { return; }
        else { console.log(`> You ponder for a moment.`); }
    } while (enter !== "n");

    function a() { container(caveKnapsack); return; }
    function b() { console.log(`\n> You fall to your death. Obviously.\n`); theEnd = true; return; }
    function z() { console.log(`\n> You hit the dusty trail! Good riddance to that deathtrap.`); explore = false; enter = "n"; return; }

}

// ITEM CATALOGUE

class Item {
    constructor(name, value, category) {
        this.name = name;
        this.value = value;
        this.category = category;
    }
}

class Weapon extends Item {
    constructor(name, value, category, damage) {
        super(name, value, category);
        this.damage = damage;
    }
}

const items = {}
items['sword'] = new Weapon("sword", 500, "weapon", 5);
items['diamond'] = new Item("diamond", 10000, "gem");
items['emerald'] = new Item("emerald", 5000, "gem");
items['napkin'] = new Item("napkin", 1, "cloth");
items['compass'] = new Item("compass", 100, "tool");
items['map'] = new Item("map", 100, "tool");

// INVENTORY

class Entity {
    constructor(name, silver, rawInv) {
        this.name = name,
            this.silver = silver,
            this.rawInv = rawInv;
    }
}

let player = new Entity("", 0, [[], [], [items['napkin']]]);
player.name = readline.question(`> What is your name?\n>> `);

let pup = new Entity("Puppuccino", 501, [[], [], [items['compass'], items['map']]]);

let caveKnapsack = new Entity("the Dusty Ol' Knapsack", 7, [[items["sword"]], [], []]);
let homeChest = new Entity(`${player.name}'s chest`, 0, [[], [], []]);

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
                if (typeof howMuch === "number" && howMuch <= player.silver) {
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

// TRAVEL FUNCTIONS

function travel() {

    let playerLocation = "";
    playerMove = false;
    console.log(`\n> Type a direction to travel or type 'stay.'`);

    for (let i = 0; i < player.rawInv.length; i++) {
        if (player.rawInv[i].includes(items['compass']) === true) {
            statusCompass = true;
            console.log(`  Type 'compass' to check coordinates.`);
        } else { statusCompass = false }
    };


    for (let i = 0; i < player.rawInv.length; i++) {
        if (player.rawInv[i].includes(items['map']) === true) {
            statusMap = true;
            console.log(`  Type 'map' to fast travel to discovered locations.`);
        } else { statusMap = false; }
    };

    let playerTraverse = readline.question(`>> `).toLowerCase();
    if (playerTraverse === "north" || playerTraverse === "up") { playerMove = true; yAxis++; }
    else if (playerTraverse === "south" || playerTraverse === "down") { playerMove = true; yAxis--; }
    else if (playerTraverse === "west" || playerTraverse === "left") { playerMove = true; xAxis--; }
    else if (playerTraverse === "east" || playerTraverse === "right") { playerMove = true; xAxis++; }
    else if (playerTraverse === "stay") { playerMove = true; }

    else if (playerTraverse === "compass") {
        if (statusCompass === true) {
            playerLocation = `(${xAxis}, ${yAxis})`;
            for (let i = 0; i < rawDiscoveredMap.length; i++) {
                const marked = locations[rawDiscoveredMap[i].toLowerCase()]; 
                if (playerLocation === `(${marked.coords[0]}, ${marked.coords[1]})`) { console.log(`\n> Location: ${marked.name}\n  Coordinates: ${playerLocation}`); }
            }
        } else { console.log(`> You don't have a compass.`); }
    }

    else if (playerTraverse === "map") {
        if (statusMap === true) {
            console.log(`\n> ${rawDiscoveredMap.sort().join(`\n  `)}`);
            let fastTravel = readline.question(`\n> Type a location to travel to or type 'return.'\n>> `).toLowerCase();
            if (fastTravel === "return") { return; }
            for (let i = 0; i < rawDiscoveredMap.length; i++) {
                if (rawDiscoveredMap[i].toLowerCase() === fastTravel) {
                    playerMove = true;
                    xAxis = locations[fastTravel].coords[0];
                    yAxis = locations[fastTravel].coords[1];
                    playerLocation = `(${xAxis}, ${yAxis})`;
                    for (let i = 0; i < rawDiscoveredMap.length; i++) { 
                        const marked = locations[rawDiscoveredMap[i].toLowerCase()]; 
                        if (playerLocation === `(${marked.coords[0]}, ${marked.coords[1]})` && playerMove === true) { marked.explore(); } 
                    }
                    return;
                }
            }
        } else console.log(`> You don't have a map.`);
    }
    else { console.log(`> You rest for a moment.`); }
    if (yAxis > 5) { yAxis = 5; console.log(`> You've traveled too far. Turn back!`); }
    if (xAxis > 5) { xAxis = 5; console.log(`> You've traveled too far. Turn back!`); }
    if (yAxis < -5) { yAxis = -5; console.log(`> You've traveled too far. Turn back!`); }
    if (xAxis < -5) { xAxis = -5; console.log(`> You've traveled too far. Turn back!`); }
    playerLocation = `(${xAxis}, ${yAxis})`;

    for (let i = 0; i < rawFullMap.length; i++) { 
        const found = rawFullMap[i]; 
        if (playerLocation === `(${found.coords[0]}, ${found.coords[1]})` && playerMove === true) { found.explore(); } 
    }
}

do { travel(); } while (theEnd !== true);

// attributes??