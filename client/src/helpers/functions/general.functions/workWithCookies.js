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
 * @param cookieName - наименование куки
 * @param newValue - значение, которое нужно установить
 * @param dispatchAction - экшен для записи в редакс
 */
const updateValueInCookies = (cookieName, newValue, dispatchAction) => {
    // Получаем текущий активный ключ вкладки и значение куки
    const activeKey = store.getState().reducerTab.activeKey;
    const cookieObject = JSON.parse(Cookies.get(cookieName));

    // Присваиваем новое значение
    cookieObject[activeKey] = newValue;

    // Обновляем редакс и куки
    store.dispatch(dispatchAction(cookieObject));
    Cookies.set(cookieName, cookieObject);
};

export {
    setValueToCookies,
    updateValueInCookies
};