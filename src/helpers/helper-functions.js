// generate random integer between min and max, inclusive
function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// randomly shuffle the array
function shuffleArray(array) {
    let j;
    let temp;
    for (let i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// fill array of random length with random values, all within specified min/max
function fillArray (lenMin, lenMax, valMin, valMax) {
    let returnArray = [];
    for (var i = 0; i < randInt(lenMin, lenMax); i++) {
        returnArray.push( randInt(valMin, valMax) );
    }
    return returnArray;
}

function isNumber(x) {
    return x == Number(x);
}

function getRandomColor(from, to) {
    if (!from && !to) {
        return [randInt(0, 255), randInt(0, 255), randInt(0, 255)];
    }
    if (!to) {
        return [randInt(from[0], 255), randInt(from[1], 255), randInt(from[2], 255)];
    }
    return [randInt(from[0], to[0]), randInt(from[1], to[1]), randInt(from[2], to[2])];
}

function getGreyVariant() {
    const grey = randInt(0, 255);
    return [grey, grey, grey];
}

Array.prototype.equals = function (array) {
    if (!array) {
        return false;
    }
    if (this.length !== array.length) {
        return false;
    }
    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] !== array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

