// Компонент формы записи раздела "Журнал дефектов и отказов"
import moment from "moment";
import React, {useState, useEffect} from "react";
import {Button, Checkbox, Col, DatePicker, Form, Input, Row, Select, Tabs, Card, Tooltip} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {UploadComponent} from "../../components/tab.components/upload";
import {LogDORoute} from "../../routes/route.LogDO";
import {getOptions, onFailed, TabButtons} from "../tab.functions";
import {openRecordTab} from "../../helpers/mappers/tabs.mappers/table.helper";
import TabOptions from "../../options/tab.options/record.options";
import store from "../../redux/store";
import {ActionCreator} from "../../redux/combineActions";
import {checkRoleUser} from "../../helpers/mappers/general.mappers/checkRoleUser";

export const LogDoForm = ({item}) => {
    // Инициализация стейта для показа спиннера загрузки при изменении записи
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);

    // Инициализация состояний для валидации выпадающих списков
    const [validateStatusApplicant, setValidateStatusApplicant] = useState(null);
    const [validateStatusEquipment, setValidateStatusEquipment] = useState(null);
    const [validateStatusResponsible, setValidateStatusResponsible] = useState(null);
    const [validateStatusDepartment, setValidateStatusDepartment] = useState(null);
    const [validateStatusTaskStatus, setValidateStatusTaskStatus] = useState(null);

    // Получаем объект пользователя
    const user = store.getState().reducerAuth.user;

    // Для каждой роли, проверяем возможность принять работу (галочка "Работа принята")
    let flag = false;

    if (user && user.roles && user.roles.length) {
        user.roles.forEach(role => {
            if (role.permissions && role.permissions.length) {
                role.permissions.forEach(perm => {
                    if (perm.key === "acceptTask") {
                        flag = perm.edit;
                    }
                })
            }
        });
    }

    // Состояние отображения галочки "Работа принята"
    const [visibleAcceptTask, setVisibleAcceptTask] = useState((user.person ? user.person._id === item.applicantId : false) || flag);

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        form.setFieldsValue({
            _id: item._id,
            date: item.date ? moment(item.date, TabOptions.dateFormat) : moment(),
            isNewItem: item.isNewItem,
            notes: item.notes.trim(),
            sendEmail: item.sendEmail,
            productionCheck: item.productionCheck,
            task: item.task.trim(),
            dateDone: item.dateDone ? moment(item.dateDone, TabOptions.dateFormat) : null,
            planDateDone: item.planDateDone ? moment(item.planDateDone, TabOptions.dateFormat) : null,
            content: item.content.trim(),
            downtime: item.downtime.trim(),
            acceptTask: item.acceptTask,

            applicant: item.isNewItem && user && user.person ? user.person : item.applicant,
            department: item.department,
            equipment: item.equipment,
            responsible: item.responsible,
            taskStatus: item.taskStatus,

            applicantId: item.isNewItem && user && user.person ? user.person._id : item.applicantId ? item.applicantId : null,
            responsibleId: item.responsibleId ? item.responsibleId : null,
            departmentId: item.departmentId ? item.departmentId : null,
            equipmentId: item.equipmentId ? item.equipmentId : null,
            taskStatusId: item.taskStatusId ? item.taskStatusId : null
        });
    }, [item, form, user]);

    // Создание заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание записи в журнале дефектов и отказов" : "Редактирование записи в журнале дефектов и отказов";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async () => {
        // Устанавливаем спиннер загрузки
        setLoadingSave(true);

        // Получаем все значения формы
        const record = form.getFieldsValue(true);

        // Переприсваиваем файлы
        record.files = store.getState().reducerLogDO.files;

        // Для сохранения записи обращаемся к модели
        await LogDORoute.save(record, setLoadingSave);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await LogDORoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm);
    };

    // Обработка нажатия на кнопку "Отмена"
    const cancelHandler = () => LogDORoute.cancel(setLoadingCancel);

    // Настройка компонента UploadComponent (вкладка "Файлы")
    const uploadProps = {
        model: "logDO",
        item,
        actionCreatorAdd: ActionCreator.ActionCreatorLogDO.addFile,
        actionCreatorDelete: ActionCreator.ActionCreatorLogDO.deleteFile
    };

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    className="form-styles"
                    name="logDO-item"
                    layout="vertical"
                    onFinish={saveHandler}
                    onFinishFailed={onFailed}
                >
                    <Tabs defaultActiveKey="request">
                        <Tabs.TabPane tab="Заявка" key="request" className="tabPane-styles">
                            <Form.Item name="_id" hidden={true}><></></Form.Item>
                            <Form.Item name="isNewItem" hidden={true}><></></Form.Item>
                            <Form.Item name="applicant" hidden={true}><></></Form.Item>
                            <Form.Item name="responsible" hidden={true}><></></Form.Item>
                            <Form.Item name="equipment" hidden={true}><></></Form.Item>
                            <Form.Item name="department" hidden={true}><></></Form.Item>
                            <Form.Item name="taskStatus" hidden={true}><></></Form.Item>

                            <Row justify="space-between" gutter={8}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Дата заявки"
                                        name="date"
                                        rules={[{required: true, message: "Выберите дату!"}]}
                                    >
                                        <DatePicker
                                            showTime={{format: "HH:mm"}}
                                            format={TabOptions.dateFormat}
                                            style={{width: "100%"}}
                                            onChange={date => form.setFieldsValue({date})}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Заявитель"
                                        name="applicantId"
                                        className="applicant-item"
                                        rules={[
                                            {required: true, message: ""},
                                            () => ({
                                                validator() {
                                                    const applicant = form.getFieldValue("applicant");
                                                    const applicantId = form.getFieldValue("applicantId");

                                                    if (applicant && applicantId && applicant._id === applicantId) {
                                                        setValidateStatusApplicant(null);
                                                        return Promise.resolve();
                                                    } else {
                                                        setValidateStatusApplicant("error");
                                                        return Promise.reject("Выберите заявителя из списка");
                                                    }
                                                },
                                            }),
                                        ]}
                                        validateStatus={validateStatusApplicant}
                                    >
                                        <Row>
                                            <Col xs={{span: 18}} sm={{span: 18}} md={{span: 20}} lg={{span: 20}} xl={{span: 20}}>
                                                <Form.Item name="applicantId" noStyle>
                                                    <Select
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        options={getOptions(store.getState().reducerPerson.people)}
                                                        onChange={(value) => {
                                                            const people = store.getState().reducerPerson.people;

                                                            const foundApplicant = people.find(person => person._id === value);

                                                            if (foundApplicant) {
                                                                form.setFieldsValue({
                                                                    applicant: foundApplicant,
                                                                    applicantId: value
                                                                });

                                                                // Скрываем сообщение валидации
                                                                const validateDiv = window.document
                                                                    .querySelector(".applicant-item .ant-form-item-explain-error");

                                                                if (validateDiv) {
                                                                    validateDiv.style.display = "none";
                                                                }

                                                                // Добавляем нормальный отступ блоку
                                                                window.document
                                                                    .querySelector(".applicant-item")
                                                                    .style
                                                                    .marginBottom = "24px";

                                                                // Обновляем статус валидации
                                                                setValidateStatusApplicant(null);
                                                            }

                                                            if (user.person) {
                                                                // Обновляем отображение галочки "Работа принята"
                                                                user.person._id === value || flag
                                                                    ? setVisibleAcceptTask(true)
                                                                    : setVisibleAcceptTask(false);
                                                            }
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{span: 6}} sm={{span: 6}} md={{span: 4}} lg={{span: 4}} xl={{span: 4}}>
                                                {
                                                    checkRoleUser("people", user).edit
                                                        ? <Button
                                                            className="button-add-select"
                                                            onClick={() => {
                                                                store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldPerson({
                                                                    key: "logDOApplicant",
                                                                    formValues: form.getFieldsValue(true)
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
                                                                        key: "logDOApplicant",
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

                            <Form.Item
                                label="Оборудование"
                                name="equipmentId"
                                className="equipment-item"
                                rules={[
                                    {required: true, message: ""},
                                    () => ({
                                        validator() {
                                            const equipment = form.getFieldValue("equipment");
                                            const equipmentId = form.getFieldValue("equipmentId");

                                            if (equipment && equipmentId && equipment._id === equipmentId) {
                                                setValidateStatusEquipment(null);
                                                return Promise.resolve();
                                            } else {
                                                setValidateStatusEquipment("error");
                                                return Promise.reject("Выберите оборудование из списка");
                                            }
                                        },
                                    }),
                                ]}
                                validateStatus={validateStatusEquipment}
                            >
                                <Row>
                                    <Col xs={{span: 21}} sm={{span: 21}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                        <Form.Item name="equipmentId" noStyle>
                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                options={getOptions(store.getState().reducerEquipment.equipment)}
                                                onChange={value => {
                                                    const equipment = store.getState().reducerEquipment.equipment;

                                                    const foundEquipment = equipment.find(eq => eq._id === value);

                                                    if (foundEquipment) {
                                                        form.setFieldsValue({
                                                            equipment: foundEquipment,
                                                            equipmentId: value
                                                        });

                                                        // Скрываем сообщение валидации
                                                        const validateDiv = window.document
                                                            .querySelector(".equipment-item .ant-form-item-explain-error");

                                                        if (validateDiv) {
                                                            validateDiv.style.display = "none";
                                                        }

                                                        // Добавляем нормальный отступ блоку
                                                        window.document
                                                            .querySelector(".equipment-item")
                                                            .style
                                                            .marginBottom = "24px";

                                                        // Обновляем статус валидации
                                                        setValidateStatusEquipment(null);
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={{span: 3}} sm={{span: 3}} md={{span: 2}} lg={{span: 2}} xl={{span: 2}}>
                                        {
                                            checkRoleUser("equipment", user).edit
                                                ? <Button
                                                    className="button-add-select"
                                                    onClick={() => {
                                                        store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldEquipment({
                                                            key: "logDOEquipment",
                                                            formValues: form.getFieldsValue(true)
                                                        }));

                                                        openRecordTab("equipment", "-1");
                                                    }}
                                                    icon={<PlusOutlined/>}
                                                    type="secondary"
                                                    disabled={false}
                                                />
                                                : <Tooltip title="У вас нет прав" color="#ff7875">
                                                    <Button
                                                        className="button-add-select"
                                                        onClick={() => {
                                                            store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldEquipment({
                                                                key: "logDOEquipment",
                                                                formValues: form.getFieldsValue(true)
                                                            }));

                                                            openRecordTab("equipment", "-1");
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

                            <Form.Item label="Описание" name="notes" rules={[{
                                required: true,
                                transform: value => value.trim(),
                                message: "Введите описание заявки!"
                            }]}
                            >
                                <Input.TextArea
                                    onChange={(e) => form.setFieldsValue({notes: e.target.value})}
                                    rows={2}
                                    placeholder="Максимально 1000 символов"
                                />
                            </Form.Item>

                            <Form.Item name="sendEmail" valuePropName="checked" noStyle>
                                <Checkbox onChange={e => form.setFieldsValue({sendEmail: e.target.checked})}>
                                    Оперативное уведомление ответственных специалистов
                                </Checkbox>
                            </Form.Item>

                            <Form.Item name="productionCheck" valuePropName="checked">
                                <Checkbox onChange={e => form.setFieldsValue({productionCheck: e.target.checked})}>
                                    Производство остановлено
                                </Checkbox>
                            </Form.Item>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Выполнение" key="done" className="tabPane-styles">
                            <Row justify="space-between" gutter={8}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Исполнитель"
                                        name="responsibleId"
                                        className="responsible-item"
                                        rules={[
                                            () => ({
                                                validator(_, value) {
                                                    const responsible = form.getFieldValue("responsible");
                                                    const responsibleId = form.getFieldValue("responsibleId");

                                                    if (!value || (responsible && responsibleId && responsible._id === responsibleId)) {
                                                        setValidateStatusResponsible(null);
                                                        return Promise.resolve();
                                                    } else {
                                                        // Показываем сообщение валидации
                                                        const validateDiv = window.document
                                                            .querySelector(".responsible-item .ant-form-item-explain-error");

                                                        if (validateDiv) {
                                                            validateDiv.style.display = "block";
                                                        }

                                                        // Убираем отступ блока
                                                        window.document
                                                            .querySelector(".responsible-item")
                                                            .style
                                                            .marginBottom = "0";

                                                        setValidateStatusResponsible("error");
                                                        return Promise.reject("Выберите исполнителя из списка");
                                                    }
                                                },
                                            }),
                                        ]}
                                        validateStatus={validateStatusResponsible}
                                    >
                                        <Row>
                                            <Col xs={{span: 18}} sm={{span: 18}} md={{span: 20}} lg={{span: 20}} xl={{span: 20}}>
                                                <Form.Item noStyle name="responsibleId">
                                                    <Select
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        options={getOptions(store.getState().reducerPerson.people)}
                                                        onChange={(value) => {
                                                            const people = store.getState().reducerPerson.people;
                                                            const departments = store.getState().reducerDepartment.departments;

                                                            const foundResponsible = people.find(person => person._id === value);

                                                            const foundDepartment = departments.find(department => {
                                                                if (foundResponsible && foundResponsible.department) {
                                                                    return department.name === foundResponsible.department;
                                                                } else {
                                                                    return null;
                                                                }
                                                            });

                                                            form.setFieldsValue({
                                                                responsible: foundResponsible,
                                                                responsibleId: value,
                                                                department: foundDepartment ? foundDepartment : null,
                                                                departmentId: foundDepartment ? foundDepartment._id : null
                                                            });

                                                            if (foundDepartment) {
                                                                // Обновляем статус валидации подразделения
                                                                setValidateStatusDepartment(null);
                                                            }

                                                            // Скрываем сообщение валидации
                                                            const validateDiv = window.document
                                                                .querySelector(".responsible-item .ant-form-item-explain-error");

                                                            if (validateDiv) {
                                                                validateDiv.style.display = "none";
                                                            }

                                                            // Добавляем нормальный отступ блоку
                                                            window.document
                                                                .querySelector(".responsible-item")
                                                                .style
                                                                .marginBottom = "24px";

                                                            // Обновляем статус валидации
                                                            setValidateStatusResponsible(null);
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{span: 6}} sm={{span: 6}} md={{span: 4}} lg={{span: 4}} xl={{span: 4}}>
                                                {
                                                    checkRoleUser("people", user).edit
                                                        ? <Button
                                                            className="button-add-select"
                                                            onClick={() => {
                                                                store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldPerson({
                                                                    key: "logDOResponsible",
                                                                    formValues: form.getFieldsValue(true)
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
                                                                        key: "logDOResponsible",
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
                                <Col span={12}>
                                    <Form.Item
                                        label="Подразделение"
                                        name="departmentId"
                                        className="department-item"
                                        rules={[
                                            () => ({
                                                validator(_, value) {
                                                    const department = form.getFieldValue("department");
                                                    const departmentId = form.getFieldValue("departmentId");

                                                    if (!value || (department && departmentId && department._id === departmentId)) {
                                                        setValidateStatusDepartment(null);
                                                        return Promise.resolve();
                                                    } else {
                                                        // Показываем сообщение валидации
                                                        const validateDiv = window.document
                                                            .querySelector(".department-item .ant-form-item-explain-error");

                                                        if (validateDiv) {
                                                            validateDiv.style.display = "block";
                                                        }

                                                        // Убираем отступ блока
                                                        window.document
                                                            .querySelector(".department-item")
                                                            .style
                                                            .marginBottom = "0";

                                                        setValidateStatusDepartment("error");
                                                        return Promise.reject("Выберите подразделение из списка");
                                                    }
                                                },
                                            }),
                                        ]}
                                        validateStatus={validateStatusDepartment}
                                    >
                                        <Row>
                                            <Col xs={{span: 18}} sm={{span: 18}} md={{span: 20}} lg={{span: 20}} xl={{span: 20}}>
                                                <Form.Item noStyle name="departmentId">
                                                    <Select
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        options={getOptions(store.getState().reducerDepartment.departments)}
                                                        onChange={(value) => {
                                                            const departments = store.getState().reducerDepartment.departments;

                                                            const foundDepartment = departments.find(department => department._id === value);

                                                            form.setFieldsValue({
                                                                department: foundDepartment,
                                                                departmentId: value
                                                            });

                                                            // Скрываем сообщение валидации
                                                            const validateDiv = window.document
                                                                .querySelector(".department-item .ant-form-item-explain-error");

                                                            if (validateDiv) {
                                                                validateDiv.style.display = "none";
                                                            }

                                                            // Добавляем нормальный отступ блоку
                                                            window.document
                                                                .querySelector(".department-item")
                                                                .style
                                                                .marginBottom = "24px";

                                                            // Обновляем статус валидации
                                                            setValidateStatusDepartment(null);
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{span: 6}} sm={{span: 6}} md={{span: 4}} lg={{span: 4}} xl={{span: 4}}>
                                                {
                                                    checkRoleUser("departments", user).edit
                                                        ? <Button
                                                            className="button-add-select"
                                                            onClick={() => {
                                                                store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldDepartment({
                                                                    key: "logDODepartment",
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
                                                                        key: "logDODepartment",
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
                                </Col>
                            </Row>
                            <Form.Item label="Задание" name="task">
                                <Input.TextArea
                                    onChange={(e) => form.setFieldsValue({task: e.target.value})}
                                    rows={2}
                                    placeholder="Максимально 1000 символов"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Состояние"
                                name="taskStatusId"
                                className="taskStatus-item"
                                rules={[
                                    () => ({
                                        validator(_, value) {
                                            const taskStatus = form.getFieldValue("taskStatus");
                                            const taskStatusId = form.getFieldValue("taskStatusId");

                                            if (!value || (taskStatus && taskStatusId && taskStatus._id === taskStatusId)) {
                                                setValidateStatusTaskStatus(null);
                                                return Promise.resolve();
                                            } else {
                                                // Показываем сообщение валидации
                                                const validateDiv = window.document
                                                    .querySelector(".taskStatus-item .ant-form-item-explain-error");

                                                if (validateDiv) {
                                                    validateDiv.style.display = "block";
                                                }

                                                // Убираем отступ блока
                                                window.document
                                                    .querySelector(".taskStatus-item")
                                                    .style
                                                    .marginBottom = "0";

                                                setValidateStatusTaskStatus("error");
                                                return Promise.reject("Выберите состояние заявки из списка");
                                            }
                                        },
                                    }),
                                ]}
                                validateStatus={validateStatusTaskStatus}
                            >
                                <Row>
                                    <Col xs={{span: 21}} sm={{span: 21}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                        <Form.Item noStyle name="taskStatusId">
                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                options={getOptions(store.getState().reducerTask.tasks)}
                                                onChange={(value) => {
                                                    const tasks = store.getState().reducerTask.tasks;

                                                    const foundTask = tasks.find(task => task._id === value);

                                                    form.setFieldsValue({
                                                        taskStatus: foundTask,
                                                        taskStatusId: value
                                                    });

                                                    // Скрываем сообщение валидации
                                                    const validateDiv = window.document
                                                        .querySelector(".taskStatus-item .ant-form-item-explain-error");

                                                    if (validateDiv) {
                                                        validateDiv.style.display = "none";
                                                    }

                                                    // Добавляем нормальный отступ блоку
                                                    window.document
                                                        .querySelector(".taskStatus-item")
                                                        .style
                                                        .marginBottom = "24px";

                                                    // Обновляем статус валидации
                                                    setValidateStatusTaskStatus(null);
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={{span: 3}} sm={{span: 3}} md={{span: 2}} lg={{span: 2}} xl={{span: 2}}>
                                        {
                                            checkRoleUser("tasks", user).edit
                                                ?  <Button
                                                    className="button-add-select"
                                                    onClick={() => {
                                                        store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldState({
                                                            key: "logDOState",
                                                            formValues: form.getFieldsValue(true)
                                                        }));

                                                        openRecordTab("tasks", "-1");
                                                    }}
                                                    icon={<PlusOutlined/>}
                                                    type="secondary"
                                                    disabled={false}
                                                />
                                                : <Tooltip title="У вас нет прав" color="#ff7875">
                                                    <Button
                                                        className="button-add-select"
                                                        onClick={() => {
                                                            store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldState({
                                                                key: "logDOState",
                                                                formValues: form.getFieldsValue(true)
                                                            }));

                                                            openRecordTab("tasks", "-1");
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

                            <Row gutter={8} align="bottom">
                                <Col span={12}>
                                    <Form.Item label="Планируемая дата выполнения" name="planDateDone">
                                        <DatePicker
                                            onChange={date => form.setFieldsValue({planDateDone: date})}
                                            showTime={{format: "HH:mm"}}
                                            format={TabOptions.dateFormat}
                                            style={{width: "100%"}}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label="Дата выполнения" name="dateDone">
                                        <DatePicker
                                            onChange={date => form.setFieldsValue({dateDone: date})}
                                            showTime={{format: "HH:mm"}}
                                            format={TabOptions.dateFormat}
                                            style={{width: "100%"}}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Содержание работ" name="content">
                                <Input.TextArea
                                    onChange={(e) => form.setFieldsValue({content: e.target.value})}
                                    rows={2}
                                    placeholder="Максимально 1000 символов"
                                />
                            </Form.Item>

                            <Row gutter={8} justify="space-between">
                                <Col span={12}>
                                    <Form.Item label="Время простоя, мин" name="downtime">
                                        <Input
                                            onChange={(e) => form.setFieldsValue({downtime: e.target.value})}
                                            type="number"
                                            style={{textAlign: "right"}}
                                        />
                                    </Form.Item>
                                </Col>

                                {
                                    visibleAcceptTask
                                        ? <Col span={10}>
                                            <Form.Item label=" " name="acceptTask" valuePropName="checked">
                                                <Checkbox onChange={e => form.setFieldsValue({acceptTask: e.target.checked})}>
                                                    Работа принята
                                                </Checkbox>
                                            </Form.Item>
                                        </Col>
                                        : null
                                }
                            </Row>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Дополнительно" key="files" className="tabPane-styles">
                            <Form.Item name="files" wrapperCol={{span: 24}}>
                                <UploadComponent {...uploadProps}/>
                            </Form.Item>
                        </Tabs.TabPane>
                    </Tabs>

                    <TabButtons
                        loadingSave={loadingSave}
                        item={item}
                        deleteHandler={deleteHandler}
                        cancelHandler={cancelHandler}
                        loadingCancel={loadingCancel}
                        specKey="logDOItem"
                    />
                </Form>
            }
        />
    )
}