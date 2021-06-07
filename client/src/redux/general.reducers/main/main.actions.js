// Экшены для общего состояния
import {
    SET_PAGE_SIZE,
    SET_COLUMNS
} from "./main.constants";

const ActionCreatorMain = {
    // Установка количества записей на странице таблицы
    setPageSize: (pageSize) => {
        return {
            type: SET_PAGE_SIZE,
            payload: pageSize
        }
    },
    // Установка колонок таблицы
    setColumns: (columns) => {
        return {
            type: SET_COLUMNS,
            payload: columns
        }
    }
}

export default ActionCreatorMain;