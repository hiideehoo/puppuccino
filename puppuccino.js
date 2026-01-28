const readline = require('readline-sync');
const {Misc, Weapon, Garment, items} = require('./resources/items.js');
const {Entity, armorFactor, weaponFactor, playerName, player, pup} = require('./resources/npc.js');
const {Container, caveKnapsack, homeChest, displayInventory, gainItem, loseItem, gainAll, loseAll, barter, rummage, gearUp} = require('./resources/inventory.js');
const {Location, locations, xAxis, yAxis, theEnd, rawDiscoveredMap, rawFullMap, playerMove, statusCompass, statusMap, arrange, Choice, findHome, findCave, travel, gameLoop} = require('./resources/map.js');

playerName();

gameLoop();