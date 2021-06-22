// Компонент, отрисовывающий кнопки таблицы
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Button, Dropdown} from "antd";
import {EditOutlined} from "@ant-design/icons";

import PrintButton from "./printButton";
import {DropdownMenuComponent} from "../dropdownMenu";
import {useWindowWidth} from "../../../hooks/windowWidth.hook";

import "./tableButtons.css";

export const ButtonsComponent = ({specKey, setColumnsTable, table}) => {
    const user = useSelector(state => state.reducerAuth.user);  // Получение объекта пользователя

    const screen = useWindowWidth();    // Получаем текущее значение ширины окна браузера

    // Создание состояний для отображения выпадающего меню, спиннера загрузки при удалении за период и скрытия/раскрытия строк
    const [visible, setVisible] = useState(false);
    const [visiblePopConfirm, setVisiblePopConfirm] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [expand, setExpand] = useState(false);

    // Отображение выпадающего меню
    const handleVisibleChange = flag => setVisible(flag);

    // Получение контента кнопки в зависимости от ширины экрана
    const getContent = (content) => screen !== "xs" && screen !== "sm" && screen !== "md" ? content : null;
    const short = screen === "xs" || screen === "sm" || screen === "md" ? "short" : "";

    return (
        <div className="wrapper_buttons">
            {/*Кнопка сворачивания/разворачивания*/}
            {
                table.renderExpandButton === undefined
                    ? null
                    : table.renderExpandButton(short, expand, setExpand, getContent)
            }

            {/*Кнопка добавления новой записи*/}
            {
                table.renderAddButton === undefined
                    ? null
                    : table.renderAddButton(short, specKey, getContent, user)
            }

            {/*Кнопка удаления за период*/}
            {
                table.renderDeleteByPeriodButton === undefined
                    ? null
                    : table.renderDeleteByPeriodButton(specKey, short, getContent, visiblePopConfirm, setLoadingDelete, setVisiblePopConfirm, loadingDelete, user)
            }

            {/*Кнопка экспорта таблицы*/}
            {table.renderExportButton(short, getContent)}

            {/*Кнопка печати таблицы*/}
            <PrintButton specKey={specKey} short={short} getContent={getContent} table={table}/>

            {/*Кнопка колонок*/}
            <Dropdown
                overlay={<DropdownMenuComponent
                    setColumnsTable={setColumnsTable}
                    specKey={specKey}
                />}
                onVisibleChange={handleVisibleChange}
                visible={visible}
            >
                <Button className={`button ${short} last_button`} icon={<EditOutlined/>}>
                    {getContent("Колонки")}
                </Button>
            </Dropdown>
        </div>
    );
};