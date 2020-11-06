/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    return bubbleSort(arr, param);
}

function bubbleSort (inputArray, param = 'asc') {

    const sign = (param == 'asc') ? 1 : -1; 
    let outputArray = [...inputArray];
    if (outputArray.length > 1) {
        for (let i = 0; i < outputArray.length - 1; i++) {
            for (let j = 1; j < outputArray.length; j++) {
                if (sign * compareStrings(outputArray[j-1], outputArray[j]) > 0) {
                    swapArrayItems(outputArray, j-1, j);
                }
            }
        }
    }

    return outputArray;    
}

function compareStrings (lhs, rhs) {
    return lhs.localeCompare(rhs, 'ru-en-u-kf-upper');
}

function swapArrayItems(arr, lhsIndex, rhsIndex) {
    let temp = arr[lhsIndex];
    arr[lhsIndex] = arr[rhsIndex];
    arr[rhsIndex] = temp;
}
