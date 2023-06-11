const board = document.querySelector('.board');
const startLife = document.querySelector('.gui .startLife');
const clearBoard = document.querySelector('.gui .clearBoard');
const stopButton = document.querySelector('.gui .stopButton');
const epochsCounter = document.querySelector('.gui .epochsCounter');
const numberOfEpochs = document.querySelector('.gui .numberOfEpochs');

const dimensions = 46;

epochs = 0;

symulatioOn = false;

var interval;

boardStatus = [];
numberOfNeighbours = [];

window.onload = () => {
    for(var i = 0; i < dimensions; i++){
        tmpRow = [];
        tmpRow2 = [];
        for(var j = 0; j < dimensions; j++){
            board.innerHTML += `<div class="tile ${j} ${i}"></div>`;
            tmpRow.push(0);
            tmpRow2.push(0);
        }
        boardStatus.push(tmpRow);
        numberOfNeighbours.push(tmpRow2);
    }

    const tiles = document.querySelectorAll('.board .tile');

    tiles.forEach(tile => {
        tile.style.background = "black";
        tile.addEventListener('click', e => {
            if(!symulatioOn){
                var x = parseInt(e.target.className.split(' ')[1]);
                var y = parseInt(e.target.className.split(' ')[2]);
                if(e.target.style.background === "black"){
                    e.target.style.background = "rgb(0, 150, 140)";
                    boardStatus[x][y] = 1;
                }
                else if(e.target.style.background === "rgb(0, 150, 140)"){
                    e.target.style.background = "black";
                    boardStatus[x][y] = 0;
                }
            }
        })
    })
}

function checkIfAllDead() {
    aliveCounter = 0
    for(var y = 0; y < dimensions; y++){
        for(var x = 0; x < dimensions; x++){
            if(boardStatus[x][y] === 1){
                aliveCounter++;
            }
        }
    }
    return (aliveCounter === 0);
}

startLife.addEventListener('click', () => {
    if(!checkIfAllDead()){
        if(numberOfEpochs.value === ""){
            epochs = -1;
        }

        var i = 0;
        interval = setInterval(e => {
            startLife.disabled = true;
            clearBoard.disabled = true;
            numberOfEpochs.disabled = true;
            stopButton.disabled = false;
            symulatioOn = true;
            if(i == (epochs-1) || checkIfAllDead()){
                clearInterval(interval);
                startLife.disabled = false;
                clearBoard.disabled = false;
                numberOfEpochs.disabled = false;
                stopButton.disabled = true;
                symulatioOn = false;
                if(checkIfAllDead()){i--};
            }
            countAllNeighbours();
            tmpBoardStatus = fateOfCells();
            if(are2ListTheSame(tmpBoardStatus, boardStatus)){
                clearInterval(interval);
                startLife.disabled = false;
                clearBoard.disabled = false;
                numberOfEpochs.disabled = false;
                stopButton.disabled = true;
                symulatioOn = false;
                epochsCounter.innerHTML = "Epoch: " + i;
            }   
            boardStatus = tmpBoardStatus;
            updateCells();
            i++
            epochsCounter.innerHTML = "Epoch: " + i;
        }, 100);
    }
})

function are2ListTheSame(x, y) {
    for(var i = 0; i < x.length; i++){
        for(var j = 0; j < x.length; j++){
            if(x[i][j] !== y[i][j]){
                return false;
            }
        }
    }
    return true;
}

clearBoard.addEventListener('click', () => {
    const tiles = document.querySelectorAll('.board .tile');

    for(var y = 0; y < dimensions; y++){
        for(var x = 0; x < dimensions; x++){
            tiles[x + y*dimensions].style.background = "black";
            boardStatus[x][y] = 0;
        }
    }
    epochsCounter.innerHTML = "Epoch: 0";
    numberOfEpochs.value = "";
})

stopButton.addEventListener('click', () => {
    clearInterval(interval);
    startLife.disabled = false;
    clearBoard.disabled = false;
    numberOfEpochs.disabled = false;
    stopButton.disabled = true;
    symulatioOn = false;
})

function updateCells() {
    const tiles = document.querySelectorAll('.board .tile');

    for(var y = 0; y < dimensions; y++){
        for(var x = 0; x < dimensions; x++){
            if(boardStatus[x][y] === 1){
                tiles[x + y*dimensions].style.background = "rgb(0, 150, 140)";
            }
            else if(boardStatus[x][y] === 0){
                tiles[x + y*dimensions].style.background = "black";
            }
        }
    }
}

function fateOfCells() {
    nextBoard = [];
    for(var y = 0; y < dimensions; y++){
        tmpRow = [];
        for(var x = 0; x < dimensions; x++){
            tmpRow.push(0);
        }
        nextBoard.push(tmpRow);
    }

    for(var y = 0; y < dimensions; y++){
        for(var x = 0; x < dimensions; x++){
            nextBoard[x][y] = fateOfCell(x, y);
        }
    }
    return nextBoard;
}

function fateOfCell(x, y){
    if(boardStatus[x][y] === 1){
        if(numberOfNeighbours[x][y] < 2){return 0}
        else if(numberOfNeighbours[x][y] > 3){return 0}
        else{return boardStatus[x][y]}
    }
    else if(boardStatus[x][y] === 0 && numberOfNeighbours[x][y] === 3){
        return 1;
    }
    else{return boardStatus[x][y]}
}

function countAllNeighbours(){
    for(var y = 0; y < dimensions; y++){
        for(var x = 0; x < dimensions; x++){
            numberOfNeighbours[x][y] = countNeighbours(x, y);
        }
    }
}

function countNeighbours(x, y) {
    counter = 0;
    if(x === 0){
        if(boardStatus[x][y + 1] === 1){counter++};
        if(boardStatus[x + 1][y + 1] === 1){counter++};

        if(boardStatus[x + 1][y] === 1){counter++};

        if(boardStatus[x][y - 1] === 1){counter++};
        if(boardStatus[x + 1][y - 1] === 1){counter++};
    }
    else if(x === (dimensions - 1)){
        if(boardStatus[x - 1][y + 1] === 1){counter++};
        if(boardStatus[x][y + 1] === 1){counter++};

        if(boardStatus[x - 1][y] === 1){counter++};

        if(boardStatus[x - 1][y - 1] === 1){counter++};
        if(boardStatus[x][y - 1] === 1){counter++};
    }
    else{
        if(boardStatus[x - 1][y + 1] === 1){counter++};
        if(boardStatus[x + 1][y + 1] === 1){counter++};
        if(boardStatus[x][y + 1] === 1){counter++};
        
        if(boardStatus[x + 1][y] === 1){counter++};
        if(boardStatus[x - 1][y] === 1){counter++};

        if(boardStatus[x][y - 1] === 1){counter++};
        if(boardStatus[x - 1][y - 1] === 1){counter++};
        if(boardStatus[x + 1][y - 1] === 1){counter++};
    }
    return counter;
}

numberOfEpochs.addEventListener('input', () => {
    if(numberOfEpochs.value === "0" || !["0","1","2","3","4","5","6","7","8","9"].includes(numberOfEpochs.value.slice(-1))){
        numberOfEpochs.value = numberOfEpochs.value.slice(0, -1);
    }
    else{
        epochs = numberOfEpochs.value;
    }
})