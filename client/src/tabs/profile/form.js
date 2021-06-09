// Компонент вкладки "Профиль"
import React, {useEffect, useState} from "react";
import {Card, Checkbox, Col, Form, Input, Row, Select} from "antd";
import MaskedInput from "antd-mask-input";

import {ProfileRoute} from "../../routes/route.Profile";
import {onFailed, TabButtons} from "../tab.functions";
import onRemove from "../../helpers/functions/general.functions/removeTab";

import "./profile.css";

export const ProfileComponent = ({item}) => {
    // Инициализация состояния для показа спиннера загрузки при сохранении и удалении записи
    const [loadingSave, setLoadingSave] = useState(false);
    const [disabled, setDisabled] = useState(false);

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // Выпадающий список для расположения меню
    const typeMenu = [{label: "Слева", value: "left"}, {label: "Сверху", value: "top"}];

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        form.setFieldsValue({
            _id: item._id,
            password: "",
            checkPassword: "",
            userName: item.userName.trim(),
            firstName: item.firstName.trim(),
            secondName: item.secondName.trim(),
            email: item.email.trim(),
            phone: item.phone,
            mailing: item.mailing,
            sms: item.sms,
            typeMenu: item.typeMenu && item.typeMenu[0].value ? item.typeMenu[0].value : "left",
        });

        const mode = JSON.parse(localStorage.getItem("mode"));

        if (mode && mode === "demo") setDisabled(true);
    }, [form, item]);

    // Нажатие на кнопку "Сохранить"
    const saveHandler = async (values) => {
        delete values.checkPassword;

        const newTypeMenu = typeMenu.find(type => type.value === values.typeMenu);

        values.typeMenu = [];
        values.typeMenu.push(newTypeMenu);

        await ProfileRoute.save(values, setLoadingSave);
    };

    return (
        <Card.Meta
            title="Изменение профиля"
            description={
                <Form
                    className="form-styles"
                    name="profile-item"
                    layout="vertical"
                    onFinishFailed={onFailed}
                    onFinish={saveHandler}
                    form={form}
                >
                    <Form.Item name="_id" hidden={true}><Input/></Form.Item>

                    <Form.Item
                        label="Имя пользователя"
                        name="userName"
                        rules={[{
                            required: true,
                            transform: value => value.trim(),
                            message: "Заполните имя пользователя",
                            max: 255,
                            type: "string"
                        }]}
                    >
                        <Input
                            disabled={disabled}
                            type="text"
                            onChange={e => form.setFieldsValue({userName: e.target.value})}
                        />
                    </Form.Item>

                    <Row justify="space-between" gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                label="Имя"
                                name="firstName"
                                rules={[{
                                    required: true,
                                    transform: value => value.trim(),
                                    message: "Заполните имя"
                                }]}>
                                <Input type="text"
                                       onChange={e => form.setFieldsValue({firstName: e.target.value})}/>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Фамилия"
                                name="secondName"
                                rules={[{
                                    required: true,
                                    transform: value => value.trim(),
                                    message: "Заполните фамилию"
                                }]}>
                                <Input type="text"
                                       onChange={e => form.setFieldsValue({secondName: e.target.value})}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="space-between" gutter={8}>
                        <Col span={12}>
                            <Form.Item label="Пароль" name="password">
                                <Input.Password
                                    disabled={disabled}
                                    maxLength={255}
                                    onChange={e => form.setFieldsValue({password: e.target.value})}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Подтверждение пароля"
                                name="checkPassword"
                                dependencies={["password"]}
                                hasFeedback
                                rules={[
                                    ({getFieldValue}) => ({
                                        validator(_, value) {
                                            if (getFieldValue("password") === value) {
                                                return Promise.resolve();
                                            }

                                            return Promise.reject("Введенные пароли не совпадают!");
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    disabled={disabled}
                                    maxLength={255}
                                    onChange={e => form.setFieldsValue({checkPassword: e.target.value})}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Электронная почта" name="email" rules={[{
                        required: true,
                        transform: value => value.trim(),
                        message: "Укажите email",
                        max: 255,
                        type: "string"
                    }]}>
                        <Input type="email" maxLength={255} onChange={e =>
                            form.setFieldsValue({email: e.target.value})}/>
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
                        <MaskedInput mask="+7 (111) 111-11-11" name="phone" size="11" onChange={e => {
                            const phone = e.target.value
                                .replace("+", "")
                                .replaceAll("(", "")
                                .replaceAll(")", "")
                                .replaceAll("-", "")
                                .replaceAll(" ", "")
                                .replaceAll("_", "");

                            form.setFieldsValue({phone});
                        }}/>
                    </Form.Item>

                    <Form.Item name="mailing" valuePropName="checked">
                        <Checkbox disabled={disabled} onChange={e => form.setFieldsValue({mailing: e.target.checked})}>
                            Email рассылка новых записей из журнала дефектов и отказов
                        </Checkbox>
                    </Form.Item>

                    <Form.Item name="sms" valuePropName="checked">
                        <Checkbox disabled={disabled} onChange={e => form.setFieldsValue({sms: e.target.checked})}>
                            SMS уведомления о новых записях из журнала дефектов и отказов
                        </Checkbox>
                    </Form.Item>

                    <Form.Item
                        label="Расположение меню"
                        name="typeMenu"
                        rules={[{required: true, message: "Выберите расположение меню"}]}
                    >
                        <Select
                            options={typeMenu}
                            onChange={value => {
                                const foundType = typeMenu.find(type => type.value === value);

                                form.setFieldsValue({typeMenu: foundType.value});
                            }}
                        />
                    </Form.Item>

                    <TabButtons
                        loadingSave={loadingSave}
                        cancelHandler={() => onRemove("profile", "remove")}
                    />
                </Form>
            }
        />
    )
}