// EXPLORE TEMPLATE

/*

function findLOCATION() {

    let choose = {
        "a" = new Choice(a, `STRING.`); // String displays console dialogue
        "b" = new Choice(b, `STRING.`);
        "z" = new Choice(z, `Return.`); 
    }
    arrange = ["a", "z"] // letter to order choices

    if (CONDITION === true) { arrange.push("b"); arrange.sort(); } // unlock new choices per conditions met

    if (rawDiscoveredMap.includes("LOCATION") === false) { rawDiscoveredMap.push(locations["LOCATION"].name); }
    let enter = "n";
    do {
        enter = readline.question(`\n> You find a LOCATION.\n  Do you wish to enter? (y/n)\n>> `).toLowerCase();
        if (enter === "y") {
            console.log(`\n> You enter...`);
            let explore = false;
            do {
                displayChoices(choose);
                explore = readline.question(`\n>> `)
                let exploreFunction = choose[`${arrange[explore - 1]}`]
                if (0 < explore && explore <= arrange.length) { exploreFunction.act(); }
                else { console.log(`\n> You ponder for a moment.`); }
                if (arrange[explore - 1] === "z") { return; } // choices that end exploration
            } while (explore !== false);
        } else if (enter === "n") { return; }
        else { console.log(`> You ponder for a moment.`); }
    } while (enter !== "n");

    function a() { return; }
    function b() { return; }
    function z() { console.log(`\n> You leave.`); explore = false; enter = "n"; return; }

}

findLOCATION();

*/

// EXPLORE EXAMPLE

/* 

function findCave() {

    let choose = {
        "a" = new Choice(a, `Check the knapsack.`);
        "b" = new Choice(b, `Jump down the sinkhole.`);
        "z" = new Choice(z, `Leave.`);
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

    function a() { container(caveKnapsack); return; }
    function b() { console.log(`\n> You fall to your death. Obviously.\n`); theEnd = true; return; }
    function z() { console.log(`\n> You hit the dusty trail! Good riddance to that deathtrap.`); explore = false; enter = "n"; return; }

}

*/