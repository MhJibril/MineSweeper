const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
let lockGame = false;
let score = 0;

generateGrid();

document.getElementById("resetGame").addEventListener("click", generateGrid);

function generateGrid() {
    lockGame = false;
    score = 0;
    updateScore();
    grid.innerHTML = "";

    for (let i = 0; i < 10; i++) {
        const row = grid.insertRow(i);
        for (let j = 0; j < 10; j++) {
            const cell = row.insertCell(j);
            cell.onclick = () => cellClick(cell);
            cell.setAttribute("mine", "false");
        }
    }

    let minesPlaced = 0;
    while (minesPlaced < 10) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const cell = grid.rows[row].cells[col];
        if (cell.getAttribute("mine") === "false") {
            cell.setAttribute("mine", "true");
            minesPlaced++;
        }
    }
}

function cellClick(cell) {
    if (lockGame || cell.classList.contains("revealed")) return;

    if (cell.getAttribute("mine") === "true") {
        revealMines();
        lockGame = true;
        alert("Kena bom! Skor akhir kamu: " + score);
    } else {
        revealSafeCell(cell);
        checkWin();
    }
}

function revealSafeCell(cell) {
    if (cell.classList.contains("revealed")) return;

    cell.classList.add("revealed");
    score++;
    updateScore();

    const { row, col } = getCellPosition(cell);
    const mineCount = countMinesAround(row, col);
    cell.innerText = mineCount > 0 ? mineCount : "";

    if (mineCount === 0) {
        floodFill(row, col);
    }
}

function countMinesAround(row, col) {
    let count = 0;
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (isInsideGrid(i, j) && grid.rows[i].cells[j].getAttribute("mine") === "true") {
                count++;
            }
        }
    }
    return count;
}

function floodFill(row, col) {
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (isInsideGrid(i, j)) {
                const neighbor = grid.rows[i].cells[j];
                if (!neighbor.classList.contains("revealed") && neighbor.getAttribute("mine") === "false") {
                    revealSafeCell(neighbor);
                }
            }
        }
    }
}

function revealMines() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = grid.rows[i].cells[j];
            if (cell.getAttribute("mine") === "true") {
                cell.classList.add("mine");
                cell.innerText = "💣";
            }
        }
    }
}

function checkWin() {
    const safeCells = 100 - 10;
    if (score === safeCells) {
        lockGame = true;
        alert("Selamat! Kamu menang dengan skor " + score);
    }
}

function isInsideGrid(row, col) {
    return row >= 0 && row < 10 && col >= 0 && col < 10;
}

function getCellPosition(cell) {
    return {
        row: cell.parentNode.rowIndex,
        col: cell.cellIndex
    };
}

function updateScore() {
    scoreDisplay.innerText = score;
}
