const board = document.querySelector(".board");

// instead of repeating entries in html, build the board from js
const initBoard = () => {
    let boardGrid = "";
    for (let i = 0; i < 6; i++) {
        boardGrid += "<div class='board__row'>";

        for (let j = 0; j < 8; j++) {
            boardGrid += "<input class='board__row__box' maxlength='1'> </input>";
        }
        boardGrid += "</div"
    }
    board.innerHTML = boardGrid;
}

initBoard();

// Filling up a row in the board
// listen to all valid characters for the equation

const validEqtnVar = document.getElementsByClassName("equationChar");
const errorLine = document.getElementById("error-text");

const insertButtonValueinGrid = (buttonValue) => {

}

validEqtnVar.forEach((button) => {
    const validEqtnChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", "=" ];
    let row = 0;
    let col = 0;
    const eqArr = [];
    button.addEventListener("click", () => {
        if (validEqtnChars.includes(button.innerHTML)) {
            eqArr = insertButtonValueinGrid(button.innerHTML, row, col);
            if (col <= 7) {col++;};
        }
        if (button.innerHTML === "Delete") {
            col --;
            eqArr = insertButtonValueinGrid("", row, col);
        }
        if (button.innerHTML === "Enter") {
            if (col === 7) {
                if (validateEquation(eqArr)) {
                    checkEqMatch();
                    row ++;
                } else {
                    errorLine.innerHTML = "Your guess is not a valid equation.  Please correct"                    
                }
            } else {
                errorLine.innerHTML = "Your guess is not complete.  Please fill in all boxes."
            }
        }
        if (row === 6) {
            errorLine.innerHTML = "You have reached your maximum number of guesses."
        }
    })
}
);

