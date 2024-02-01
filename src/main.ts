import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
const ctx = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const width = canvas.width;
const height = canvas.height;
window.addEventListener("load", e => {
  showModal(e);
})
window.addEventListener("resize", function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})
const TILE_SIZE = 15;
const TILES_X = width / TILE_SIZE;
const TILES_Y = height / TILE_SIZE;
ctx.fillStyle = "rgb(0, 0, 153)";
ctx.strokeStyle = "rgb(220, 220, 220)";
ctx.lineWidth = 1;

const drawBorders = () => {
  //Vertikale Linien
    for(let i=0;i<TILES_X;i++) {
        ctx.beginPath();
        ctx.moveTo(i * TILE_SIZE - 0, 0);
        ctx.lineTo(i * TILE_SIZE - 0, height);
        ctx.stroke();
    }
  //Horizontale Linien
  for(let j=0;j<TILES_Y;j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * TILE_SIZE - 0);
        ctx.lineTo(width, j * TILE_SIZE - 0);
        ctx.stroke();
    }
}


const prepareBoard = (): boolean[][] => {
  const board = [];
  
  for(let i=0;i<TILES_X;i++) {
      const row = [];
      for(let j=0;j<TILES_Y;j++) {
          row.push(false);
      }
      board.push(row);
  }
  return board;
}

var BOARD = prepareBoard();
let isGamePaused = false;
let gameSpeed = 1010;
let xpos = 0;
let ypos = 0;
let xpos1 = 0;
let ypos1 = 0;
var modalFlag = false;

const isAlive = (x: number, y: number): number => {
  if (x < 0 || x >= TILES_X || y < 0 || y >= TILES_Y) {
      return 0;
  }
  return BOARD[x][y] ? 1 : 0;
}
const neighboursCount = (x: number, y: number): number => {
  let count = 0;
  for(let i of [-1, 0, 1]) {
      for(let j of [-1, 0, 1]) {
          if (!(i === 0 && j === 0)) {
              count += isAlive(x+i, y+j);
          }
      }
  }
  return count;
}

