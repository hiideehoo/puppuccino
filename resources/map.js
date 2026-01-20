const readline = require('readline-sync');
const {Item, Weapon, items} = require('./items.js');
const {Container, caveKnapsack, homeChest, displayInventory, gainItem, loseItem, barter, container} = require('./inventory.js');
const {Entity, player, pup} = require('./npc.js');

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

function gameLoop() {
    do { travel(); } while (theEnd === false);
}

module.exports = {Location, locations, xAxis, yAxis, theEnd, rawDiscoveredMap, rawFullMap, playerMove, statusCompass, statusMap, arrange, Choice, findHome, findCave, travel, gameLoop};