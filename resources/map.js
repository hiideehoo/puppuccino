const readline = require('readline-sync');
const {Misc, Weapon, Garment, items} = require('./items.js');
const {Container, caveKnapsack, homeChest, displayInventory, gainItem, loseItem, gainAll, loseAll, barter, rummage, gearUp} = require('./inventory.js');
const {Entity, armorFactor, weaponFactor, playerName, player, pup} = require('./npc.js');

// LOCATIONS

class Location {
    constructor(name, coords, explore) {
        this.name = name
        this.coords = coords
        this.explore = explore
    }
}

const locations = {
    "home": new Location("Home", [0, 0], findHome),
    "cave": new Location("Cave", [0, 1], findCave)
}

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

    
    let enter = "n";
    do {
        enter = readline.question(`\n> You find your way back home.\n  Do you wish to enter? (y/n)\n>> `).toLowerCase();
        if (enter === "y") {
            console.log(`\n> You return home from your adventure.\n  Puppuccino is there to greet you at the counter.\n \n "[PUPPUCCINO] Hilo, friendo!\n  I got a treat or two if you wanna trade.\n  I'm also good for a chat :3"`);
            let exploreStage1 = false;

            do {

                let choose = {
                    "a": new Choice(a1, `Trade with Puppuccino.`),
                    "b": new Choice(b1, `Have a fireside chat.`),
                    "c": new Choice(c1, `Lodge in your room.`),
                    "z": new Choice(z1, `Meander some more.`)
                }
                arrange = ["a", "b", "c", "z"]

                displayChoices(choose);
                exploreStage1 = readline.question(`\n>> `)
                let exploreFunction = choose[`${arrange[exploreStage1 - 1]}`]
                if (0 < exploreStage1 && exploreStage1 <= arrange.length) { exploreFunction.act(); }
                else { console.log(`\n> You ponder for a moment.`); }
                if (arrange[exploreStage1 - 1] === "z") { return; }
            } while (exploreStage1 !== false);
        } else if (enter === "n") { return; }
        else { console.log(`> You ponder for a moment.`); }
    } while (enter !== "n");

    function a1() { console.log(`\n "[PUPPUCCINO] Let's see what we got."\n`); barter(pup); return; }
    function b1() { console.log(`\n "[PUPPUCCINO] What's new with you?"`); return; }
    function c1() { 

        console.log(`\n> The confines of your room put you at ease.`);
        let rested = false;
        let exploreStage2 = "n"
        do {

            choose = {
                'a': new Choice(a2, `Switch your gear.`),
                "b": new Choice(b2, `Look in the mirror.`),
                'c': new Choice(c2, `Stash your belongings.`),
                'd': new Choice(d2, `Rest in your bed.`),
                'z': new Choice(z2, `Go back.`)
            }
            arrange = ['a', 'b', 'c', "d", 'z']

            displayChoices(choose);
            exploreStage2 = readline.question(`\n>> `)
            let exploreFunction = choose[`${arrange[exploreStage2 - 1]}`]
            if (0 < exploreStage2 && exploreStage2 <= arrange.length) { exploreFunction.act(); }
            else { console.log(`\n> You ponder for a moment.`); }
            if (arrange[exploreStage2 - 1] === "z") { return; }
        } while (exploreStage2 !== false);

        function c2() { rummage(homeChest); return; }
        function b2() {
                    let compliment = ["hotstuff", "beautiful", 'gorgeous', 'handsome', 'sexy', 'cutie', 'Adonis'];
                    let greeting = compliment[Math.floor(Math.random()*compliment.length)];
                    console.log(`\n> Hey ${greeting}.`);
        }
        function a2() { gearUp(); return; }
        function d2() { rested = true; return console.log(`\nYou enjoy a good night's rest.`); }
        function z2() { 
            exploreStage2 = false; 
            let commonTask = ["cleaning crystalline goblets", "doing taxes", "adopting and naming dust bunnies as he sweeps", "stoking the fire", "polishing the gruesome weaponry on display", "cooking puppy chow", "watching cable news"]
            let activeTask = commonTask[Math.floor(Math.random()*commonTask.length)];
            console.log(`\n> Puppuccino's still around, ${activeTask}.`); 
            if(rested === true) {console.log(`\n "[PUPPUCCINO] Good morning, sunshine!"`);} 
            else {console.log(`\n "[PUPPUCCINO] How's it hanging?"`);} 
            return; 
        }

    }
    function z1() { console.log(`\n> You head outside for another adventure.`); exploreStage1 = false; enter = "n"; return; }

}

function findCave() {

    let choose = {
        "a": new Choice(a, `Check the knapsack.`),
        "b": new Choice(b, `Jump down the sinkhole.`),
        "z": new Choice(z, `Leave.`)
    }
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

    function a() { rummage(caveKnapsack); return; }
    function b() { console.log(`\n> You fall to your death. Obviously.\n`); theEnd = true; return; }
    function z() { console.log(`\n> You hit the dusty trail! Good riddance to that deathtrap.`); explore = false; enter = "n"; return; }

}

// TRAVEL FUNCTIONS

function travel() {

    let playerLocation = "";
    playerMove = false;
    console.log(`\n> Type a direction to travel or type 'stay.'`);

    
        if (player.rawInv.includes(items['compass']) === true) {
            statusCompass = true;
            console.log(`  Type 'compass' to check coordinates.`);
        } else { statusCompass = false }
    


    
        if (player.rawInv.includes(items['map']) === true) {
            statusMap = true;
            console.log(`  Type 'map' to fast travel to discovered locations.`);
        } else { statusMap = false; }
    

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