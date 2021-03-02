// Помощник по созданию вкладки записи
import React, {useState} from "react";
import {Button, message, Popconfirm} from "antd";
import {DeleteOutlined, PrinterOutlined, QuestionCircleOutlined} from "@ant-design/icons";

import {request} from "../request.helper";
import store from "../../../redux/store";
import getParents from "../getRowParents.helper";

// Инициализация кнопок, появляющихся при редактировании записи
const CheckTypeTab = (item, deleteHandler) => {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [visiblePopConfirm, setVisiblePopConfirm] = useState(false);

    return !item || item.itemId !== "-1" ?
        <>
            <Popconfirm
                title="Вы уверены, что хотите удалить запись?"
                okText="Удалить"
                visible={visiblePopConfirm}
                onConfirm={() => deleteHandler(setLoadingDelete, setVisiblePopConfirm)}
                onCancel={() => setVisiblePopConfirm(false)}
                okButtonProps={{loading: loadingDelete}}
                icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
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

// Сохранение/Редактирование записи
const onSave = async (url, values, setLoadingSave, dispatchActionEdit, dispatchActionCreate, dataStore, onRemove, specKey, rowData) => {
    try {
        // Устанавливаем спиннер
        setLoadingSave(true);
        // Определяем метод
        const method = rowData ? "PUT" : "POST";

        // Получаем данные от сервера
        let data = null;

        if (url === "log-do") {
            data = await request(`/api/${url}`, method, values);
        } else {
            data = await request(`/api/directory/${url}`, method, values);
        }

        // Останавливаем спиннер
        setLoadingSave(false);

        if (data) {
            // Выводим сообщение от сервера
            message.success(data.message);

            // Если это редактирование записи, то происходит изменение записи в хранилище redux,
            // иначе происходит запись новой записи в хранилище redux
            if (rowData) {
                let foundItem = dataStore.find(item => {
                    return item._id === data.item._id;
                });

                let indexOf = dataStore.indexOf(foundItem);

                if (foundItem && indexOf >= 0) {
                    store.dispatch(dispatchActionEdit(indexOf, data.item));
                }
            } else {
                store.dispatch(dispatchActionCreate(data.item));
            }

            // Удаление текущей вкладки
            onRemove(specKey, "remove");
        }
    } catch (e) {
        // При ошибке от сервера, останавливаем спиннер загрузки
        setLoadingSave(false);
    }
};

// Удаление записи
const onDelete = async (url, setLoadingDelete, dispatchActionDelete, dataStore, onRemove, specKey, rowData, setVisiblePopConfirm) => {
    try {
        if (rowData) {
            // Устанавливаем спиннер
            setLoadingDelete(true);

            // Получаем данные от сервера
            let data;

            if (url === "log-do") {
                data = await request(`/api/${url}/` + rowData._id, "DELETE", rowData);
            } else {
                data = await request(`/api/directory/${url}/` + rowData._id, "DELETE", rowData);
            }

            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);

            if (data) {
                // Вывод сообщения
                message.success(data.message);

                // Удаляем запись из хранилища redux
                let foundItem = dataStore.find(item => {
                    return item._id === rowData._id;
                });

                let indexOf = dataStore.indexOf(foundItem);

                if (foundItem && indexOf >= 0) {
                    store.dispatch(dispatchActionDelete(indexOf));
                }

                // Удаление текущей вкладки
                onRemove(specKey, 'remove');
            }
        }
    } catch (e) {
        // При ошибке от сервера, останавливаем спиннер загрузки
        setLoadingDelete(false);
    }
};

// Вывод сообщения валидации формы
const onFailed = () => message.error('Заполните обязательные поля').then(r => console.log(r));

// Удаление текущей вкладки
const onCancel = (onRemove, specKey) => onRemove(specKey, 'remove');

// Изменение значения в выпадающем списке
const onChange = (form, value, setSelect, dataStore) => {
    if (value === "Не выбрано") {
        setSelect(value);
        return null;
    }

    if (dataStore && dataStore.length > 0) {
        let foundItem = dataStore.find(item => {
            return item._id === value;
        });

        if (foundItem) {
            setSelect(foundItem);
        }
    }
};

// Обновление значений в выпадающем списке
const onDropDownRender = async (open, setLoading, url, dispatchAction, setSelectToOptions, rowData) => {
    try {
        if (open) {
            setLoading(true);

            const items = await request(`/api/directory/${url}`);

            if (url === 'equipment' || url === 'departments') {
                items.forEach(item => {
                    if (item.parent) {
                        item.nameWithParent = getParents(item, items) + item.name
                    }
                })
            }

            store.dispatch(dispatchAction(items));

            let valuesToOptions = [{label: "Не выбрано", value: "Не выбрано"}];

            if (items) {
                items.forEach((item) => {
                    let object = {
                        label: item.nameWithParent ?? item.name,
                        value: item._id
                    }

                    valuesToOptions.push(object);
                })
            }

            setLoading(false);

            setSelectToOptions(valuesToOptions);
        }
    } catch (e) {
        setLoading(false);
    }
}

export {
    CheckTypeTab,
    onSave,
    onDelete,
    onFailed,
    onCancel,
    onChange,
    onDropDownRender
}