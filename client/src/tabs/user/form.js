// Компонент формы записи раздела "Пользователи"
import React, {useEffect, useState} from "react";
import {Button, Card, Checkbox, Col, Form, Input, Row, Select, Tooltip} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import MaskedInput from "antd-mask-input";
import {useSelector} from "react-redux";

import {getOptions, onFailed, TabButtons} from "../tab.functions";
import {UserRoute} from "../../routes/route.User";
import store from "../../redux/store";
import {ActionCreator} from "../../redux/combineActions";
import {openRecordTab} from "../../helpers/mappers/tabs.mappers/table.helper";
import {checkRoleUser} from "../../helpers/mappers/general.mappers/checkRoleUser";
import onRemove from "../../helpers/functions/general.functions/removeTab";

export const UserForm = ({item}) => {
    const people = useSelector(state => state.reducerPerson.people);

    // Получаем объект пользователя
    const user = store.getState().reducerAuth.user;

    // Инициализация состояния для показа спиннера загрузки при сохранении и удалении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Инициализация состояния для валидации выпадающих списков
    const [validateStatus, setValidateStatus] = useState(null);

    // Создание состояний для списка ролей
    const [checkboxOptions, setCheckboxOptions] = useState([]);

    // Инициализация заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание пользователя" : "Редактирование пользователя";

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        const roles = store.getState().reducerRole.roles;   // Получение списка ролей из хранилища

        // Получаем список всех чекбоксов (ролей)
        if (roles && roles.length) {
            const result = [];

            roles.forEach(role => {
                result.push({label: role.name, value: role._id});
            });

            setCheckboxOptions(result);
        }

        // Получаем массив выбранных чекбоксов (ролей)
        let defaultChecked = [];

        if (item.roles && item.roles.length) {
            item.roles.forEach(role => {
                defaultChecked.push(role._id);
            });
        }

        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            password: "",
            checkPassword: "",
            userName: item.userName.trim(),
            person: item.person ? item.person._id : null,
            firstName: item.firstName.trim(),
            secondName: item.secondName.trim(),
            email: item.email.trim(),
            phone: item.phone,
            mailing: item.mailing,
            sms: item.sms,
            approved: item.approved,
            roles: defaultChecked
        });
    }, [item, form]);

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        const people = store.getState().reducerPerson.people;     // Получаем весь персонал из хранилища
        const roles = store.getState().reducerRole.roles;     // Получаем все роли из хранилища

        // Отправляем объект выбранного сотрудника
        values.person = people.find(person => person._id === values.person);

        // Обновляем поле roles
        if (values.roles && values.roles.length) {
            const result = [];

            values.roles.forEach(roleId => {
                const currentRole = roles.find(role => role._id === roleId);

                if (currentRole) result.push(currentRole);
            });

            values.roles = result;
        }

        await UserRoute.save(values, setLoadingSave);
    }

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) =>
        await UserRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm);

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    className="form-styles"
                    name="user-item"
                    layout="vertical"
                    onFinishFailed={onFailed}
                    onFinish={saveHandler}
                >
                    <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                    <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>

                    <Row justify="space-between" gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                rules={[{
                                    required: true,
                                    transform: value => value.trim(),
                                    message: "Заполните имя пользователя",
                                    max: 255,
                                    type: "string"
                                }]}
                                label="Имя пользователя"
                                name="userName"
                            >
                                <Input type="text" onChange={e => form.setFieldsValue({userName: e.target.value})}/>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Сотрудник"
                                name="person"
                                className="person-item"
                                rules={[
                                    {required: true, message: ""},
                                    () => ({
                                        validator(_, value) {
                                            // Получение персонала из редакса для валидации выпадающих списков
                                            const people = store.getState().reducerPerson.people;

                                            if (people && people.length && people.find(person => person._id === value)) {
                                                setValidateStatus(null);
                                                return Promise.resolve();
                                            } else {
                                                // Показываем сообщение валидации
                                                const validateDiv = window.document
                                                    .querySelector(".person-item .ant-form-item-explain-error");

                                                if (validateDiv) {
                                                    validateDiv.style.display = "block";
                                                }

                                                // Убираем отступ блока
                                                window.document
                                                    .querySelector(".person-item")
                                                    .style
                                                    .marginBottom = "0";

                                                setValidateStatus("error");
                                                return Promise.reject("Выберите сотрудника из списка");
                                            }
                                        },
                                    }),
                                ]}
                                validateStatus={validateStatus}
                            >
                                <Row>
                                    <Col xs={{span: 18}} sm={{span: 18}} md={{span: 20}} lg={{span: 20}}
                                         xl={{span: 20}}>
                                        <Form.Item name="person" noStyle>
                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                options={getOptions(people)}
                                                onChange={_id => {
                                                    const people = store.getState().reducerPerson.people;

                                                    const foundPeople = people.find(person => person._id === _id);

                                                    form.setFieldsValue({person: foundPeople ? foundPeople._id : null});

                                                    if (foundPeople) {
                                                        // Скрываем сообщение валидации
                                                        const validateDiv = window.document
                                                            .querySelector(".person-item .ant-form-item-explain-error");

                                                        if (validateDiv) {
                                                            validateDiv.style.display = "none";
                                                        }

                                                        // Добавляем нормальный отступ блоку
                                                        window.document
                                                            .querySelector(".person-item")
                                                            .style
                                                            .marginBottom = "24px";

                                                        // Обновляем статус валидации
                                                        setValidateStatus(null);
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={{span: 6}} sm={{span: 6}} md={{span: 4}} lg={{span: 4}} xl={{span: 4}}>
                                        {
                                            checkRoleUser("users", user).edit
                                                ? <Button
                                                    className="button-add-select"
                                                    onClick={() => {
                                                        // Получаем все роли из хранилища
                                                        const roles = store.getState().reducerRole.roles;

                                                        const obj = form.getFieldsValue(true);
                                                        let result = [];

                                                        if (obj.roles && obj.roles.length) {
                                                            obj.roles.forEach(roleId => {
                                                                const findRole = roles.find(rl => rl._id === roleId);

                                                                if (findRole) result.push(findRole);
                                                            })
                                                        }

                                                        obj.roles = result;

                                                        store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldPerson({
                                                            key: "userPerson",
                                                            formValues: obj
                                                        }));

                                                        openRecordTab("people", "-1");
                                                    }}
                                                    icon={<PlusOutlined/>}
                                                    type="secondary"
                                                    disabled={false}
                                                />
                                                : <Tooltip title="У вас нет прав" color="#ff7875">
                                                    <Button
                                                        className="button-add-select"
                                                        onClick={() => {
                                                            store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldPerson({
                                                                key: "userPerson",
                                                                formValues: form.getFieldsValue(true)
                                                            }));

                                                            openRecordTab("people", "-1");
                                                        }}
                                                        icon={<PlusOutlined/>}
                                                        type="secondary"
                                                        disabled={true}
                                                    />
                                                </Tooltip>
                                        }
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>

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
                                <Input type="text" onChange={e => form.setFieldsValue({firstName: e.target.value})}/>
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
                                <Input type="text" onChange={e => form.setFieldsValue({secondName: e.target.value})}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="space-between" gutter={8}>
                        <Col span={12}>
                            <Form.Item label="Пароль" name="password">
                                <Input.Password maxLength={255}
                                                onChange={e => form.setFieldsValue({password: e.target.value})}/>
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
                                <Input.Password maxLength={255}
                                                onChange={e => form.setFieldsValue({checkPassword: e.target.value})}/>
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
                        <Checkbox onChange={e => form.setFieldsValue({mailing: e.target.checked})}>
                            Email рассылка новых записей из журнала дефектов и отказов
                        </Checkbox>
                    </Form.Item>

                    <Form.Item name="sms" valuePropName="checked">
                        <Checkbox onChange={e => form.setFieldsValue({sms: e.target.checked})}>
                            SMS уведомления о новых записях из журнала дефектов и отказов
                        </Checkbox>
                    </Form.Item>

                    <Form.Item name="approved" valuePropName="checked">
                        <Checkbox onChange={e => form.setFieldsValue({approved: e.target.checked})}>
                            Одобрен
                        </Checkbox>
                    </Form.Item>

                    <Form.Item label="Роли" name="roles" rules={[{
                        required: true,
                        message: "Выберите роль"
                    }]}>
                        {
                            checkboxOptions && checkboxOptions.length
                                ? <Checkbox.Group options={checkboxOptions} />
                                : <p>Ролей на данный момент нет</p>
                        }
                    </Form.Item>

                    <TabButtons
                        loadingSave={loadingSave}
                        item={item}
                        deleteHandler={deleteHandler}
                        cancelHandler={() => onRemove("userItem", "remove")}
                    />
                </Form>
            }
        />
    )
}