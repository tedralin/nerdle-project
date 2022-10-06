import {Equations} from "./equations.js";
const board = document.querySelector(".board");

// instead of repeating entries in html, build the board from js
const initBoard = () => {
    let boardGrid = "";
    for (let i = 0; i < 6; i++) {
        boardGrid += "<div class='board__row'>";

        for (let j = 0; j < 8; j++) {
            if (i === 0) {
                boardGrid += "<input class='board__row__box' maxlength='1'> </input>";
            } else {
                boardGrid += "<input class='board__row__box' maxlength='1' disabled> </input>";
            }
        }
        boardGrid += "</div"
    }
    board.innerHTML = boardGrid;
}

// Filling up a row in the board
// listen to all valid characters for the equation

const validEqtnVarArray = document.querySelectorAll("button");
const errorLine = document.getElementById("error-line__text");
const equationKeys = document.getElementsByClassName("equationChar");
const newGameButton = document.getElementById("newgame--button")
const boardRowBoxes = document.getElementsByClassName("board__row__box");

let mysteryEqtnArray = Equations[Math.floor(Math.random() * Equations.length)].split("");
console.log(`Mystery Equation = ${mysteryEqtnArray}`)

let row = 0;
let col = 0;
let isEndGame = false;
const buttonColorArray = [];

const buildButtonColorArray = ()  => {
    let buttonObject = {};

    for (let i=0; i < equationKeys.length; i++) {
        buttonObject = {};
        buttonObject.buttonValue = equationKeys[i].innerHTML;
        buttonObject.buttonIndex = i;
        buttonObject.color = "";
        buttonColorArray.push(buttonObject);
    }
}

const setUpNextRow = () => {
    const boardStart = row*8;

    // disable previous row
    for (let i=0; i < 8; i++) {
        boardRowBoxes[boardStart+i].disabled = true;
    }

    //enable next row
    for (let i=8; i < 16; i++) {
        boardRowBoxes[boardStart+i].disabled = false;
    }
    row ++;
    col = 0;

    boardRowBoxes[row*8].focus();
}

const insertButtonValueinGrid = (buttonValue) => {
    // console.log(`insertButtonValue of ${buttonValue} in row ${row} and col ${col}`)
    const boardIndex = 8 * row + col;
    boardRowBoxes[boardIndex].value = buttonValue;  
}    

const clearButtonValueinGrid = () => {
    // console.log(`insertButtonValue of ${buttonValue} in row ${row} and col ${col}`)
    let colToClear = 8 * row + col;

    //if I am at the end of equation and it has a value, clear the last box
    //if I am at the end of equation and it has no value, clear the previous box
    //Otherwise, clear the previous box

    // if (col < 7 ||  boardRowBoxes[colToClear].value === "") {
    if (boardRowBoxes[colToClear].value === "") {        
        colToClear = colToClear - 1
    } 
    boardRowBoxes[colToClear].value = "";
    boardRowBoxes[colToClear].focus();
    // return the column cleared
    return colToClear%8;
}    

const setBoardBoxColors = (eqtnArray, matchedArray) => {
    const boardRowStart = 8 * row;
    let isFullyMatched = true;

    for (let i = 0; i < matchedArray.length; i++) {
        boardRowBoxes[boardRowStart+i].classList.add(matchedArray[i])
        if (matchedArray[i] !== "green") {
            isFullyMatched = false;
        }
    }
    // change color also in the button keys
    buttonColorArray.forEach(button => {
        for (let i=0; i < eqtnArray.length; i++) {
            if (eqtnArray[i] === button.buttonValue) {
                // hierarchy of colors: green, gray, yellow
                if (button.color !== "green") {
                    button.color = matchedArray[i]
                    equationKeys[button.buttonIndex].classList.add(button.color)
                }
                // console.log(`button key ${button.buttonValue} classList=${ equationKeys[button.buttonIndex].classList}`)
            }
        }
    });
    return isFullyMatched;
}

const calculateNumbers = (num1, num2, oper) => {
    // console.log(`Calculate num1 = ${num1};num2 = ${num2} with Oper = ${oper}` )
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
    // console.log(`NumberArray: ${numberArr} and Operands: ${operArr}`)
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
        equationArr.push(boardRowBoxes[boardStart+i].value)
    }
   return equationArr;
}

