// Компонент, отрисовывающий раздел "Пользователи"
import React, {useState} from "react";
import {useSelector} from "react-redux";

import {UserColumns} from "../options/tab.options/table.options/columns";
import {TableComponent} from "../tabs/table";
import ErrorIndicator from "../components/content.components/errorIndicator/errorIndicator.component";
import {ActionCreator} from "../redux/combineActions";
import UserTable from "../tables/UserTable";

const SECTION_NAME = "users";

export const UserSection = () => {
    // Данные таблицы "Пользователи"
    const {users, errorTableUser} = useSelector(state => state.reducerUser);

    // Настройки таблицы
    const settings = useSelector(state => ({
        loading: state.reducerLoading.loadingTable,
        legend: state.reducerLogDO.legend,
        alert: state.reducerLogDO.alert,
        activeKey: state.reducerTab.activeKey,
        pageSize: state.reducerMain.pageSizeOptions,
        columns: state.reducerMain.columnsOptions,
    }));

    // Получение колонок таблицы
    const columns = UserColumns;

    // Создание состояний для текстового поля, колонок таблицы
    const [filterText, setFilterText] = useState("");
    const [columnsTable, setColumnsTable] = useState(columns);

    // Объект, передаваемый в конструктор таблицы
    const options = {
        data: users,
        columns: columns,
        columnsOptions: settings.columns ? settings.columns[SECTION_NAME] : columnsTable,
        pageSize: settings.pageSize ? settings.pageSize[SECTION_NAME] : null,
        filterText: filterText.toLowerCase(),
        loading: settings.loading,
        className: "table-usual",
        sectionName: SECTION_NAME
    };

    // Вызов нового объекта класса таблицы
    const table = new UserTable(options);

    // Инициализация ошибки раздела "Пользователи"
    const error = errorTableUser
        ? {
            errorText: errorTableUser,
            action: ActionCreator.ActionCreatorUser.setErrorTableUser(null)
        }
        : null;

    return error
        ? <ErrorIndicator error={error}/>
        : <TableComponent
            filterText={filterText}
            setFilterText={setFilterText}
            setColumnsTable={setColumnsTable}
            table={table}
            settings={settings}
        />;
}