// Компонент формы записи раздела "Пользователи"
import React, {useContext, useEffect, useMemo, useState} from "react";
import {Button, Card, Checkbox, Col, Form, Input, Row, Select} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {dropdownRender, onFailed, TabButtons} from "../tab.functions";
import {DeleteTabContext} from "../../context/deleteTab.context";
import {UserRoute} from "../../routes/route.User";
import store from "../../redux/store";
import {ActionCreator} from "../../redux/combineActions";
import {openRecordTab} from "../../helpers/mappers/tabs.mappers/table.helper";

export const UserForm = ({item}) => {
    // Пустое значение выпадающего списка
    const emptyDropdown = useMemo(() => [{label: "Не выбрано", value: null}], []);

    // Создание состояний для значений в выпадающих списках "Подразделения" и "Профессии"
    const [options, setOptions] = useState(item.person ? [{
        label: item.person.name,
        value: item.person._id
    }] : emptyDropdown);

    // Инициализация состояния для показа спиннера загрузки при сохранении и удалении записи
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(false);

    // Создание состояний для списка ролей
    const [checkboxOptions, setCheckboxOptions] = useState([]);

    // Инициализация заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание пользователя" : "Редактирование пользователя";

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // Получаем функцию удаления вкладки onRemove из контекста
    const onRemove = useContext(DeleteTabContext);

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        // Обновление выпадающего списка
        setOptions(item.person ? [{label: item.person.name, value: item.person._id}] : emptyDropdown);

        const roles = store.getState().reducerRole.roles;   // Получение списка ролей из хранилища

        // Получаем список всех чекбоксов (ролей)
        if (roles && roles.length) {
            const result = [];

            roles.forEach(role => {
                result.push(role.name);
            });

            setCheckboxOptions(result);
        }

        // Получаем массив выбранных чекбоксов (ролей)
        let defaultChecked = [];

        if (item.roles && item.roles.length) {
            item.roles.forEach(role => {
                defaultChecked.push(role.name);
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
            mailing: item.mailing,
            approved: item.approved,
            checkboxGroup: defaultChecked
        });
    }, [item, form, emptyDropdown]);

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        const people = store.getState().reducerPerson.people;     // Получаем весь персонал из хранилища
        const roles = store.getState().reducerRole.roles;     // Получаем все роли из хранилища

        // Отправляем объект выбранного сотрудника
        values.person = people.find(person => person._id === values.person);
        values.roles = [];  // Создаем поле roles

        // Обновляем поле roles
        if (values.checkboxGroup && values.checkboxGroup.length) {
            const result = [];

            values.checkboxGroup.forEach(checkbox => {
                const currentRole = roles.find(role => role.name === checkbox);

                if (currentRole) result.push(currentRole);
            });

            values.roles = result;
        }

        delete values.checkboxGroup; // Удаляем поле checkboxGroup

        await UserRoute.save(values, setLoadingSave, onRemove);
    }

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) =>
        await UserRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove);

    const cancelHandler = () => UserRoute.cancel(onRemove);

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    className="form-styles"
                    name="user-item"
                    onFinishFailed={onFailed}
                    onFinish={saveHandler}
                    layout="vertical"
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
                                rules={[{required: true, message: "Выберите сотрудника"}]}
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
                                                options={options}
                                                onDropdownVisibleChange={open => dropdownRender(open, setLoadingOptions, setOptions, "people")}
                                                loading={loadingOptions}
                                                onChange={_id => {
                                                    const people = store.getState().reducerPerson.people;

                                                    const foundPeople = people.find(person => person._id === _id);

                                                    form.setFieldsValue({person: foundPeople ? foundPeople._id : null});
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={{span: 6}} sm={{span: 6}} md={{span: 4}} lg={{span: 4}} xl={{span: 4}}>
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
                                        />
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

                    <Form.Item label="Электронная почта" name="email">
                        <Input type="email" maxLength={255}
                               onChange={e => form.setFieldsValue({email: e.target.value})}/>
                    </Form.Item>

                    <Form.Item name="mailing" valuePropName="checked">
                        <Checkbox onChange={e => form.setFieldsValue({mailing: e.target.checked})}>
                            Рассылка новых записей из журнала дефектов и отказов
                        </Checkbox>
                    </Form.Item>

                    <Form.Item name="approved" valuePropName="checked">
                        <Checkbox onChange={e => form.setFieldsValue({approved: e.target.checked})}>
                            Одобрен
                        </Checkbox>
                    </Form.Item>

                    <Form.Item label="Роли" name="checkboxGroup" rules={[{
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
                        cancelHandler={cancelHandler}
                    />
                </Form>
            }
        />
    )
}