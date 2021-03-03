import store from "../../redux/store";
import {ActionCreator} from "../../redux/combineActions";

/**
 * Создает новую вкладку раздела с отображением спиннера загрузки
 * @param title - заголовок вкладки
 * @param content - контент вкладки (UI-компонент)
 * @param key - ключ вкладки
 */
export const getEmptyTabWithLoading = (title, content, key) => {
    // Получаем текущие вкладки и акивную вкладку из redux
    const tabs = store.getState().reducerTab.tabs;
    const activeKey = store.getState().reducerTab.activeKey;

    let tabObject = {
        title: title,
        content: content,
        key: key
    }

    // Проверка, существует ли вкладка с таким же ключем
    // Если да, то изменяем объект вкладки в хранилище
    // Если нет, то добавляем объект вкладки в хранилище
    let findTab = tabs.find((tab) => {
        return tab.key === key;
    });
    let indexOf = tabs.indexOf(findTab);

    if (findTab && indexOf >= 0) {
        store.dispatch(ActionCreator.ActionCreatorTab.editTab(indexOf, tabObject));
    } else {
        store.dispatch(ActionCreator.ActionCreatorTab.addTab(tabObject));
    }

    // Сохраняем предыдущую вкладку в хранилище
    if (activeKey) {
        store.dispatch(ActionCreator.ActionCreatorTab.setPrevActiveTab(activeKey));
    }

    // Устанавливаем ключ активной вкладки в хранилище
    store.dispatch(ActionCreator.ActionCreatorTab.setActiveKey(key));
}