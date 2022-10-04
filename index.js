import {Equations} from "./equations.js";
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

const validEqtnVarArr = document.querySelectorAll("button");
const errorLine = document.getElementById("error-line__text");
const boardRow = document.getElementsByClassName("board__row");
const boardRowBox = document.getElementsByClassName("board__row__box");

const guessEquation = Equations[Math.floor(Math.random() * Equations.length)];
console.log (guessEquation);

let row = 0;
let col = 0;
const eqArr = [];


const insertButtonValueinGrid = (buttonValue) => {
    console.log(`insertButtonValue of ${buttonValue} in row ${row} and col ${col}`)
    const boardIndex = 8 * row + col;
    // boardRow[row].children[col].value = buttonValue;
    boardRowBox[boardIndex].value = buttonValue;
}    

const calculateNumbers = (num1, num2, oper) => {
    console.log(`Calculate num1 = ${num1};num2 = ${num2} with Oper = ${oper}` )
    const num1Val = Number(num1);
    const num2Val = Number(num2);
    let total = 0;
    switch (oper) {
        case "*":
             total = num1Val * num2Val;
             break;
        case "+":
            total = num1Val + num2Val;
            break;
        case "-":
            total = num1Val - num2Val;
            break;
        case "/":
            if (num2Val === 0) {
                return "Error: Equation has zero divisor.  Please correct"
            }
            total = num1Val / num2Val;
        }
    return total;
   
}

const calculateInputTotal = (numberArr, operArr) => {
    // the equation can have: min (2 numbers, 1 operand) & max(3 numbers, 2 operands)
    // if 3 numbers and +/- goes before *or/, calculate second set first
    let subTotal = 0;
    if (numberArr.length === 3 && ["*", "/"].includes(operArr[1])) {
        subTotal = calculateNumbers (numberArr[1], numberArr[2], operArr[1]);
        if (Number.isInteger(subTotal)) {
            subTotal = calculateNumbers (numberArr[0], subTotal.toString(), operArr[0]);
        }
    } else {
        subTotal = calculateNumbers (numberArr[0], numberArr[1], operArr[0]);
        if (Number.isInteger(subTotal)) {
            subTotal = calculateNumbers (subTotal.toString(), numberArr[2], operArr[1]);
        }
    }

    // subTotal is an Integer if statement is correct, otherwise, equation is invalid
    return subTotal;
}

const validateEquation = () => {
    const boardStart = 8 * row;
    const numberArr = [];
    const operArr = [];
    let inputTotal = "";
    let isTotal = false;
    let numStr = "";

    // get the equation from the document
    for (let i = 0; i < 8; i++) {
        const currentBoxVal = boardRowBox[boardStart+i].value;
        switch (currentBoxVal) {
            case "=":
            case "+":
            case "-":
            case "/":
            case "*":                
                if (i === 0) {
                    return "Please provide a number in the first box"
                }
                numberArr.push (numStr);
                if (currentBoxVal === "=") {
                    isTotal = true;
                } else {
                    operArr.push(currentBoxVal);
                    numStr = "";
                }
                break;
            default:
                if (isTotal) {
                    inputTotal += currentBoxVal
                } else {
                    numStr += currentBoxVal
                }
    }  
}

 const calcTotal =  calculateInputTotal(numberArr, operArr);
 if (Number.isInteger(calcTotal)) {
    if (calcTotal == inputTotal) {
        return "";
    } else {
        return "Invalid Equation. Note that equation should follow MDAS."
    }
 } else if (typeof calcTotal === "string") {
        return calcTotal;
    } else {
        return "Equation should have Integer for total"
    }
}

const matchEqtnValues = () => {

}

validEqtnVarArr.forEach((button) => {
   
    const validEqtnChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", "=" ];
    button.addEventListener("click", (event) => {
        event.preventDefault();
        if (validEqtnChars.includes(button.innerHTML)) {
            eqArr.push(insertButtonValueinGrid(button.innerHTML));
            if (col < 7) {
                col++;
            };
        }
        if (button.innerHTML === "Delete") {
            col = col - 1;
            eqArr.pop(insertButtonValueinGrid(""));
        }
        if (button.innerHTML === "Enter") {
            if (col === 7) {
                const eqtnErr = validateEquation(eqArr)
                if (eqtnErr === "") {
                    matchEqtnValues();
                    row ++;
                } else {
                    errorLine.innerHTML = eqtnErr;
                }
            } else {
                errorLine.innerHTML = "Your guess is not complete.  Please fill in all boxes in the row."
                         }
        }
        if (row === 6) {
            errorLine.innerHTML = "You have reached your maximum number of guesses."
        }
    })
}
)