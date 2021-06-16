// Компонент, отрисовывающий форму входа
import React, {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {Button, Card, Checkbox, Col, Form, Input, Row, Alert, message} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";

import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import {AuthContext} from "../../../context/auth.context";
import {request} from "../../../helpers/functions/general.functions/request.helper";

import "./auth.css";
import {emailAddressCompany} from "../../../options/global.options";

export const AuthComponent = ({setRegForm}) => {
    // Получаем флаг показа блока предупреждения и режим работы приложения из редакса
    const alert = useSelector(state => state.reducerAuth.regAlert);

    // Инициализация состояний для загрузки кнопки "Войти" и редима работы приложения
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [isDemo, setIsDemo] = useState(false);

    const auth = useContext(AuthContext);

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // Получаем значение режима работы приложения
    useEffect(() => {
        const config = JSON.parse(localStorage.getItem("config"));

        if (config && config.mode && config.mode === "demo") setIsDemo(true);

        form.setFieldsValue({
            userName: isDemo ? "demo" : "",
            password: isDemo ? "supp-demo" : "",
            remember: true
        });
    }, [form, isDemo]);

    // Нажатие на кнопку "Войти"
    const login = async (values) => {
        try {
            delete values.remember;

            setLoadingLogin(true);

            const data = await request("/api/auth/login", "POST", values);

            setLoadingLogin(false);

            if (data) {
                store.dispatch(ActionCreator.ActionCreatorAuth.setAlert(false));    // Убираем флаг показа алерта
                auth.login(data.token, data.user);  // Вызываем функию входа пользователя
            }
        } catch (e) {
            console.log(e);
            // При ошибке от сервера, останавливаем спиннер загрузки
            setLoadingLogin(false);
            message.error(e.message);
        }
    };

    // Устанавливаем заголовок
    const cardTitle = `Вход в программу СУПП-ДО ${isDemo ? "\n(демоверсия)" : ""}`;

    return (
        <Row align="middle" justify="center" className="row_auth">
            <Col>
                <Card title={cardTitle} className="card_auth">
                    {
                        alert
                            ? <Alert
                                className="alert"
                                type="success"
                                message="Вы успешно зарегистрированы. Можно начинать работать после одобрения администратором"
                            />
                            : null
                    }

                    <Form
                        form={form}
                        name="normal_login"
                        className="login-form"
                        onFinish={login}
                    >
                        <Form.Item name="userName" rules={[{
                            required: true,
                            transform: value => value.trim(),
                            message: "Введите логин",
                            type: "string",
                            min: 1,
                            max: 255
                        }]}>
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Логин"/>
                        </Form.Item>

                        <Form.Item name="password" rules={[{
                            required: true,
                            transform: value => value.trim(),
                            message: "Введите пароль",
                            type: "string",
                            min: 1,
                            max: 255
                        }]}>
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="Пароль"/>
                        </Form.Item>

                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Запомнить меня</Checkbox>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item>
                            <Button loading={loadingLogin} type="primary" htmlType="submit" className="login-form-button">
                                Войти
                            </Button>
                            Или <Link to="/register" onClick={() => setRegForm(true)}>зарегистрируйтесь сейчас</Link>
                        </Form.Item>

                        <Form.Item noStyle>
                            <a href={`mailto:${emailAddressCompany}`}>Свяжитесь с нами</a>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}