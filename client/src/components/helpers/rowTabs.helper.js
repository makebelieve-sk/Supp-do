// Помощник по созданию вкладки записи
import React from "react";
import {Button, message} from "antd";
import {DeleteOutlined, PrinterOutlined} from "@ant-design/icons";

import {request} from "./request.helper";
import store from "../../redux/store";

// Инициализация кнопок, появляющихся при редактировании записи
const checkTypeTab = (rowData, deleteHandler, loadingDelete) => {
    return rowData ?
        <>
            <Button
                className="button-style"
                type="danger"
                onClick={deleteHandler}
                loading={loadingDelete}
                icon={<DeleteOutlined/>}
            >
                Удалить
            </Button>
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
        const data = await request(`/api/directory/${url}`, method, values);
        // Останавливаем спиннер
        setLoadingSave(false);

        if (data) {
            // Выводим сообщение от сервера
            message.success(data.message);

            // Если это редактирование записи, то происходит изменение записи в хранилище redux,
            // иначе происходит запись новой записи в хранилище redux
            rowData ?
                dataStore.forEach((prof, index) => {
                    if (prof._id === data.item._id) {
                        store.dispatch(dispatchActionEdit(index, data.item));
                    }
                }) :
                store.dispatch(dispatchActionCreate(data.item));

            // Удаление текущей вкладки
            onRemove(specKey, "remove");
        }
    } catch (e) {
        // При ошибке от сервера, останавливаем спиннер загрузки
        setLoadingSave(false);
    }
};

// Удаление записи
const onDelete = async (url, setLoadingDelete, dispatchActionDelete, dataStore, onRemove, specKey, rowData) => {
    try {
        if (rowData) {
            // Устанавливаем спиннер
            setLoadingDelete(true);
            // Получаем данные от сервера
            const data = await request(`/api/directory/${url}/` + rowData._id, "DELETE", rowData);
            // Останавливаем спиннер
            setLoadingDelete(false);

            if (data) {
                // Вывод сообщения
                message.success(data.message);
                // Удаление текущей вкладки
                onRemove(specKey, 'remove');
                // Удаляем запись из хранилища redux
                dataStore.forEach((prof, index) => {
                    if (prof._id === rowData._id) {
                        store.dispatch(dispatchActionDelete(index));
                    }
                });
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
    // form.setFieldsValue({parent: value});

    if (value === "Не выбрано") {
        setSelect(value);
        return null;
    }

    if (dataStore && dataStore.length > 0) {
        let foundItem = dataStore.find((item) => {
            return item.name === value;
        });

        if (foundItem) {
            setSelect(foundItem);
        }
    }
};

// Обновление значений в выпадающем списке
const onDropDownRender = async (open, setLoading, url, dispatchAction, setSelectToOptions) => {
    try {
        if (open) {
            setLoading(true);

            const items = await request(`/api/directory/${url}`);

            store.dispatch(dispatchAction(items));

            let valuesToOptions = [{label: "Не выбрано", value: "Не выбрано"}];

            if (items) {
                items.forEach((department) => {
                    let object = {
                        label: department.name,
                        value: department.name
                    }

                    valuesToOptions.push(object);
                })
            }

            setLoading(false);

            setSelectToOptions(valuesToOptions);
        }
    } catch(e) {
        setLoading(false);
    }
}

export {
    checkTypeTab,
    onSave,
    onDelete,
    onFailed,
    onCancel,
    onChange,
    onDropDownRender
}