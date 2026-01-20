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

module.exports = {Item, Weapon, items}