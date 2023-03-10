/**
 * Invoked when site is opened on unknown subdomain.
 */
class InvalidSubdomainError extends Error {
    constructor(subdomain) {
        super("There is no bingo defined for the subdomain " + subdomain + "!");
    }
}

/**
 * @deprecated
 * Invoked when bingo json config is badly malformed.
 */
class InvalidConfigurationError extends Error {
    constructor(subdomain) {
        super("Invalid bingo configuration for subdomain " + subdomain + "!");
    }

}

/**
 * Get the left-most part of the hostname.
 *
 * @returns {string}
 */
function getSubdomain() {
    if(location.hash === "")
        return location.hostname.split(".")[0];
    else
        return location.hash.substring(1);
}

/**
 * Returns an array with length n² containing a list of string read from /bingos/<subdomain>.js.
 *
 * @returns {Promise<*>}
 * @throws InvalidSubdomainError
 * @throws InvalidConfigurationError
 */
async function getContent() {
    let response = await fetch("/bingos/" + getSubdomain() + ".json");
    let json;
    try {
        json = await response.json();
    } catch (e) {
        // catch 404; cloudflare pages will automatically show index.html
        // therefore we have no json and exception is thrown
        throw new InvalidSubdomainError(getSubdomain());
    }
    // expect n² elements
    let actualLength = json.length;
    let rows = Math.floor(Math.sqrt(actualLength));
    let expectedLength = Math.pow(rows, 2);
    for(let i = 0; i < actualLength - expectedLength; i++) {
        json.pop();
    }
    // shuffle elements
    json = json.sort((a, b) => 0.5 - Math.random());
    return json;
}

const checkedClass = "checked";

/**
 * Called when a bingo field is clicked.
 *
 * @param element
 */
function clickField(element) {
    element.classList.add(checkedClass);
    // check for win
    let elements = [];
    for(let row of element.parentElement.parentElement.children) {
        for(let td of row.children) {
            elements.push(td);
        }
    }
    let colRowCount = element.parentElement.children.length;
    let checkedDiagonal = [true, true];
    for (let i = 0; i < colRowCount; i++) {
        if (!elements[i + i * colRowCount].classList.contains(checkedClass)) {
            checkedDiagonal[0] = false;
        }
        if (!elements[i + (colRowCount - i - 1) * colRowCount].classList.contains(checkedClass)) {
            checkedDiagonal[1] = false;
        }
        // stores whether all in a row, col, diagonal 1 or diagonal 2 are checked
        let checked = [true, true];
        for (let j = 0; j < colRowCount; j++) {
            if (!elements[i * colRowCount + j].classList.contains(checkedClass)) {
                checked[0] = false;
            }
            if (!elements[i + j * colRowCount].classList.contains(checkedClass)) {
                checked[1] = false;
            }
        }
        if (checked.some(c => c)) {
            win();
            return;
        }
    }
    if (checkedDiagonal.some(c => c)) {
        win();
        return;
    }
}