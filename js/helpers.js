function createHtmlTable(obj, horLength) {
    var res='';

    for (var key in obj) {
        if (key % horLength == 0 && key-1 !=0) {
            res += '</tr><tr><td class="'+key+'">'+obj[key]+'</td>';
            continue;
        }
        res += '<td class="'+key+'">'+obj[key]+'</td>';
    }
    return ('<table><tr>'+res+'</tr></table>');
}

function validateLineWin (num1, num2) {
    var max = (num1 >= num2) ? num1 : num2;
    return max;
}

// fn (obj, lineWin, index, width, height, symbol)) - check an obj{0:'', 1: '', 2: ''...} for a win
function isTicWin1DObj (obj, lineWin, index, width, height, symbol) {
// index - current index in the object, width - number of columns in the table
// k = Math.ceil(index/width) - index of the current row in the table
// l = (index%width !=0) ? index$width : width; - index of the current column in the table
// j - counter of moves
// move - number of moves to a border
// i - current index

    var sum = 0,
        k = Math.ceil(index/width),
        l = (index % width !=0) ? index%width : width,
        i, j, move = 0;

    //check sum for a win
    function isSumWin() {
        sum++;
        if (sum == lineWin) return true;
    }
    //check element for a symbol
    function isSymbol() {
        if (obj[i] != symbol){
            sum = 0;
            return true;
        }
    }

    // check row k
    i = (k - 1) * width + 1;    //(k-1)*width+1 - index of the obj correspondent to the first cell in row k
    for (j = 0, i; j <= width; i++, j++) {
        if (isSymbol()) continue;
        if (isSumWin()) return true;
    }
    sum = 0;

    // check column l
    i = l; // first element in column l
    for (i; i <= height * width; i += width) {
        if (isSymbol()) continue;
        if (isSumWin()) return true;
    }
    sum = 0;

    // check "\"-diagonal
    if (index >= ((k - 1) * width + k)) { //(above or on "\"-diagonal),
    // (k-1)*width+k - "\"-diagonal element in row k
        i = index - (k - 1) * (width + 1);  // start element in row 1
        move = width - i + 1;
        for (j = 1;; i += width + 1, j++) {
            if (j > move || j > height) break;
            if (isSymbol()) continue;
            if (isSumWin()) return true;
        }
    }
    if (index < ((k - 1) * width + k)) {     //(under "\"-diagonal)
        // (k - 1) * width + k  - "\"-diagonal element in row k
        i = index - (index - ((k - 1) * width + 1)) * (width + 1); // start element in column 1
        move = height - Math.ceil(i/width) + 1;
        for (j = 1;; i += width + 1, j++) {
            if (j > move || j > width) break;
            if (isSymbol()) continue;
            if (isSumWin()) return true;
        }
    }
    sum = 0;

    // check "/"-diagonal
    if (index <= (k * width) - (k - 1)) {     // above "/"-digonal,
    // (k * width) - (k - 1) - "/"-diagonal element in row k
        i = index - (k - 1) * (width - 1);  // start element in row 1
        move = i;
        for (j = 1;; i += width - 1, j++) {
            if (j > move || j > height) break;
            if (isSymbol()) continue;
            if (isSumWin()) return true;
        }
    }
    if (index > (k * width) - (k - 1)) {    // under "/"-diagonal
        i = index - (width - l) * (width - 1);  // start element in last column
        move = height - Math.ceil(i/width) + 1;
        for (j = 1;; i += width - 1, j++) {
            if (j > move || j > width) break;
            if (isSymbol()) continue;
            if (isSumWin()) return true;
        }
    }
}