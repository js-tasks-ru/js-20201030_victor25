/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

    if (size === undefined) {
        return string;
    }

    const resultArray = [];
    let count = 0;
    let previus = '';
    string.split('').forEach(current => {
        count = (current !== previus) ? 1 : count + 1;
        if (count <= size) {
            resultArray.push(current);
        }
        previus = current;
    });

    return resultArray.join('');
}
