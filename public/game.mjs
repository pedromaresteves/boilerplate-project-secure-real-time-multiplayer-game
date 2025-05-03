import Player from './Player.mjs';
import {Collectible} from './Collectible.mjs';
const mainCat = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffreepngimg.com%2Fthumb%2Flove%2F88346-anger-brown-pusheen-carnivoran-cat-free-transparent-image-hd.png&f=1&nofb=1&ipt=9f7ae9e0b2b5987a3e02e9f9e20f8474c60d959a65dd91000ed5fc9756878919";
const foeSprite = "https://png.pngtree.com/png-clipart/20230308/ourmid/pngtree-cartoon-dog-puppy-sticker-cute-png-image_6629416.png";
const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

let clientId, foes = [], mainCharacter, biscuit;

const clearCanvas = ()=>{
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '30px Arial';
    context.fillStyle = 'white';
    context.fillText(`Rank: ${mainCharacter ? mainCharacter.calculateRank(foes) : "-"}/${foes.length ? foes.length+1 : "-"}` , 25, 25);
    context.fillText(`Points: ${mainCharacter && mainCharacter.points ? mainCharacter.points : 0}` , 250, 25);
    if(biscuit) drawBiscuit();
};

const createFoes = (players)=>{
    foes = [];
    players.forEach(player => {
        if(player.id !== clientId){
                foes.push(new Player({x: player.position.x, y:player.position.y, id:player.id, imageHref: foeSprite}));
        }
    });
};

const removePlayer = (playerID)=>{
    foes = foes.filter(foe => {
        return playerID !== foe.id
    });
    clearCanvas();
    drawCharacter(mainCharacter)
    foes.forEach(foe => drawCharacter(foe));
};

const drawBiscuit = ()=>{
    if(biscuit.spriteLoaded) {
        context.drawImage(biscuit.sprite, biscuit.position.x, biscuit.position.y, biscuit.size.w, biscuit.size.h);
    } else {
        biscuit.sprite.onload = () => {
            biscuit.spriteLoaded = true;
            context.drawImage(biscuit.sprite, biscuit.position.x, biscuit.position.y, biscuit.size.w, biscuit.size.h);
        };
    }
};

const createBiscuit = (biscuitPosition)=>{
    biscuit = null;
    biscuit = new Collectible(biscuitPosition);
    drawBiscuit();
};

const createMainCharacter = () => {
    const x = getRandomInt(50, canvas.width -50);
    const y = getRandomInt(50,  canvas.height-50);
    if(!mainCharacter){
        mainCharacter = new Player({x: x, y:y, id: null, imageHref: mainCat});
    }
    drawCharacter(mainCharacter);
};

const drawCharacter = (char)=>{
    if(char && char.spriteLoaded) {
        context.drawImage(char.sprite, char.position.x, char.position.y, char.size.w, char.size.h);
    } else {
        char.sprite.onload = () => {
            char.spriteLoaded = true;
            context.drawImage(char.sprite, char.position.x, char.position.y, char.size.w, char.size.h);
        };
    }
};

clearCanvas();
createMainCharacter();

socket.on("client_id", (id)=>{
    clientId = id;
    mainCharacter.id = clientId
    socket.emit("created_player", mainCharacter);
});

socket.on("buiscuit_position", biscuitPosition=>{
    createBiscuit(biscuitPosition);
});

socket.on("new_players", players=>{
    createFoes(players);
    foes.forEach(foe => drawCharacter(foe));
});

socket.on("all_players", players=>{
    players.forEach(item => {
        foes.forEach(foe => {     
            if(foe.id === item.id){
                foe.position = item.position;
                foe.points = item.points;
            }
        });
    })
    clearCanvas();
    drawCharacter(mainCharacter);
    foes.forEach(foe => drawCharacter(foe));
});

socket.on('player_left', playerID => {
    removePlayer(playerID);
    foes.forEach(foe => drawCharacter(foe));
});

const animate = (event) => {
    mainCharacter.movePlayer(event.key, 15, canvas);
    if(mainCharacter.collision(biscuit)){
        biscuit = null;
        socket.emit("update_score", mainCharacter);
    }
    clearCanvas();
    drawCharacter(mainCharacter);
    foes.forEach(foe => drawCharacter(foe));
    socket.emit('player_moved', mainCharacter);
}

window.addEventListener('keydown', (event) => {
    animate(event)
});



function getRandomInt(min, max) {
// Ensure min and max are integers
min = Math.ceil(min);
max = Math.floor(max);
// Generate a random integer between min and max
return Math.floor(Math.random() * (max - min + 1)) + min;
}