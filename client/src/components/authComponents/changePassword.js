import React from 'react';
import {Button, Card, Col, Form, Input, Row} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";

export const ChangePasswordComponent = () => {
    let history = useHistory();

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        history.push("/authorization")
    };

    return (
        <Row align="middle" justify="center" style={{height: '100vh'}}>
            <Col>
                <Card title="Смена пароля" style={{width: 400}}>
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
                                            placeholder="Введите новый пароль"/>
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
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Изменить пароль
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}