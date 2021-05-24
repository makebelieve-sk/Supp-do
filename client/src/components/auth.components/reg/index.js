// Компонент, отрисовывающий форму регистрации
import React, {useState} from "react";
import { useHistory, Link } from "react-router-dom";
import {Button, Card, Col, Form, Input, message, Row} from "antd";
import {LockOutlined, ScheduleOutlined, SolutionOutlined, UserOutlined} from "@ant-design/icons";
import {PasswordInput} from "antd-password-input-strength";
import MaskedInput from "antd-mask-input";

import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import {request} from "../../../helpers/functions/general.functions/request.helper";

import "./reg.css";

export const RegistrationComponent = () => {
    const history = useHistory(); // Создаем объект history из react-router-dom

    const [loadingReg, setLoadingReg] = useState(false);

    // Нажатие на кнопку "Зарегистрироваться"
    const register = async (values) => {
        try {
            setLoadingReg(true);

            values.phone = values.phone.replace("+", "")
                .replaceAll("(", "")
                .replaceAll(")", "")
                .replaceAll("-", "")
                .replaceAll(" ", "")
                .replaceAll("_", "");

            const data = await request("/api/auth/register", "POST", values);

            setLoadingReg(false);

            if (data) {
                message.success(data.message);
                store.dispatch(ActionCreator.ActionCreatorAuth.setAlert(true)); // Устанавливаем флаг показа алерта
                history.push("/login"); // Переходим на страницу входа
            }
        } catch(e) {
            console.log(e);
            // При ошибке от сервера, останавливаем спиннер загрузки
            setLoadingReg(false);
            message.error(e.message);
        }
    };

    return (
        <Row justify="center" className="row_register">
            <Col>
                <Card title="Регистрация" className="card_register">
                    <Form
                        name="normal_login"
                        className="login-form"
                        layout="vertical"
                        onFinish={register}
                    >
                        <Form.Item label="Почта" name="email" rules={[{
                            required: true,
                            transform: value => value ? value.trim() : "",
                            message: "Введите почту",
                            type: "email",
                            min: 1,
                            max: 255
                        }]}>
                            <Input prefix={<ScheduleOutlined className="site-form-item-icon"/>} placeholder="Email"/>
                        </Form.Item>

                        <Form.Item label="Номер телефона" name="phone" rules={[{
                            required: true,
                            message: "Длина телефона должна быть 11 символов",
                            transform: value => {
                                value = value.replace("+", "")
                                    .replaceAll("(", "")
                                    .replaceAll(")", "")
                                    .replaceAll("-", "")
                                    .replaceAll(" ", "")
                                    .replaceAll("_", "");

                                return value;
                            },
                            min: 11,
                            max: 11,
                            type: "string",
                        }]}>
                            <MaskedInput mask="+7 (111) 111-11-11" name="phone" size="11"/>
                        </Form.Item>

                        <Form.Item label="Имя" name="firstName" rules={[{
                            required: true,
                            transform: value => value ? value.trim() : "",
                            message: "Введите имя",
                            type: "string",
                            min: 1,
                            max: 255
                        }]}>
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Имя"/>
                        </Form.Item>

                        <Form.Item label="Фамилия"  name="secondName" rules={[{
                            required: true,
                            transform: value => value ? value.trim() : "",
                            message: "Введите фамилию",
                            type: "string",
                            min: 1,
                            max: 255
                        }]}>
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Фамилия"/>
                        </Form.Item>

                        <Form.Item label="Имя пользователя" name="userName" className="user-name" rules={[{
                                required: true,
                                transform: value => value ? value.trim() : "",
                                message: "Введите имя пользователя",
                                type: "string",
                                min: 1,
                                max: 255
                            }]}>
                            <Input prefix={<SolutionOutlined className="site-form-item-icon"/>} placeholder="Имя пользователя"/>
                        </Form.Item>

                        <div className="text-muted">Используется для входа в программу</div>

                        <Form.Item label="Пароль" name="password" hasFeedback rules={[{
                            required: true,
                            transform: value => value ? value.trim() : "",
                            message: "Длина пароля должна быть не менее 6 символов",
                            type: "string",
                            min: 6,
                            max: 255
                        }]}>
                            <PasswordInput prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="Введите пароль"/>
                        </Form.Item>

                        <Form.Item label="Подтверждение пароля" name="confirm" dependencies={["password"]} hasFeedback rules={[
                            {
                                required: true,
                                transform: value => value ? value.trim() : "",
                                message: "Подтвердите пароль",
                                type: "string",
                                min: 1,
                                max: 255
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    return !value || getFieldValue("password") === value
                                        ? Promise.resolve()
                                        : Promise.reject("Введенные пароли не совпадают!");
                                },
                            }),
                        ]}>
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="Подтвердите пароль"/>
                        </Form.Item>

                        <Form.Item>
                            <Button loading={loadingReg} type="primary" htmlType="submit" className="login-form-button">
                                Зарегистрироваться
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button type="secondary" className="login-form-button">
                                <Link to="/login">Отмена</Link>
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}