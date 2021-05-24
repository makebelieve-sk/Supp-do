// Компонент формы записи раздела "Журнал действий пользователя"
import React, {useEffect} from "react";
import {Card, Form, Input} from "antd";

import {onFailed, TabButtons} from "../tab.functions";
import onRemove from "../../helpers/functions/general.functions/removeTab";
import {LogRoute} from "../../routes/route.Log";

export const LogForm = ({item}) => {
    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        form.setFieldsValue({
            _id: item._id,
            date: item.date,
            action: item.action,
            username: item.username,
            content: item.content,
        });
    }, [item, form]);

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) =>
        await LogRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm);

    return (
        <Card.Meta
            title="Просмотр записи"
            description={
                <Form
                    form={form}
                    className="form-styles"
                    name="log-item"
                    layout="vertical"
                    onFinishFailed={onFailed}
                >
                    <Form.Item name="_id" hidden={true}><Input/></Form.Item>

                    <Form.Item label="Дата и время" name="date">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="Действие" name="action">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="Имя пользователя" name="username">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="Содержание записи" name="content">
                        <Input.TextArea disabled />
                    </Form.Item>

                    <TabButtons
                        loadingSave={false}
                        item={item}
                        deleteHandler={deleteHandler}
                        cancelHandler={() => onRemove("logItem", "remove")}
                        specKey="logItem"
                    />
                </Form>
            }
        />
    )
}