// Компонент формы записи раздела "Роли"
import React, {useContext, useEffect, useState} from "react";
import {Card, Checkbox, Form, Input} from "antd";

import {onFailed, TabButtons} from "../tab.functions";
import {DeleteTabContext} from "../../context/deleteTab.context";
import {RoleRoute} from "../../routes/route.Role";
import {LogDORoute} from "../../routes/route.LogDO";
import OpenTableTab from "../../helpers/functions/tabs.functions/openTableTab";
import {getModel} from "../../helpers/mappers/tabs.mappers/table.helper";

import "./role.form.css";

export const RoleForm = ({item}) => {
    // Инициализация состояний для показа спиннера загрузки при сохранении/удалении записи и для расширений
    const [loadingSave, setLoadingSave] = useState(false);
    const [permissions, setPermissions] = useState();

    // Инициализация заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание роли" : "Редактирование роли";

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // Получаем функцию удаления вкладки onRemove из контекста
    const onRemove = useContext(DeleteTabContext);

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        setPermissions(item.permissions);   // Обновляем состояние расширений

        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            name: item.name.trim(),
            notes: item.notes.trim()
        });
    }, [item, form]);

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        values.permissions = permissions;

        await RoleRoute.save(values, setLoadingSave, onRemove);
    }

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) =>
        await RoleRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove);

    const cancelHandler = () => RoleRoute.cancel(onRemove);

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    className="form-styles"
                    name="role-item"
                    layout="vertical"
                    onFinishFailed={onFailed}
                    onFinish={saveHandler}
                >
                    <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                    <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>

                    <Form.Item
                        rules={[{
                            required: true,
                            transform: value => value.trim(),
                            message: "Заполните наименование!"
                        }]}
                        label="Наименование"
                        name="name"
                    >
                        <Input type="text" maxLength={255} onChange={e => form.setFieldsValue({name: e.target.value})} />
                    </Form.Item>

                    <Form.Item label="Описание" name="notes">
                        <Input type="text" maxLength={255} onChange={e => form.setFieldsValue({notes: e.target.value})} />
                    </Form.Item>

                    <Form.Item label="Разрешения">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="center">Наименование страницы</th>
                                    <th className="center">Просм.</th>
                                    <th className="center">Ред.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    permissions && permissions.length
                                        ? permissions.map((perm, index) => (
                                            <tr key={perm.key}>
                                                <td className="link" onClick={() => OpenTableTab(
                                                        perm.title,
                                                        perm.key,
                                                        perm.key !== "logDO" ? getModel(perm.key) : LogDORoute
                                                    )}
                                                >
                                                    {perm.title}
                                                </td>

                                                <td className="center">
                                                    <Checkbox
                                                        disabled={perm.key === "logDO"}
                                                        checked={perm.read}
                                                        onChange={e => {
                                                            setPermissions([
                                                                ...permissions.slice(0, index),
                                                                {...perm, read: e.target.checked},
                                                                ...permissions.slice(index + 1)
                                                            ]);
                                                        }} />
                                                </td>

                                                <td className="center">
                                                    <Checkbox
                                                        disabled={perm.key === "logDO"}
                                                        checked={perm.edit}
                                                        onChange={e => {
                                                            setPermissions([
                                                                ...permissions.slice(0, index),
                                                                {...perm, edit: e.target.checked},
                                                                ...permissions.slice(index + 1)
                                                            ]);
                                                        }} />
                                                </td>
                                            </tr>
                                        ))
                                        : <tr><td className="center">Нет страниц</td></tr>
                                }
                            </tbody>
                        </table>
                    </Form.Item>

                    <TabButtons
                        loadingSave={loadingSave}
                        item={item}
                        deleteHandler={deleteHandler}
                        cancelHandler={cancelHandler}
                    />
                </Form>
            }
        />
    )
}