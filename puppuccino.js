const readline = require('readline-sync');
const {Item, Weapon, items} = require('./resources/items.js');
const {Entity, player, pup} = require('./resources/npc.js');
const {Container, caveKnapsack, homeChest, displayInventory, gainItem, loseItem, barter, container} = require('./resources/inventory.js');
const {Location, locations, xAxis, yAxis, theEnd, rawDiscoveredMap, rawFullMap, playerMove, statusCompass, statusMap, arrange, Choice, findHome, findCave, travel, gameLoop} = require('./resources/map.js');

player.name = readline.question(`> What is your name?\n>> `);

gameLoop();