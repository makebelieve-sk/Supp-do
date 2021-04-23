// Компонент формы записи раздела "Журнал дефектов и отказов"
import moment from "moment";
import React, {useState, useEffect, useMemo, useContext} from "react";
import {Button, Checkbox, Col, DatePicker, Form, Input, Row, Select, Tabs, Card, Tooltip} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {UploadComponent} from "../../components/tab.components/upload/upload.component";
import {LogDORoute} from "../../routes/route.LogDO";
import {dropdownRender, onFailed, TabButtons} from "../tab.functions";
import {openRecordTab} from "../../helpers/mappers/tabs.mappers/table.helper";
import TabOptions from "../../options/tab.options/record.options/record.options";
import store from "../../redux/store";
import {ActionCreator} from "../../redux/combineActions";
import {DeleteTabContext} from "../../context/deleteTab.context";
import {getParents} from "../../helpers/functions/general.functions/replaceField";
import {checkRoleUser} from "../../helpers/mappers/general.mappers/checkRoleUser";

export const LogDoForm = ({item}) => {
    // Инициализация стейта для показа спиннера загрузки при изменении записи, обновлении выпадающих списков
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [loadingDepartment, setLoadingDepartment] = useState(false);
    const [loadingApplicant, setLoadingApplicant] = useState(false);
    const [loadingEquipment, setLoadingEquipment] = useState(false);
    const [loadingResponsible, setLoadingResponsible] = useState(false);
    const [loadingState, setLoadingState] = useState(false);

    // Пустое значение выпадающего списка
    const emptyDropdown = useMemo(() => [{label: "Не выбрано", value: null}], []);

    const user = store.getState().reducerAuth.user; // Получаем объект пользователя

    // Инициализация значений для выпадающих списков
    const [departments, setDepartments] = useState(item.department ? [{label: item.department.name, value: item.department._id}] : emptyDropdown);
    const [applicant, setApplicant] = useState(item.applicant ? [{label: item.applicant.name, value: item.applicant._id}] : emptyDropdown);
    const [equipment, setEquipment] = useState(item.equipment ? [{label: item.equipment.name, value: item.equipment._id}] : emptyDropdown);
    const [responsible, setResponsible] = useState(item.responsible ? [{label: item.responsible.name, value: item.responsible._id}] : emptyDropdown);
    const [taskStatus, setState] = useState(item.taskStatus ? [{label: item.taskStatus.name, value: item.taskStatus._id}] : emptyDropdown);

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // Получаем функцию удаления вкладки onRemove из контекста
    const onRemove = useContext(DeleteTabContext);

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        const departments = store.getState().reducerDepartment.departments;
        const equipment = store.getState().reducerEquipment.equipment;

        setDepartments(item.department ? [{label: getParents(item.department, departments) + item.department.name, value: item.department._id}] : emptyDropdown);
        setApplicant(item.applicant ? [{label: item.applicant.name, value: item.applicant._id}] : emptyDropdown);
        setEquipment(item.equipment ? [{label: getParents(item.equipment, equipment) + item.equipment.name, value: item.equipment._id}] : emptyDropdown);
        setResponsible(item.responsible ? [{label: item.responsible.name, value: item.responsible._id}] : emptyDropdown);
        setState(item.taskStatus ? [{label: item.taskStatus.name, value: item.taskStatus._id}] : emptyDropdown);

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

            applicant: item.applicant,
            department: item.department,
            equipment: item.equipment,
            responsible: item.responsible,
            taskStatus: item.taskStatus,

            applicantId: item.applicantId ? item.applicantId : null,
            responsibleId: item.responsibleId ? item.responsibleId : null,
            departmentId: item.departmentId ? item.departmentId : null,
            equipmentId: item.equipmentId ? item.equipmentId : null,
            taskStatusId: item.taskStatusId ? item.taskStatusId : null
        });
    }, [item, form, emptyDropdown]);

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

        // Удаляем лишние поля
        delete record.applicantId;
        delete record.departmentId;
        delete record.equipmentId;
        delete record.taskStatusId;
        delete record.responsibleId;

        // Для сохранения записи обращаемся к модели
        await LogDORoute.save(record, setLoadingSave, onRemove);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await LogDORoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove);
    };

    // Обработка нажатия на кнопку "Отмена"
    const cancelHandler = () => LogDORoute.cancel(onRemove, setLoadingCancel);

    // Настройка компонента UploadComponent (вкладка "Файлы")
    const uploadProps = {
        model: "logDO",
        item,
        actionCreatorAdd: ActionCreator.ActionCreatorLogDO.addFile,
        actionCreatorDelete: ActionCreator.ActionCreatorLogDO.deleteFile
    };

    // console.log("Обновление вкладки LogDo");

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
                            <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                            <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>
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
                                        rules={[{required: true, message: "Выберите заявителя!"}]}
                                    >
                                        <Row>
                                            <Col xs={{span: 18}} sm={{span: 18}} md={{span: 20}} lg={{span: 20}} xl={{span: 20}}>
                                                <Form.Item name="applicantId" noStyle>
                                                    <Select
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        options={applicant}
                                                        onDropdownVisibleChange={open => dropdownRender(open, setLoadingApplicant, setApplicant, "people")}
                                                        loading={loadingApplicant}
                                                        onChange={(value) => {
                                                            const people = store.getState().reducerPerson.people;

                                                            const foundApplicant = people.find(person => person._id === value);

                                                            form.setFieldsValue({
                                                                applicant: foundApplicant,
                                                                applicantId: value
                                                            });
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
                                rules={[{required: true, message: "Выберите оборудование!"}]}
                            >
                                <Row>
                                    <Col xs={{span: 21}} sm={{span: 21}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                        <Form.Item name="equipmentId" noStyle>
                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                options={equipment}
                                                onDropdownVisibleChange={open => dropdownRender(open, setLoadingEquipment, setEquipment, "equipment")}
                                                loading={loadingEquipment}
                                                onChange={(value) => {
                                                    const equipment = store.getState().reducerEquipment.equipment;

                                                    const foundEquipment = equipment.find(eq => eq._id === value);

                                                    form.setFieldsValue({
                                                        equipment: foundEquipment,
                                                        equipmentId: value
                                                    });
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
                                    <Form.Item label="Исполнитель">
                                        <Row>
                                            <Col xs={{span: 18}} sm={{span: 18}} md={{span: 20}} lg={{span: 20}} xl={{span: 20}}>
                                                <Form.Item noStyle name="responsibleId">
                                                    <Select
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        options={responsible}
                                                        loading={loadingResponsible}
                                                        onDropdownVisibleChange={open => dropdownRender(open, setLoadingResponsible, setResponsible, "people")}
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

                                                            // Устанавливаем значение в выпадающий список
                                                            if (foundDepartment) {
                                                                setDepartments([{
                                                                    label: getParents(foundDepartment, departments) + foundDepartment.name,
                                                                    value: foundDepartment._id
                                                                }])
                                                            } else {
                                                                setDepartments([{
                                                                    label: "Не выбрано",
                                                                    value: null
                                                                }])
                                                            }

                                                            form.setFieldsValue({
                                                                responsible: foundResponsible,
                                                                responsibleId: value,
                                                                department: foundDepartment ? foundDepartment : null,
                                                                departmentId: foundDepartment ? foundDepartment._id : null
                                                            });
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
                                    <Form.Item label="Подразделение">
                                        <Row>
                                            <Col xs={{span: 18}} sm={{span: 18}} md={{span: 20}} lg={{span: 20}} xl={{span: 20}}>
                                                <Form.Item noStyle name="departmentId">
                                                    <Select
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        options={departments}
                                                        loading={loadingDepartment}
                                                        onDropdownVisibleChange={open => dropdownRender(open, setLoadingDepartment, setDepartments, "departments")}
                                                        onChange={(value) => {
                                                            const departments = store.getState().reducerDepartment.departments;

                                                            const foundDepartment = departments.find(department => department._id === value);

                                                            form.setFieldsValue({
                                                                department: foundDepartment,
                                                                departmentId: value
                                                            });
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

                            <Form.Item label="Состояние">
                                <Row>
                                    <Col xs={{span: 21}} sm={{span: 21}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                        <Form.Item noStyle name="taskStatusId">
                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                options={taskStatus}
                                                loading={loadingState}
                                                onDropdownVisibleChange={open => dropdownRender(open, setLoadingState, setState, "taskStatus")}
                                                onChange={(value) => {
                                                    const tasks = store.getState().reducerTask.tasks;

                                                    const foundTask = tasks.find(task => task._id === value);

                                                    form.setFieldsValue({
                                                        taskStatus: foundTask,
                                                        taskStatusId: value
                                                    });
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

                            <Row gutter={8}>
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

                                <Col span={10}>
                                    <Form.Item label=" " name="acceptTask" valuePropName="checked">
                                        <Checkbox onChange={e => form.setFieldsValue({acceptTask: e.target.checked})}>
                                            Работа принята
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
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