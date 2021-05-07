// Компонент формы записи раздела "Персонал"
import React, {useContext, useEffect, useMemo, useState} from "react";
import {Button, Card, Col, Form, Input, Row, Select, Tooltip} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import store from "../../redux/store";
import {PersonRoute} from "../../routes/route.Person";
import {DeleteTabContext} from "../../context/deleteTab.context";
import {dropdownRender, onFailed, TabButtons} from "../tab.functions";
import {openRecordTab} from "../../helpers/mappers/tabs.mappers/table.helper";
import {getParents} from "../../helpers/functions/general.functions/replaceField";
import {ActionCreator} from "../../redux/combineActions";
import {checkRoleUser} from "../../helpers/mappers/general.mappers/checkRoleUser";

export const PersonForm = ({item}) => {
    // Пустое значение выпадающего списка
    const emptyDropdown = useMemo(() => [{label: "Не выбрано", value: null}], []);

    const departments = store.getState().reducerDepartment.departments; // Получаем список подразделений
    const user = store.getState().reducerAuth.user; // Получаем объект пользователя

    // Создание состояний для значений в выпадающих списках "Подразделения" и "Профессии"
    const [departmentsOptions, setDepartmentsOptions] = useState(item.department ? [{
        label: getParents(item.department, departments) + item.department.name,
        value: item.department._id
    }] : emptyDropdown);
    const [professionsOptions, setProfessionsOptions] = useState(item.profession ? [{
        label: item.profession.name,
        value: item.profession._id
    }] : emptyDropdown);

    // Инициализация состояний для показа спиннера загрузки при сохранении записи и в выпадающих меню
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingDepartment, setLoadingDepartment] = useState(false);
    const [loadingSelectProfession, setLoadingSelectProfession] = useState(false);

    // Создание хука form
    const [form] = Form.useForm();

    // Получаем функцию удаления вкладки onRemove из контекста
    const onRemove = useContext(DeleteTabContext);

    // Изменение значений формы
    useEffect(() => {
        const departments = store.getState().reducerDepartment.departments;

        // Обновление выпадающих списков
        setDepartmentsOptions(item.department ? [{
            label: getParents(item.department, departments) + item.department.name,
            value: item.department._id
        }] : emptyDropdown);
        setProfessionsOptions(item.profession ? [{
            label: item.profession.name,
            value: item.profession._id
        }] : emptyDropdown);

        // Установка значений формы
        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            name: item.name.trim(),
            notes: item.notes.trim(),
            department: item.department ? item.department._id : null,
            profession: item.profession ? item.profession._id : null
        });
    }, [form, item, emptyDropdown]);

    // Создание заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание записи о сотруднике" : "Редактирование записи о сотруднике";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        // Устанавливаем спиннер загрузки
        setLoadingSave(true);

        const professions = store.getState().reducerProfession.professions;
        const departments = store.getState().reducerDepartment.departments;

        values.department = departments.find(department => department._id === values.department);
        values.profession = professions.find(profession => profession._id === values.profession);

        await PersonRoute.save(values, setLoadingSave, onRemove);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await PersonRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove);
    };

    const cancelHandler = () => PersonRoute.cancel(onRemove);

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    labelCol={{span: 6}} wrapperCol={{span: 18}}
                    className="form-styles"
                    name="person-item"
                    onFinish={saveHandler}
                    onFinishFailed={onFailed}
                >
                    <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                    <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>

                    <Form.Item label="ФИО" name="name" rules={[{
                        required: true,
                        transform: value => value.trim(),
                        message: "Введите ФИО"
                    }]}>
                        <Input maxLength={255} type="text" onChange={e => form.setFieldsValue({name: e.target.value})}/>
                    </Form.Item>

                    <Form.Item label="Подразделение" name="department"
                               rules={[{required: true, message: "Выберите подразделение!"}]}>
                        <Row>
                            <Col xs={{span: 21}} sm={{span: 21}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                <Form.Item name="department" noStyle>
                                    <Select
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        options={departmentsOptions}
                                        onDropdownVisibleChange={open => dropdownRender(open, setLoadingDepartment, setDepartmentsOptions, "departments")}
                                        loading={loadingDepartment}
                                        onChange={_id => {
                                            const departments = store.getState().reducerDepartment.departments;

                                            const foundDepartment = departments.find(department => department._id === _id);

                                            form.setFieldsValue({department: foundDepartment ? foundDepartment._id : null});
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={{span: 3}} sm={{span: 3}} md={{span: 2}} lg={{span: 2}} xl={{span: 2}}>
                                {
                                    checkRoleUser("professions", user).edit
                                        ? <Button
                                            className="button-add-select"
                                            onClick={() => {
                                                store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldDepartment({
                                                    key: "personDepartment",
                                                    formValues: form.getFieldsValue(true)
                                                }));

                                                openRecordTab("departments", "-1");
                                            }}
                                            icon={<PlusOutlined/>}
                                            type="secondary"
                                            disabled={false}
                                        />
                                        : <Tooltip title="У вас нет прав" color="#ff7875">
                                            <Button
                                                className="button-add-select"
                                                onClick={() => {
                                                    store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldDepartment({
                                                        key: "personDepartment",
                                                        formValues: form.getFieldsValue(true)
                                                    }));

                                                    openRecordTab("departments", "-1");
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

                    <Form.Item label="Профессия" name="profession"
                               rules={[{required: true, message: "Выберите профессию!"}]}>
                        <Row>
                            <Col xs={{span: 21}} sm={{span: 21}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                <Form.Item name="profession" noStyle>
                                    <Select
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        options={professionsOptions}
                                        onDropdownVisibleChange={open => dropdownRender(open, setLoadingSelectProfession, setProfessionsOptions, "professions")}
                                        loading={loadingSelectProfession}
                                        onChange={_id => {
                                            const professions = store.getState().reducerProfession.professions;

                                            const foundProfession = professions.find(profession => profession._id === _id);

                                            form.setFieldsValue({profession: foundProfession ? foundProfession._id : null});
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={{span: 3}} sm={{span: 3}} md={{span: 2}} lg={{span: 2}} xl={{span: 2}}>
                                {
                                    checkRoleUser("professions", user).edit
                                        ? <Button
                                            className="button-add-select"
                                            onClick={() => {
                                                store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldProfession({
                                                    key: "personProfession",
                                                    formValues: form.getFieldsValue(true)
                                                }));

                                                openRecordTab("professions", "-1");
                                            }}
                                            icon={<PlusOutlined/>}
                                            type="secondary"
                                            disabled={false}
                                        />
                                        : <Tooltip title="У вас нет прав" color="#ff7875">
                                            <Button
                                                className="button-add-select"
                                                onClick={() => {
                                                    store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldProfession({
                                                        key: "personProfession",
                                                        formValues: form.getFieldsValue(true)
                                                    }));

                                                    openRecordTab("professions", "-1");
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

                    <Form.Item name="notes" label="Примечание">
                        <Input maxLength={255} type="text"
                               onChange={e => form.setFieldsValue({notes: e.target.value})}/>
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