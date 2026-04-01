// Mini Mario Web Pro – Versión profesional (simplificada)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const levelSpan = document.getElementById("level");
const scoreSpan = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let gameRunning = false;
const gravity = 0.7;
let currentLevel = 0, score = 0;
const keys = {};

const player = { x:50, y:350, width:40, height:50, dx:0, dy:0, speed:4, jumping:false, frame:0 };

// Niveles
const levels=[
    {
        platforms:[{x:0,y:400,width:800,height:50},{x:150,y:300,width:100,height:20},{x:350,y:250,width:120,height:20},{x:550,y:200,width:100,height:20}],
        enemies:[{x:200,y:370,width:30,height:30,dx:2}],
        coins:[{x:160,y:270},{x:360,y:220},{x:560,y:170}],
        goal:{x:700,y:150,width:50,height:50,color:"#FFD700"}
    },
    {
        platforms:[{x:0,y:400,width:800,height:50},{x:100,y:320,width:100,height:20},{x:250,y:260,width:100,height:20},{x:400,y:200,width:100,height:20},{x:600,y:150,width:100,height:20}],
        enemies:[{x:150,y:290,width:30,height:30,dx:1.8},{x:450,y:170,width:30,height:30,dx:2}],
        coins:[{x:110,y:290},{x:260,y:230},{x:610,y:120}],
        goal:{x:700,y:100,width:50,height:50,color:"#FFD700"}
    }
];

let platforms=[], enemies=[], coins=[], goal={};

// Controles
document.addEventListener("keydown", e=>keys[e.key]=true);
document.addEventListener("keyup", e=>keys[e.key]=false);

// Botones
startBtn.onclick=()=>{ gameRunning=true; startBtn.style.display='none'; restartBtn.style.display='inline'; loadLevel(currentLevel); update(); };
restartBtn.onclick=()=>{ score=0; currentLevel=0; loadLevel(currentLevel); gameRunning=true; };

// Cargar nivel
function loadLevel(n){
    if(n>=levels.length){ alert("🎉 Completaste todos los niveles!"); currentLevel=0; score=0; }
    const lvl = levels[currentLevel];
    platforms=JSON.parse(JSON.stringify(lvl.platforms));
    enemies=JSON.parse(JSON.stringify(lvl.enemies));
    coins=JSON.parse(JSON.stringify(lvl.coins));
    goal=lvl.goal;
    player.x=50; player.y=350; player.dx=0; player.dy=0; player.jumping=false; player.frame=0;
    levelSpan.innerText=currentLevel+1;
    scoreSpan.innerText=score;
}

function resetLevel(){ player.x=50; player.y=350; player.dx=0; player.dy=0; player.jumping=false; }

function update(){
    if(!gameRunning) return;
    player.dx=0;
    if(keys["ArrowRight"]) player.dx=player.speed;
    else if(keys["ArrowLeft"]) player.dx=-player.speed;
    if(keys["ArrowUp"] && !player.jumping){ player.dy=-12; player.jumping=true; }

    player.dy+=gravity;
    player.x+=player.dx;
    player.y+=player.dy;

    player.jumping=true;
    for(let plat of platforms){
        if(player.x<plat.x+plat.width && player.x+player.width>plat.x &&
           player.y+player.height<plat.y+player.dy+5 && player.y+player.height>plat.y){
            player.y=plat.y-player.height;
            player.dy=0;
            player.jumping=false;
        }
    }

    if(player.y+player.height>canvas.height){ resetLevel(); }
    if(player.x<0) player.x=0;
    if(player.x+player.width>canvas.width) player.x=canvas.width-player.width;

    for(let e of enemies){
        e.x+=e.dx;
        if(e.x<0||e.x+e.width>canvas.width) e.dx*=-1;
        if(player.x<e.x+e.width && player.x+player.width>e.x &&
           player.y<e.y+e.height && player.y+player.height>e.y){ resetLevel(); }
    }

    coins=coins.filter(c=>{
        if(player.x<c.x+20 && player.x+player.width>c.x &&
           player.y<c.y+20 && player.y+player.height>c.y){ score+=10; scoreSpan.innerText=score; return false; }
        return true;
    });

    if(player.x+player.width>goal.x && player.x<goal.x+goal.width &&
       player.y+player.height>goal.y && player.y<goal.y+goal.height){
        currentLevel++;
        loadLevel(currentLevel);
    }

    draw();
    requestAnimationFrame(update);
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#87CEEB"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#FFFFFF";
    for(let i=0;i<5;i++){ ctx.fillRect((i*150+Date.now()*0.02)%canvas.width,50+i*30,60,20); }

    for(let plat of platforms){ ctx.fillStyle="#654321"; ctx.fillRect(plat.x,plat.y,plat.width,plat.height); }
    ctx.fillStyle=goal.color; ctx.fillRect(goal.x,goal.y,goal.width,goal.height);
    for(let c of coins){ ctx.fillStyle="#FFD700"; ctx.fillRect(c.x,c.y,20,20); }
    for(let e of enemies){ ctx.fillStyle="#FF0000"; ctx.fillRect(e.x,e.y,e.width,e.height); }

    ctx.fillStyle="#00FF00"; ctx.fillRect(player.x,player.y,player.width,player.height);
}
