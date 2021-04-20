// Компонент авторизации пользователя
import React, {useState, useContext} from "react";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {Button, Card, Checkbox, Col, Form, Input, Row, Alert} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";

import store from "../../../redux/store";
import {AuthContext} from "../../../context/auth.context";
import {request} from "../../../helpers/functions/general.functions/request.helper";

import "./auth.css";
import {ActionCreator} from "../../../redux/combineActions";

export const AuthComponent = ({setRegForm, setChangePass}) => {
    const alert = useSelector(state => state.reducerAuth.regAlert);   // Получаем из флаг показао алерта  из хранилища

    const [loadingLogin, setLoadingLogin] = useState(false);

    const auth = useContext(AuthContext);

    // Нажатие на кнопку "Войти"
    const login = async (values) => {
        try {
            setLoadingLogin(true);

            const data = await request("/api/auth/login", "POST", values);

            setLoadingLogin(false);

            if (data) {
                store.dispatch(ActionCreator.ActionCreatorAuth.setAlert(false));    // Убираем флаг показа алерта
                auth.login(data.token, data.userId, data.user);
            }
        } catch (e) {
            // При ошибке от сервера, останавливаем спиннер загрузки
            setLoadingLogin(false);
        }
    };

    return (
        <Row align="middle" justify="center" style={{height: "100vh"}}>
            <Col>
                <Card title="Авторизация" style={{width: 400}}>
                    {
                        alert
                            ? <Alert style={{marginBottom: "20px"}} type="success" message="Вы успешно зарегистрированы. Можно начинать работать после одобрения администратором" />
                            : null
                    }

                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{remember: true,}}
                        onFinish={login}
                    >
                        <Form.Item name="userName" rules={[{
                            required: true,
                            transform: value => value.trim(),
                            message: "Введите логин"
                        }]}>
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Логин"/>
                        </Form.Item>
                        <Form.Item name="password" rules={[{
                            required: true,
                            transform: value => value.trim(),
                            message: "Введите пароль"
                        }]}>
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="Пароль"/>
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Запомнить меня</Checkbox>
                            </Form.Item>

                            <Link className="login-form-forgot" to="/change-password" onClick={() => {
                                setRegForm(false);
                                setChangePass(true);
                            }}>
                                Забыл(а) пароль
                            </Link>
                        </Form.Item>

                        <Form.Item>
                            <Button loading={loadingLogin} type="primary" htmlType="submit" className="login-form-button">
                                Войти
                            </Button>
                            Или <Link to="/register" onClick={() => {
                            setRegForm(true);
                            setChangePass(false);
                        }}>зарегистрируйтесь сейчас</Link>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}