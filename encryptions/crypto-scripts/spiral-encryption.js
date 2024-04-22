// Spiral Cipher
// Arrange the plaintext into a letter grid, then retrieve characters on a spiral

// Constants
const edgeIndexes = [[1, 1, 0, 0], [0, 0, 1, 1]];

// Local functions
function getSpiralIndexes(rows, columns, phase, clockwise) {
    // clockwise: urdl
    // counterclockwise: uldr

    // Variables
    let index = 0;
    let cellCount = rows * columns;
    let direction = (phase % 4 + 4) % 4;
    let deltaDirection = (clockwise) ? 1 : -1;
    let bounds = {
        X : [0, rows - 1],
        Y : [0, columns - 1],
    };
    let spiralIndexes = [];
    
    // Spiral
    while (index < cellCount) {
        let edgeIndex = edgeIndexes[(clockwise) ? 1 : 0][direction];
        let deltaEdge = (edgeIndex == 0) ? 1 : -1;
        let row, column;
        if (direction == 0) {
            /* Up */
            column = bounds.Y[edgeIndex];
            for (row = bounds.X[1]; row >= bounds.X[0]; row--) {
                spiralIndexes.push([row, column]);
                index++;
            }
            bounds.Y[edgeIndex] += deltaEdge;
        } else if (direction == 1) {
            /* Right */
            row = bounds.X[edgeIndex];
            for (column = bounds.Y[0]; column <= bounds.Y[1]; column++) {
                spiralIndexes.push([row, column]);
                index++;
            }
            bounds.X[edgeIndex] += deltaEdge;
        } else if (direction == 2) {
            /* Down */
            column = bounds.Y[edgeIndex];
            for (row = bounds.X[0]; row <= bounds.X[1]; row++) {
                spiralIndexes.push([row, column]);
                index++;
            }
            bounds.Y[edgeIndex] += deltaEdge;
        } else {
            /* Left */
            row = bounds.X[edgeIndex];
            for (column = bounds.Y[1]; column >= bounds.Y[0]; column--) {
                spiralIndexes.push([row, column]);
                index++;
            }
            bounds.X[edgeIndex] += deltaEdge;
        }
        direction += deltaDirection;
        direction = (direction % 4 + 4) % 4;
    }

    return spiralIndexes;
}

// Encryption functions
function spiralEncrypt(text, rows, columns, phase, clockwise) {
    /* Get spiral */

    // Create text grid
    let index = 0;
    let textGrid = [];
    for (let i = 0; i < rows; i++) {
        textGrid.push([]);
        for (let j = 0; j < columns; j++) {
            textGrid[i].push(text[index]);
            index++;
        }
    }
    
    // Spiral
    let spiralIndexes = getSpiralIndexes(rows, columns, phase, clockwise);
    let resultText = "";
    for (let [row, column] of spiralIndexes) {
        resultText += textGrid[row][column];
    }

    return resultText;
}

function spiralDecrypt(text, rows, columns, phase, clockwise) {
    /* Draw spiral text */

    // Create empty grid
    let index = 0;
    let resultGrid = [];
    for (let i = 0; i < rows; i++) {
        resultGrid.push([]);
        for (let j = 0; j < columns; j++) {
            resultGrid[i].push("_");
            index++;
        }
    }
    
    // Spiral
    let spiralIndexes = getSpiralIndexes(rows, columns, phase, clockwise);
    index = 0;
    for (let [row, column] of spiralIndexes) {
        resultGrid[row][column] = text[index];
        index++;
    }
    
    // Retrieve text
    let resultText = "";
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            resultText += resultGrid[i][j];
        }
    }

    return resultText;
}

function spiralEncryptFull(text, nodeInfo) {
    // Get variables
    let rows = parseInt(nodeInfo.rows);
    let columns = parseInt(nodeInfo.columns);
    let phase = parseInt(nodeInfo.phase);
    let clockwise = nodeInfo.clockwise;

    let repeatCount = parseInt(nodeInfo.repeatCount);

    // Validate rows and columns
    if (rows * columns != text.length) {
        let message = "Spiral grid size should match the text length!"
        message += "\n<O_O>";
        message += "\nThe input should be in one line."
        message += "\n" + (rows * columns).toString() + " ≠ " + text.length.toString();
        return {
            result : message,
            success : false,
        };
    }

    // Encrypt
    let resultText = text;
    for (let i = 0; i < repeatCount; i++) {
        resultText = spiralEncrypt(resultText, rows, columns, phase, clockwise);
    }

    // Return
    return {
        result : resultText,
        success : true,
    };
}

function spiralDecryptFull(text, nodeInfo) {
    // Get variables
    let rows = parseInt(nodeInfo.rows);
    let columns = parseInt(nodeInfo.columns);
    let phase = parseInt(nodeInfo.phase);
    let clockwise = nodeInfo.clockwise;
    
    let repeatCount = parseInt(nodeInfo.repeatCount);
    
    // Validate rows and columns
    if (rows * columns != text.length) {
        let message = "Spiral grid size should match the text length!"
        message += "\n<^.^>";
        message += "\nThe input should be in one line."
        message += "\n" + (rows * columns).toString() + " ≠ " + text.length.toString();
        return {
            result : message,
            success : false,
        };
    }
    
    // Encrypt
    let resultText = text;
    for (let i = 0; i < repeatCount; i++) {
        resultText = spiralDecrypt(resultText, rows, columns, phase, clockwise);
    }
    
    // Return
    return {
        result : resultText,
        success : true,
    };
}

function getSpiralEncryptNodeParameter() {
    return {
        rows : true,
        columns : true,
        phase : true,
        clockwise : true,
        repeatCount : true,
    };
}

function getSpiralDecryptNodeParameter() {
    return {
        rows : true,
        columns : true,
        phase : true,
        clockwise : true,
        repeatCount : true,
    };
}

// Function module
let functionModule = {};

functionModule.encrypt = spiralEncryptFull;
functionModule.decrypt = spiralDecryptFull;

functionModule.encryptNodeParameter = getSpiralEncryptNodeParameter();
functionModule.decryptNodeParameter = getSpiralDecryptNodeParameter();

export { functionModule };
