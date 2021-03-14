/**
 * Функция изменения поля name записей персонала
 * @param people - массив записей персонала
 * @returns измененный массив записей
 */
export function getShortName(people = []) {
    // Изменяем поле name для каждой записи в массиве
    if (people && people.length) {
        return people.map(person => helper(person));
    } else {
        return [];
    }
}

/**
 * Функция изменения поля name записи персонала
 * @param savedPerson - только что сохраненная запись персонала
 * @returns измененный объект записи
 */
export function getShortNameRecord(savedPerson = null) {
    // Изменяем поле name для только что сохраненной записи
    if (savedPerson) {
        return helper(savedPerson);
    }
}

/**
 * Функция помощник для сокращения поля name
 * @param person - объект записи
 * @returns измененный объект записи
 */
const helper = (person) => {
    const fio = person.name.split(" ");

    fio[1] = fio[1][0] + ".";

    if (fio[2]) {
        fio[2] = fio[2][0] + ".";
    }

    person.name = fio.join(" ");
    return person;
}