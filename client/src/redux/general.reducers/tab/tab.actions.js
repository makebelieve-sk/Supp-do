import {
    ADD_TAB,
    EDIT_TAB,
    REMOVE_TAB,
    SET_ACTIVE_KEY,
    SET_TABS_IN_HISTORY,
    SET_TABS,
    SET_PAGE_SIZE,
} from "./tab.constants";

const ActionCreatorTab = {
    // Добавление вкладки
    addTab: (tabContent) => {
        return {
            type: ADD_TAB,
            payload: tabContent
        }
    },
    // Обновление вкладки
    editTab: (index, row) => {
        return {
            type: EDIT_TAB,
            index: index,
            payload: row
        }
    },
    // Удаление вкладки
    removeTab: (index) => {
        return {
            type: REMOVE_TAB,
            payload: index
        }
    },
    // Установка активной вкладки
    setActiveKey: (key) => {
        return {
            type: SET_ACTIVE_KEY,
            payload: key
        }
    },
    // Установка истории вкладок
    setHistoryTab: (historyTabs) => {
        return {
            type: SET_TABS_IN_HISTORY,
            payload: historyTabs
        }
    },
    // Установка вкладок
    setTab: (tab) => {
        return {
            type: SET_TABS,
            payload: tab
        }
    },
    // Установка количества записей на странице таблицы
    setPageSize: (pageSize) => {
        return {
            type: SET_PAGE_SIZE,
            payload: pageSize
        }
    }
}

export default ActionCreatorTab;