const drawBoard = () => {
  for(let i=0;i<TILES_X;i++) {
      for(let j=0;j<TILES_Y;j++) {
          if (!isAlive(i, j)) {
              continue;
          }
          ctx.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
  }
}

const computeNextGeneration = () => {
  const board = prepareBoard();
  for(let i=0;i<TILES_X;i++) {
      for(let j=0;j<TILES_Y;j++) {
          if (!isAlive(i, j)) {
            //Zelle wird geboren
              if (neighboursCount(i, j) === 3) {
                  board[i][j] = true;
              }
          } else {
            const count = neighboursCount(i, j);
            //Zelle überlebt
              if (count == 2 || count == 3) {
                  board[i][j] = true;
              } 
            
          }
      }
  }
  return board;
}
const clearAll = () => {
  ctx.clearRect(0, 0, width, height);
}
const drawAll = () => {
  clearAll();
  drawBoard();
  drawBorders();
}
const nextGen = () => {
  if (isGamePaused) {
      return;
  }
  BOARD = computeNextGeneration();
  drawAll();
}

const nextGenLoop = () => {
  nextGen();
  setTimeout(nextGenLoop, gameSpeed)
 
}

const generateGame = () => {
  nextGenLoop();
  drawBoard();
  drawBorders();
}
const makeGlider = (x: number, y: number): void => {
  BOARD[x][y] = true;
  BOARD[x+1][y+1] = true;
  BOARD[x-1][y+2] = true;
  BOARD[x][y+2] = true;
  BOARD[x+1][y+2] = true;
  drawAll();
}

const makeNoah = (x: number, y: number): void => {
  BOARD[x][y] = true;
  BOARD[x-1][y+1] = true;
  BOARD[x][y+2] = true;
  BOARD[x+2][y] = true;
  BOARD[x+3][y+2] = true;
  BOARD[x+4][y+3] = true;
  BOARD[x+3][y+3] = true;
  BOARD[x+2][y+3] = true;
  drawAll();
}

const makeExplosion = (x: number, y: number): void => {
  BOARD[x][y] = true;
  BOARD[x+1][y] = true;
  BOARD[x+2][y] = true;
  BOARD[x][y+1] = true;
  BOARD[x][y+2] = true;
  BOARD[x+2][y+1] = true;
  BOARD[x+2][y+2] = true;
  BOARD[x][y+4] = true;
  BOARD[x][y+5] = true;
  BOARD[x][y+6] = true;
  BOARD[x+1][y+6] = true;
  BOARD[x+2][y+6] = true;
  BOARD[x+2][y+4] = true;
  BOARD[x+2][y+5] = true;
  drawAll();
}
const makeNoah2 = (x: number, y: number): void => {
  BOARD[x][y] = true;
  BOARD[x+1][y] = true;
  BOARD[x][y+1] = true;
  BOARD[x][y+2] = true;
  BOARD[x-1][y+1] = true;
  drawAll();
}
let MalModus = true;
let MausGedruckt = false;

const getPositionFromEvent = (e:MouseEvent) => {
  const x = Math.floor(((e.clientX - canvas.offsetLeft) / TILE_SIZE)+ 0.5);
  const y = Math.floor(((e.clientY - canvas.offsetTop) / TILE_SIZE) + 0.5);
  
  xpos = x;
  ypos = y;
  console.log(xpos)
  console.log(ypos);
  return [x, y];

}


canvas.addEventListener("mousedown", (e) => {
  MausGedruckt = true;
    const [x, y] = getPositionFromEvent(e);
    MalModus = !BOARD[x][y];
    BOARD[x][y] = MalModus;
    drawAll();
});

canvas.addEventListener("mousemove", e => {
    if (!MausGedruckt) {
        return;
    }
    const [x, y] = getPositionFromEvent(e);
    BOARD[x][y] = MalModus;
    drawAll();
});


canvas.addEventListener("mouseup", () => {
  MausGedruckt = false;
});


document.addEventListener("keydown", knopf => {
  //Pausieren
  if (knopf.key === 'p') {
      isGamePaused = !isGamePaused;
  //SChneller
  } else if (knopf.key === "+") {
      gameSpeed = Math.max(10, gameSpeed - 50);
  //Langsamer
  } else if (knopf.key === '-') {
      gameSpeed = Math.min(2020, gameSpeed + 50);
  } else if (knopf.key === 'c') {
    BOARD = prepareBoard();
    drawAll();
  } else if(knopf.key === 'g'){
    
    if(modalFlag){
      showModal(knopf);
    } else {
      console.log("bin da") 
      let x = document.querySelector('.overlay')!;
      document.body.removeChild(x);
    }
    modalFlag = !modalFlag;
    
  } else if (knopf.key === 'ArrowRight') {
    xpos1 = Math.max(0, xpos1 + 1);
    BOARD[xpos1][ypos1] = true
  } else if (knopf.key === 'ArrowLeft') {
    xpos1 = Math.max(0, xpos1 - 1);
    BOARD[xpos1][ypos1] = true
  } else if (knopf.key === 'ArrowUp') {
    ypos1 = Math.max(0, ypos1 - 1);
    BOARD[xpos1][ypos1] = true
  } else if (knopf.key === 'ArrowDown') {
    ypos1 = Math.max(0, ypos1 + 1);
    BOARD[xpos1][ypos1] = true
  }
  drawAll();
  console.log(xpos1);
  console.log(ypos1);

});

//var modal: HTMLElement;
//var overlay: HTMLElement;
//var body = document.querySelector('body');

function showModal(e:any) {
  var overlay = document.createElement('div');
  overlay.innerHTML = "<h1> ㅤP: Pause   <p> ㅤC: Clear</p>   <p> ㅤ+/-: Faster/Slower</p>  <p> ㅤG: Verstecke/Zeige dieses Fenster</p>  <p> ㅤMuster: </p> </h1> <button id = 'g1'> Gleiter </button>  <button id = 'n1'> Kolonie </button> <button id = 'n2'> Kolonie 2 </button></button> <button id = 'e1'> Explosion </button>"; 
  overlay.classList.add('overlay');
  //var modal = document.querySelector('.modal')!;

  e.preventDefault();
  //modal.classList.add('is-active');
  document.body.appendChild(overlay);
  let glider1 = document.querySelector<HTMLButtonElement>('#g1')!;
  glider1.addEventListener('click', () => makeGlider(xpos, ypos))
  let noah = document.querySelector<HTMLButtonElement>('#n1')!;
  noah.addEventListener('click', () => makeNoah(xpos, ypos))
  let noah2 = document.querySelector<HTMLButtonElement>('#n2')!;
  noah2.addEventListener('click', () => makeNoah2(xpos, ypos))
  let explosion = document.querySelector<HTMLButtonElement>('#e1')!;
  explosion.addEventListener('click', () => makeExplosion(xpos, ypos))
}

generateGame();


