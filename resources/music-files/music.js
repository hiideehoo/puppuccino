const sounds = require('play-sound')(opts = {});

class Music {
    constructor(name, time) {
        this.name = name
        this.time = time
    }
}

const music = {}
music["minecraft.m4a"] = new Music("minecraft.m4a", 176000);
music["skyrim.m4a"] = new Music("skyrim.m4a", 43000);
music["spongebob.m4a"] = new Music("spongebob.m4a", 55000);
music["fnaf.m4a"] = new Music("fnaf.m4a", 114000);

let roomSong = "";
function playSong(arr) {
    let roomPlaylist = arr;
    let roomSelectSong = "";
    function repeatPlaylist() {
        roomSelectSong = roomPlaylist[Math.floor(Math.random() * roomPlaylist.length)].name;
        roomSong = sounds.play(roomSelectSong, function (err) { if (err && !err.killed) throw err });
        for (let i = 0; i < roomPlaylist.length; i++) {
            roomPlaylist.splice(roomPlaylist.indexOf(music[roomSelectSong]), 1);
        }
    }
    repeatPlaylist();
    setTimeout(repeatPlaylist, music[roomSelectSong].time + 8000);
}

playSong([music["minecraft.m4a"], music["skyrim.m4a"], music["spongebob.m4a"], music["fnaf.m4a"]]);

roomSong.kill();