import React, {useContext} from 'react';
import {Button, Card, Col, Form, Input, message, Row} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/authContext";

export const RegistrationComponent = () => {
    const {request, loading} = useHttp();
    const auth = useContext(AuthContext);

    const onFinish = async (values) => {
        const data = await request('/api/auth/register', 'POST', values);

        message.success(data.message);
        auth.login(data.token, data.userId, data.candidate);
    };

    return (
        <Row align="middle" justify="center" style={{height: '100vh'}}>
            <Col>
                <Card title="Регистрация" style={{width: 400}}>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="login"
                            rules={[
                                {
                                    required: true,
                                    message: 'Введите логин',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Логин"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Введите пароль',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>}
                                            placeholder="Введите пароль"/>
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Подтвердите пароль',
                                },
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject('Введенные пароли не совпадают!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>}
                                            placeholder="Подтвердите пароль"/>
                        </Form.Item>
                        <Form.Item>
                            <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">
                                Зарегистрироваться
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}