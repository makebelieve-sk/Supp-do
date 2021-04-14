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
    const [options, setOptions] = useState(item.person ? [{label: item.person.name, value: item.person._id}] : emptyDropdown);

    // Инициализация состояния для показа спиннера загрузки при сохранении и удалении записи
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(false);

    // Инициализация заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание пользователя" : "Редактирование пользователя";

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // Получаем функцию удаления вкладки onRemove из контекста
    const onRemove = useContext(DeleteTabContext);

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        // Обновление выпадающих списков
        setOptions(item.person ? [{label: item.person.name, value: item.person._id}] : emptyDropdown);

        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            password: "",
            checkPassword: "",
            userName: item.userName.trim(),
            person: item.person ? item.person._id : null,
            name: item.name.trim(),
            surName: item.surName.trim(),
            email: item.email.trim(),
            mailing: item.mailing,
            approved: item.approved,
            roleAdmin: item.roleAdmin,
            roleUser: item.roleUser,
        });
    }, [item, form]);

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        const people = store.getState().reducerPerson.people;

        values.department = people.find(person => person._id === values.person);
        console.log(values);

        // await UserRoute.save(values, setLoadingSave, onRemove);
    }

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await UserRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove);
    };

    const cancelHandler = () => UserRoute.cancel(onRemove);

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    className="form-styles"
                    name="user-item"
                    labelCol={{span: 6}} wrapperCol={{span: 18}}
                    onFinishFailed={onFailed}
                    onFinish={saveHandler}
                >
                    <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                    <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>

                    <Row justify="space-between" gutter={8}>
                        <Col span={12}>
                            <Form.Item rules={[{required: true, message: "Заполните имя пользователя!"}]} label="Имя пользователя" name="userName">
                                <Input type="text" maxLength={255} onChange={e => form.setFieldsValue({userName: e.target.value})} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Сотрудник"
                                name="person"
                                rules={[{required: true, message: "Выберите сотрудника!"}]}
                            >
                                <Row>
                                    <Col xs={{span: 18}} sm={{span: 18}} md={{span: 20}} lg={{span: 20}} xl={{span: 20}}>
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
                            <Form.Item label="Имя" name="name" rules={[{required: true, message: "Заполните имя!"}]}>
                                <Input type="text" onChange={e => form.setFieldsValue({name: e.target.value})} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Фамилия" name="surName" rules={[{required: true, message: "Заполните фамилию!"}]}>
                                <Input type="text" onChange={e => form.setFieldsValue({surName: e.target.value})} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="space-between" gutter={8}>
                        <Col span={12}>
                            <Form.Item label="Пароль" name="password">
                                <Input type="password" maxLength={255} onChange={e => form.setFieldsValue({password: e.target.value})} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Подтверждение пароля" name="checkPassword">
                                <Input type="password" maxLength={255} onChange={e => form.setFieldsValue({checkPassword: e.target.value})} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Электронная почта" name="email">
                        <Input type="email" maxLength={255} onChange={e => form.setFieldsValue({email: e.target.value})} />
                    </Form.Item>

                    <Form.Item name="mailing" valuePropName="checked" noStyle>
                        <Checkbox onChange={e => form.setFieldsValue({mailing: e.target.checked})}>
                            Рассылка новых записей из журнала дефектов и отказов
                        </Checkbox>
                    </Form.Item>

                    <Form.Item name="approved" valuePropName="checked" noStyle>
                        <Checkbox onChange={e => form.setFieldsValue({approved: e.target.checked})}>
                            Одобрен
                        </Checkbox>
                    </Form.Item>

                    <Form.Item label="Роли">
                        <Form.Item name="roleAdmin" valuePropName="checked" noStyle>
                            <Checkbox onChange={e => form.setFieldsValue({roleAdmin: e.target.checked})}>
                                Администраторы
                            </Checkbox>
                        </Form.Item>

                        <Form.Item name="roleUser" valuePropName="checked" noStyle>
                            <Checkbox onChange={e => form.setFieldsValue({roleUser: e.target.checked})}>
                                Зарегистрированные пользователи
                            </Checkbox>
                        </Form.Item>
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