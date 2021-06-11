// Функции для работы с куки
import Cookies from "js-cookie";
import store from "../../../redux/store";

/**
 * Функция установки значения в куки и редакс
 * @param cookieName - наименование куки
 * @param defaultValue - значение по умолчанию
 * @param dispatchAction - экшен для записи в редакс
 */
const setValueToCookies = (cookieName, defaultValue, dispatchAction) => {
    // Получаем значение из куки
    const cookieValue = Cookies.get(cookieName);

    // Если в куках есть значение, то обновляем редакс, иначе обновляем редакс и куки
    if (cookieValue) {
        const cookieObject = JSON.parse(Cookies.get(cookieName));

        // Устанавливаем значение в редакс
        store.dispatch(dispatchAction(cookieObject));
    } else {
        // Создаем объект
        const newCookieObject = {
            professions: defaultValue,
            departments: defaultValue,
            people: defaultValue,
            tasks: defaultValue,
            equipmentProperties: defaultValue,
            equipment: defaultValue,
            logDO: defaultValue,
            help: defaultValue,
            users: defaultValue,
            roles: defaultValue,
            statisticRating: defaultValue,
            statisticList: defaultValue,
            logs: defaultValue,
        };

        // Устанавливаем объект в куки и редакс
        Cookies.set(cookieName, newCookieObject);
        store.dispatch(dispatchAction(newCookieObject));
    }
};

/**
 * Функция обновления значений в куки и редакс
 * @param object - объект хранилища
 * @param storageName - наименование хранилища
 * @param newValue - значение, которое нужно установить
 * @param dispatchAction - экшен для записи в редакс
 */
const updateValueInStorage = (object, storageName, newValue, dispatchAction = null) => {
    // Получаем текущий активный ключ вкладки и значение куки
    const activeKey = store.getState().reducerTab.activeKey;

    if (activeKey === "statistic") {
        const statisticKey = store.getState().reducerTab.statisticKey;

        // Присваиваем новое значение
        object[statisticKey] = newValue;
    } else {
        // Присваиваем новое значение
        object[activeKey] = newValue;
    }

    // Обновляем редакс и куки
    if (dispatchAction) {
        store.dispatch(dispatchAction(object));
        Cookies.set(storageName, object);
    } else {
        localStorage.setItem(storageName, JSON.stringify({totalObjectDefault: object}));
    }
};

export {
    setValueToCookies,
    updateValueInStorage
};