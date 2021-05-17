// Помощник по созданию вкладки записи
import React, {useState} from "react";
import {Button, message, Popconfirm, Row} from "antd";
import {CheckOutlined, DeleteOutlined, QuestionCircleOutlined, StopOutlined} from "@ant-design/icons";

import store from "../redux/store";
import PrintButtonRecord from "./printButtonRecord";
import {checkRoleUser} from "../helpers/mappers/general.mappers/checkRoleUser";
import {useWindowWidth} from "../hooks/windowWidth.hook";

// Получение выпадающего списка
const getOptions = (items) => {
    let valuesToOptions = [];

    if (items && items.length) {
        items.forEach(item => {
            valuesToOptions.push({
                label: item.nameWithParent ?? item.name,
                value: item._id
            });
        })
    }

    valuesToOptions.sort((a, b) => a.label > b.label ? 1 : -1);

    valuesToOptions.unshift({label: "Не выбрано", value: null});

    return valuesToOptions;
};

// Компонент кнопок записи
const TabButtons = ({loadingSave, item, deleteHandler, cancelHandler, loadingCancel = false, specKey = null}) => {
    const user = store.getState().reducerAuth.user;
    const activeKey = store.getState().reducerTab.activeKey;

    const screen = useWindowWidth();    // Получаем текущее значение ширины окна браузера

    // Получение контента кнопки в зависимости от ширины экрана
    const getContent = (content) => screen !== "xs" && screen !== "sm" && screen !== "md" ? content : null;
    const short = screen === "xs" || screen === "sm" || screen === "md" ? "short" : "";

    return <Row justify="end" style={{marginTop: 20}} xs={{gutter: [8, 8]}}>
        {
            (checkRoleUser(activeKey, user).edit || activeKey === "changePassword") && activeKey !== "logItem"
                ? <Button className={`button-style ${short}`} type="primary" htmlType="submit" loading={loadingSave} icon={<CheckOutlined/>}>
                    {getContent("Сохранить")}
                </Button>
                : null
        }

        {
            item ? CheckTypeTab(item, deleteHandler, specKey, activeKey, user, getContent, short) : null
        }

        <Button
            className={`button-style ${short}`}
            type="secondary"
            onClick={cancelHandler}
            loading={loadingCancel}
            icon={<StopOutlined/>}
        >
            {getContent("Отмена")}
        </Button>
    </Row>
}

// Компонент кнопок редактирования записи
const CheckTypeTab = (item, deleteHandler, specKey = null, activeKey, user, getContent, short) => {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [visiblePopConfirm, setVisiblePopConfirm] = useState(false);

    return (!item.isNewItem && checkRoleUser(activeKey, user).edit) || specKey === "logItem"
        ? <>
            <Popconfirm
                title="Вы уверены, что хотите удалить запись?"
                okText="Удалить"
                visible={visiblePopConfirm}
                onConfirm={() => deleteHandler(setLoadingDelete, setVisiblePopConfirm)}
                onCancel={() => setVisiblePopConfirm(false)}
                okButtonProps={{loading: loadingDelete}}
                icon={<QuestionCircleOutlined style={{color: "red"}}/>}
            >
                <Button
                    className={`button-style ${short}`}
                    type="danger"
                    icon={<DeleteOutlined/>}
                    onClick={() => setVisiblePopConfirm(true)}
                >
                    {getContent("Удалить")}
                </Button>
            </Popconfirm>

            {
                specKey && specKey !== "logItem"
                    ? <PrintButtonRecord specKey={specKey} getContent={getContent} short={short} />
                    : null
            }
        </>
        : null;
}

// Вывод сообщения валидации формы
const onFailed = () => message.error("Заполните обязательные поля").then(null);

export {getOptions, TabButtons, onFailed}