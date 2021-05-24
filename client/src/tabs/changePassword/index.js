// Компонент смены пароля
import React, {useState} from "react";
import {Card, Form, Input} from "antd";
import {LockOutlined} from "@ant-design/icons";
import {PasswordInput} from "antd-password-input-strength";

import store from "../../redux/store";
import {ChangePasswordRoute} from "../../routes/route.ChangePassword";
import {onFailed, TabButtons} from "../tab.functions";
import onRemove from "../../helpers/functions/general.functions/removeTab";

import "./changePassword.css";

export const ChangePasswordComponent = () => {
    // Инициализация состояния для показа спиннера загрузки при сохранении и удалении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Нажатие на кнопку "Изменить пароль"
    const saveHandler = async (values) => {
        // Получаем текущего пользователя
        const user = store.getState().reducerAuth.user;

        delete values.confirm;

        values.userId = user._id;

        await ChangePasswordRoute.save(values, setLoadingSave);
    };

    return (
        <Card.Meta
            title="Смена пароля"
            description={
                <Form
                    className="form-styles"
                    name="change-password-item"
                    layout="vertical"
                    onFinishFailed={onFailed}
                    onFinish={saveHandler}
                >
                    <Form.Item name="oldPassword" rules={[{required: true, message: "Введите старый пароль"}]} hasFeedback>
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>}
                                        placeholder="Введите старый пароль"/>
                    </Form.Item>

                    <Form.Item name="password" rules={[{
                        required: true,
                        transform: value => value ? value.trim() : "",
                        message: "Длина пароля должна быть не менее 6 символов",
                        type: "string",
                        min: 6,
                        max: 255
                    }]} hasFeedback>
                        <PasswordInput prefix={<LockOutlined className="site-form-item-icon"/>}
                                        placeholder="Введите новый пароль"/>
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            {required: true, message: "Подтвердите новый пароль"},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject("Введенные пароли не совпадают!");
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>}
                                        placeholder="Подтвердите новый пароль"/>
                    </Form.Item>

                    <TabButtons
                        loadingSave={loadingSave}
                        cancelHandler={() => onRemove("changePassword", "remove")}
                    />
                </Form>
            }
        />
    )
}