const validateEquation = (eqtnArray) => {
    const validOperands = ["+", "-", "*", "/"];

    if (eqtnArray.length !== 8) {
        return "Your guess is not complete.  Please fill in all boxes in the row."
    }
    if (validOperands.includes(eqtnArray[0])) {
        return "Please provide a number in the first box"
    }
        
    const eqtnVariables = eqtnArray.join("").split("=");
    if (eqtnVariables.length !== 2) {
        return "Equation should have exactly 1 equal (=) char"
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
        if (eqtnArray[i] === mysteryEqtnArray[i]) {
            matchArray.push("green");
        } else if (!mysteryEqtnArray.includes(eqtnArray[i])) {
            matchArray.push("gray");
            unmatchedArray.push(mysteryEqtnArray[i]);
        } else {
            matchArray.push("yellow");
            unmatchedArray.push(mysteryEqtnArray[i]);
        }
    }

    // yellow can turn to gray if it was already matched to a green
    // or if it is already matched to an earlier yellow

    for (let i=0; i < matchArray.length; i++) {
        if (matchArray[i] === "yellow") {
            if (!unmatchedArray.includes(eqtnArray[i])) {
                matchArray[i] = "gray";
            } else {
                //remove it from unmatchedArray by changing its value to P (partial)
                for (let j=0; j < unmatchedArray.length; j++) {
                    if (eqtnArray[i] === unmatchedArray[j]) {
                        unmatchedArray[j] = "P";
                        j = 10;
                    }
                }
            }
        }
    }

    console.log(`Mystery Equation: ${mysteryEqtnArray}`)
    console.log(`Input Equation: ${eqtnArray}`)
    console.log(`Match Array: ${matchArray}`)
    console.log(`Unmatched Array: ${unmatchedArray}`)
    return matchArray;
}


const validateAndMatchRow = () => {
    const eqtnArray = getEquationfromCurrentRow();
    const eqtnError = validateEquation(eqtnArray);
    if (eqtnError === "") {
        const matchedArray = matchEqtnValues(eqtnArray);
        if (setBoardBoxColors(eqtnArray, matchedArray)) {
            errorLine.innerHTML = "Congratulations! You guessed the equation"
        } else {
            setUpNextRow();            
        }
    } else {
        errorLine.innerHTML = eqtnError;
    }
    if (row === 6) {
        errorLine.innerHTML = "Sorry, you have reached your maximum number of guesses."
    }
}

const removeColorsfromButton = () => {
    for (let i = 0; i < equationKeys.length; i++) {
        equationKeys[i].classList.remove("green");
        equationKeys[i].classList.remove("yellow");
        equationKeys[i].classList.remove("gray");
    }
}

const resetBoard = () => {
    for (let i=0; i < boardRowBoxes.length; i++) {
        boardRowBoxes[i].value = "";
        boardRowBoxes[i].classList.remove("green");
        boardRowBoxes[i].classList.remove("yellow");
        boardRowBoxes[i].classList.remove("gray");

        if (i < 8) {
            boardRowBoxes[i].disabled = false;
        } else {
            boardRowBoxes[i].disabled = true;
        }
    }
};
    

const initializeNewGame = () => {
    initBoard();
    buildButtonColorArray();
}

const resetGame = () => {
    resetBoard();
    for (let i=0; i < buttonColorArray.length; i++) {
        buttonColorArray[i].color = "";
    }
    removeColorsfromButton();
    boardRowBoxes[0].focus();
    row=0;
    col=0;
    errorLine.innerHTML ="";
    mysteryEqtnArray = Equations[Math.floor(Math.random() * Equations.length)].split("");
    console.log(`Mystery Equation = ${mysteryEqtnArray}`)
}

// Main Section

// Initialization of the board and the ButtonColor Arrays
initializeNewGame();


// Listening to the press of each button key
validEqtnVarArray.forEach((button) => {
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
            col = clearButtonValueinGrid()
        }
        if (button.innerHTML === "Enter") {
            validateAndMatchRow();
        }
    })
}
)

//Listening for inputs for each BoardRowBox
Array.from(boardRowBoxes).forEach((box, index) => {
    box.addEventListener("input", (event) => {
        const validEqtnChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", "=" ];
        const validInFirstBox = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
        event.preventDefault();

        row = Math.floor(index/8)
        col = index%8;
        // console.log(`Index = ${index}; row=${row}; col = ${col}`)

        // if value entered is invalid, clear value; else move focus to next
        if ((col===0 && !validInFirstBox.includes(box.value)) || (col !==0 && !validEqtnChars.includes(box.value))) {
            box.value = "";
        } else {
            if (col < 7) {
                boardRowBoxes[index+1].focus();
                col++;
            }
        }
    })

    // if Mousedown is pressed, set current col
    box.addEventListener("mousedown", (event) => {
        if (!box.disabled) {
            row = Math.floor(index/8)
            col = index%8;
        }
    })

    // if Backspace is pressed
    box.addEventListener("keydown", (event) => {
        if (event.key === "Backspace") {
            event.preventDefault();    
            col = clearButtonValueinGrid();
        }
    })

    // Trigger Enter Button click if enter is pressed
    box.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();    
            validateAndMatchRow();
        }
    })
})

newGameButton.addEventListener("click", (event) => {
    resetGame();
})
