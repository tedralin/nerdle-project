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
const equationKeys = document.getElementsByClassName("equationChar");
const boardRowBox = document.getElementsByClassName("board__row__box");

const mysteryEqtnArr = Equations[Math.floor(Math.random() * Equations.length)].split("");
console.log (mysteryEqtnArr);

let row = 0;
let col = 0;
const buttonColorArray = [];

const buildButtonColorArray = ()  => {
    let buttonObject = {};
    for (let i=0; i < equationKeys.length; i++) {
        buttonObject.buttonValue = equationKeys[i].innerHTML;
        buttonObject.buttonIndex = i;
        buttonObject.color = "";
        console.log(buttonObject);
        buttonColorArray.push(buttonObject);
        console.log(buttonColorArray.length);
    }
}

buildButtonColorArray();
console.log(buttonColorArray)


// const keyColorArray = equationKeys.map((keyButton, index) => {
//     return {
//         buttonValue: keyButton.innerHTML,
//         buttonIndex: index,
//         color: ""
//     }
// })



const insertButtonValueinGrid = (buttonValue) => {
    // console.log(`insertButtonValue of ${buttonValue} in row ${row} and col ${col}`)
    const boardIndex = 8 * row + col;
    boardRowBox[boardIndex].value = buttonValue;
    
}    

const setBoardBoxColors = (eqtnArray, matchedArray) => {
    const boardRowStart = 8 * row;
    console.log(matchedArray)
    for (let i = 0; i < matchedArray.length; i++) {
        boardRowBox[boardRowStart+i].classList.add(matchedArray[i])
    }

    // change color also in the button keys
    keyColorArray.forEach(button => {
        for (let i=0; i < eqtnArray.length; i++) {
            if (eqtnArray[i] === button.buttonValue) {
                if (!(button.color === "green" || button.color === "gray")) {
                    button.color = matchedArray(i)
                    equationKeys[button.buttonIndex].classList.add(button.color)
                }

            }
        }
        
    });

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
    console.log(numberArr)
    console.log(operArr)
    let subTotal = 0;
    if (numberArr.length === 3 && ["*", "/"].includes(operArr[1])) {
        subTotal = calculateNumbers (numberArr[1], numberArr[2], operArr[1]);
        if (Number.isInteger(subTotal)) {
            subTotal = calculateNumbers (numberArr[0], subTotal.toString(), operArr[0]);
        }
    } else {
        subTotal = calculateNumbers (numberArr[0], numberArr[1], operArr[0]);
        if (Number.isInteger(subTotal) && numberArr.length === 3) {
            subTotal = calculateNumbers (subTotal.toString(), numberArr[2], operArr[1]);
        }
    }

    // subTotal is an Integer if statement is correct, otherwise, equation is invalid
    return subTotal;
}

const getEquationfromCurrentRow = () => {
    const boardStart = 8 * row;
    const equationArr = [];

    // get the equation from the document
    for (let i = 0; i < 8; i++) {
        equationArr.push(boardRowBox[boardStart+i].value)
    }
   return equationArr;
}

const validateEquation = (eqtnArray) => {
    const validOperands = ["+", "-", "*", "/"];
    console.log(eqtnArray);
    if (validOperands.includes(eqtnArray[0])) {
        return "Please provide a number in the first box"
    }
        
    const eqtnVariables = eqtnArray.join("").split("=");
    if (eqtnVariables.length !== 2) {
        return "Equation should have exactly 1 equals char"
    }
    const eqtnVarChars = eqtnVariables[0].split("");
    const numberArr = [];
    const operArr = [];
    let numStr = "";
    
    eqtnVarChars.forEach((eqtnChar) => {
        if (validOperands.includes(eqtnChar)) {
            numberArr.push (numStr);
            operArr.push(eqtnChar);
            numStr = "";
        } else {
            numStr += eqtnChar
        }
    })
    numberArr.push (numStr);

    const calcTotal =  calculateInputTotal(numberArr, operArr);
    if (Number.isInteger(calcTotal)) {
        if (calcTotal == eqtnVariables[1]) {
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

const matchEqtnValues = (eqtnArray) => {
    //compare each char between mystery equation and player's guess
    const matchArray = [];
    const unmatchedArray = [];  // this contains all other chars in mysteryeqtn that are unmatched
    for (let i=0; i < eqtnArray.length; i++) {
        if (eqtnArray[i] === mysteryEqtnArr[i]) {
            matchArray.push("green");
        } else if (!mysteryEqtnArr.includes(eqtnArray[i])) {
            matchArray.push("gray");
            unmatchedArray.push(mysteryEqtnArr[i]);
        } else {
            matchArray.push("yellow");
            unmatchedArray.push(mysteryEqtnArr[i]);
        }
    }

    // yellow can turn to gray if it was already matched to a green

    for (let i=0; i < matchArray.length; i++) {
        if (matchArray[i] === "yellow" && !unmatchedArray.includes(eqtnArray[i])) {
            matchArray[i] = "gray";
        }
    }

    console.log(`Mystery Equation: ${mysteryEqtnArr}`)
    console.log(`Input Equation: ${eqtnArray}`)
    console.log(`Match Array: ${matchArray}`)
    console.log(`Unmatched Array: ${unmatchedArray}`)

    return matchArray;
}

validEqtnVarArr.forEach((button) => {
    const validEqtnChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", "=" ];
    button.addEventListener("click", (event) => {
        event.preventDefault();
        if (validEqtnChars.includes(button.innerHTML)) {
            insertButtonValueinGrid(button.innerHTML);
            if (col < 7) {
                col++;
            };
        }
        if (button.innerHTML === "Delete") {
            col = col - 1;
            insertButtonValueinGrid("")
        }
        if (button.innerHTML === "Enter") {
            if (col === 7) {
                const eqtnArray = getEquationfromCurrentRow();
                const eqtnError = validateEquation(eqtnArray);
                if (eqtnError === "") {
                    const matchedArray = matchEqtnValues(eqtnArray);
                    setBoardBoxColors(eqtnArray, matchedArray);
                    row ++;
                    col = 0;
                } else {
                    errorLine.innerHTML = eqtnError;
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