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
function isTicWin (obj, lineWin, index, width, height, symbol) {
// index - current index in the object
// width - number of columns in the table
// k = Math.floor(index/width) - index of the current row in the table (0 - first row)
// l = index % width; - index of the current column in the table (0 - first column)
// j - counter of moves
// move - number of moves to a border
// i - current index for counting

    var sum = 0,
        k = Math.floor(index/width),
        l = index % width,
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
    //k * width - index of the obj correspondent to the first cell in row k
    i = k * width;
    for (j = 0, i; j < width; i++, j++) {
        if (isSymbol()) continue;
        if (isSumWin()) return true;
    }
    sum = 0;

    // check column l
    // i - first element in column l
    i = l;
    for (i; i < height * width; i += width) {
        if (isSymbol()) continue;
        if (isSumWin()) return true;
    }
    sum = 0;

    // check "\"-diagonal

    //(above or on "\"-diagonal),
    // k * width + k - "\"-diagonal element in row k
    if (index >= (k * width + k)) {
        // i - start element in row 0
        i = index - k * (width + 1);
        move = width - i -1;
        for (j = 0;; i += width + 1, j++) {
            if (j > move || j > height - 1) break;
            if (isSymbol()) continue;
            if (isSumWin()) return true;
        }
    }

    //(under "\"-diagonal)
    if (index < (k * width + k)) {
        // i - start element in column 0
        i = index - l * (width + 1);
        move = height - Math.ceil(i/width) - 1;
        for (j = 0;; i += width + 1, j++) {
            if (j > move || j > width) break;
            if (isSymbol()) continue;
            if (isSumWin()) return true;
        }
    }
    sum = 0;

    // check "/"-diagonal

    // above "/"-diagonal
    // width - 1 + k * (width - 1) - "/"-diagonal element in row k
    if (index <= width - 1 + k * (width - 1)) {
        // i start element in row 0
        i = index - k * (width - 1);
        move = i;
        for (j = 0;; i += width - 1, j++) {
            if (j > move || j > height) break;
            if (isSymbol()) continue;
            if (isSumWin()) return true;
        }
    }

    // under "/"-diagonal
    if (index > width - 1 + k * (width - 1)) {
        // i - start element in last column
        i = index - (width - l - 1) * (width - 1);
        move = height - Math.ceil(i/width);
        for (j = 0;; i += width - 1, j++) {
            if (j > move || j > width) break;
            if (isSymbol()) continue;
            if (isSumWin()) return true;
        }
    }
}