// Файл, содержащий объекты с методами для роутов моделей
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {message} from "antd";
import {compareArrays} from "../helpers/functions/general.functions/compare";
import {getParents, getShortNameRecord} from "../helpers/functions/general.functions/replaceField";

// Объект с методами для обработки ошибок
const NoticeError = {
    getAll: (e) => {
        // Останавливаем спиннер загрузки данных в таблицу
        store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        console.log(e);
        message.error("Возникла ошибка при получении записей: ", e).then(null);
        throw new Error(e);
    },
    get: (e) => {
        console.log(e);
        message.error("Возникла ошибка при получении записи: ", e).then(null);
        throw new Error(e);
    },
    save: (e, setLoading) => {
        // Останавливаем спиннер загрузки
        setLoading(false);
        console.log(e);
        message.error("Возникла ошибка при сохранении записи: ", e).then(null);
        throw new Error(e);
    },
    delete: (e, setLoading, setVisible) => {
        // Останавливаем спиннер, и скрываем всплывающее окно
        setLoading(false);
        setVisible(false);
        console.log(e);
        message.error("Возникла ошибка при удалении записи: ", e).then(null);
        throw new Error(e);
    },
    cancel: (e) => {
        console.log(e);
        message.error("Возникла ошибка при удалении добавленных файлов из записи: ", e).then(null);
        throw new Error(e);
    }
}

/**
 * Функция установки всех записей в хранилище
 * @param items - записи раздела
 */
const storeProfessions = (items) => {
    if (items && items.length) {
        const reduxProfessions = store.getState().reducerProfession.professions;

        // Если массивы не равны, то обновляем хранилище redux
        const shouldUpdate = compareArrays(items, reduxProfessions);

        if (shouldUpdate) store.dispatch(ActionCreator.ActionCreatorProfession.getAllProfessions(items));
    }
}

/**
 * Функция установки всех записей в хранилище
 * @param items - записи раздела
 */

const storeDepartments = (items) => {
    if (items && items.length) {
        const reduxDepartments = store.getState().reducerDepartment.departments;

        // Если массивы не равны, то обновляем хранилище redux
        const shouldUpdate = compareArrays(items, reduxDepartments);

        if (shouldUpdate) {
            items.forEach(department => {
                department.nameWithParent = getParents(department, items) + department.name;
            });

            store.dispatch(ActionCreator.ActionCreatorDepartment.getAllDepartments(items));
        }
    }
}

/**
 * Функция установки всех записей в хранилище
 * @param items - записи раздела
 */

const storePeople = (items) => {
    if (items && items.length) {
        const reduxPeople = store.getState().reducerPerson.people;

        // Если массивы не равны, то обновляем хранилище redux
        const shouldUpdate = compareArrays(items, reduxPeople);

        if (shouldUpdate) {
            items.forEach(person => {
                person.name = getShortNameRecord(person.name);
            });

            store.dispatch(ActionCreator.ActionCreatorPerson.getAllPeople(items));
        }
    }
}

/**
 * Функция установки всех записей в хранилище
 * @param items - записи раздела
 */

const storeEquipment = (items) => {
    if (items && items.length) {
        const reduxEquipment = store.getState().reducerEquipment.equipment;

        // Если массивы не равны, то обновляем хранилище redux
        const shouldUpdate = compareArrays(items, reduxEquipment);

        if (shouldUpdate) {
            items.forEach(eq => {
                eq.nameWithParent = getParents(eq, items) + eq.name;
            });

            store.dispatch(ActionCreator.ActionCreatorEquipment.getAllEquipment(items));
        }
    }
}

/**
 * Функция установки всех записей в хранилище
 * @param items - записи раздела
 */

const storeEquipmentProperties = (items) => {
    if (items && items.length) {
        const reduxItemsEquipmentProperties = store.getState().reducerEquipmentProperty.equipmentProperties;

        const shouldUpdate = compareArrays(items, reduxItemsEquipmentProperties);

        if (shouldUpdate) store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties(items));
    }
}

/**
 * Функция установки всех записей в хранилище
 * @param items - записи раздела
 */
const storeTask = (items) => {
    if (items && items.length) {
        const reduxTasks = store.getState().reducerTask.tasks;

        // Если массивы не равны, то обновляем хранилище redux
        const shouldUpdate = compareArrays(items, reduxTasks);

        if (shouldUpdate) store.dispatch(ActionCreator.ActionCreatorTask.getAllTasks(items));
    }
}

/**
 * Функция установки всех записей в хранилище
 * @param items - записи раздела
 */
const storeLogDO = (items) => {
    if (items) {
        const reduxItemsLogDoDto = store.getState().reducerLogDO.logDO;

        const shouldUpdate = compareArrays(items.itemsDto, reduxItemsLogDoDto);

        // Обновление легенды статусов
        store.dispatch(ActionCreator.ActionCreatorLogDO.setLegend(items.statusLegend));

        if (shouldUpdate) store.dispatch(ActionCreator.ActionCreatorLogDO.getAllLogDO(items.itemsDto));
    }
}

/**
 * Функция установки всех записей в хранилище
 * @param items - записи раздела
 */
const storeRole = (items) => {
    if (items && items.length) {
        const reducerRole = store.getState().reducerRole.roles;

        // Если массивы не равны, то обновляем хранилище redux
        const shouldUpdate = compareArrays(items, reducerRole);

        if (shouldUpdate) store.dispatch(ActionCreator.ActionCreatorRole.getAllRoles(items));
    }
}

export {
    NoticeError,
    storeProfessions,
    storeDepartments,
    storePeople,
    storeEquipment,
    storeEquipmentProperties,
    storeTask,
    storeLogDO,
    storeRole
};