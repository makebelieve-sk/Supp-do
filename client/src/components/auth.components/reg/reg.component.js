// Компонент регистрации пользователя
import React, {useState} from "react";
import { useHistory, Link } from "react-router-dom";
import {Button, Card, Col, Form, Input, message, Row} from "antd";
import {LockOutlined, ScheduleOutlined, SolutionOutlined, UserOutlined} from "@ant-design/icons";

import store from "../../../redux/store";
import {request} from "../../../helpers/functions/general.functions/request.helper";

import "./reg.css";
import {ActionCreator} from "../../../redux/combineActions";

export const RegistrationComponent = () => {
    const history = useHistory(); // Создаем объект history из react-router-dom

    const [loadingReg, setLoadingReg] = useState(false);

    // Нажатие на кнопку "Зарегистрироваться"
    const register = async (values) => {
        try {
            setLoadingReg(true);

            const data = await request("/api/auth/register", "POST", values);

            setLoadingReg(false);

            if (data) {
                message.success(data.message);
                store.dispatch(ActionCreator.ActionCreatorAuth.setAlert(true)); // Устанавливаем флаг показа алерта
                history.push("/login"); // Переходим на страницу входа
            }
        } catch(e) {
            // При ошибке от сервера, останавливаем спиннер загрузки
            setLoadingReg(false);
        }
    };

    return (
        <Row justify="center" style={{paddingTop: "2%", paddingBottom: "2%"}}>
            <Col span={7}>
                <Card title="Регистрация">
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{remember: true}}
                        layout="vertical"
                        onFinish={register}
                    >
                        <Form.Item label="Почта" name="email" rules={[{
                            required: true,
                            transform: value => value.trim(),
                            message: "Введите почту"
                        }]}>
                            <Input prefix={<ScheduleOutlined className="site-form-item-icon"/>} placeholder="Email" type="email"/>
                        </Form.Item>

                        <Form.Item label="Имя" name="firstName" rules={[{
                            required: true,
                            transform: value => value.trim(),
                            message: "Введите имя"
                        }]}>
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Имя" type="text" maxLength={255}/>
                        </Form.Item>

                        <Form.Item label="Фамилия"  name="secondName" rules={[{
                            required: true,
                            transform: value => value.trim(),
                            message: "Введите фамилию"
                        }]}>
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Фамилия" type="text" maxLength={255}/>
                        </Form.Item>

                        <Form.Item
                            label="Имя пользователя"
                            name="userName"
                            rules={[{required: true, transform: value => value.trim(), message: "Введите имя пользователя"}]}
                            className="user-name"
                        >
                            <Input prefix={<SolutionOutlined className="site-form-item-icon"/>} placeholder="Имя пользователя" type="text" maxLength={255}/>
                        </Form.Item>

                        <div className="text-muted">Используется для входа в программу</div>

                        <Form.Item label="Пароль"  name="password" rules={[{
                            required: true,
                            transform: value => value.trim(),
                            message: "Введите пароль"
                        }]} hasFeedback>
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="Введите пароль"/>
                        </Form.Item>

                        <Form.Item
                            label="Подтверждение пароля"
                            name="confirm"
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                                {required: true, transform: value => value.trim(), message: "Подтвердите пароль"},
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