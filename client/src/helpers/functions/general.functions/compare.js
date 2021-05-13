/**
 * Проверка массивов на равенство
 * @param array1 - первый массив
 * @param array2 - второй массив
 * @returns возвращается булево значение {boolean}
 */
function compareArrays(array1, array2) {
    if (!array1.length || !array2.length) return true;

    const sortArray1 = array1.sort();
    const sortArray2 = array2.sort();

    return JSON.stringify(sortArray1) !== JSON.stringify(sortArray2);
}

/**
 * Проверка объектов на равенство
 * @param obj1 - первый объект
 * @param obj2 - второй объект
 * @returns возвращается булево значение {boolean}
 */
function compareObjects(obj1, obj2) {
    if (!obj1 || !obj2) return true;
    if (!Object.keys(obj1).length) return true;
    if (!Object.keys(obj2).length) return true;

    return JSON.stringify(obj1) !== JSON.stringify(obj2);
}

export {compareArrays, compareObjects}