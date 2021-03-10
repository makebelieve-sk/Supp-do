// Помощник по созданию вкладки записи
import React, {useState} from "react";
import {Button, message, Popconfirm} from "antd";
import {DeleteOutlined, PrinterOutlined, QuestionCircleOutlined} from "@ant-design/icons";

// Получение выпадающего списка
const getOptions = (items) => {
    let valuesToOptions = [{label: "Не выбрано", value: null}];

    if (items) {
        items.forEach(item => {
            valuesToOptions.push({
                label: item.nameWithParent ?? item.name,
                value: item._id
            });
        })
    }

    return valuesToOptions;
};

// Инициализация кнопок, появляющихся при редактировании записи
const CheckTypeTab = (item, deleteHandler) => {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [visiblePopConfirm, setVisiblePopConfirm] = useState(false);

    return item && !item.isNewItem ?
        <>
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
                    className="button-style"
                    type="danger"
                    icon={<DeleteOutlined/>}
                    onClick={() => setVisiblePopConfirm(true)}
                >
                    Удалить
                </Button>
            </Popconfirm>
            <Button
                className="button-style"
                type="secondary"
                onClick={() => alert("Печать")}
                icon={<PrinterOutlined/>}
            >
                Печать
            </Button>
        </> : null;
}

// Вывод сообщения валидации формы
const onFailed = () => message.error("Заполните обязательные поля").then(null);

export {getOptions, CheckTypeTab, onFailed}