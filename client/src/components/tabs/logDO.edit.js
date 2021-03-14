// Раздел "Журнал дефектов и отказов"
import moment from "moment";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Button, Card, Form, Input, Row, Col, Select, Skeleton, Tabs, DatePicker, Checkbox} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {dropdownRender, getOptions, onFailed, TabButtons} from "./tab.functions/tab.functions";
import TabOptions from "../../options/tab.options/tab.options";
import {ActionCreator} from "../../redux/combineActions";
import {openRecordTab} from "../helpers/table.helpers/table.helper.js";
import {UploadComponent} from "../contentComponent/tab.components/uploadComponent";

import {DepartmentRoute} from "../../routes/route.Department";
import {PersonRoute} from "../../routes/route.Person";
import {TaskStatusRoute} from "../../routes/route.taskStatus";
import {EquipmentRoute} from "../../routes/route.Equipment";
import {LogDORoute} from "../../routes/route.LogDO";

const {Meta} = Card;
const {TabPane} = Tabs;
const {TextArea} = Input;

export const LogDOTab = ({specKey, onRemove}) => {
    // Получение списка подразделений и загрузки записи
    const {loadingSkeleton, item, departments, people, equipment, tasks, files} = useSelector((state) => ({
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        item: state.reducerLogDO.rowDataLogDO,
        departments: state.reducerDepartment.departments,
        people: state.reducerPerson.people,
        equipment: state.reducerEquipment.equipment,
        tasks: state.reducerTask.tasks,
        files: state.reducerLogDO.files,
    }));

    // Инициализация стейта для показа спиннера загрузки при изменении записи, обновлении выпадающих списков
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [loadingSelectDep, setLoadingSelectDep] = useState(false);
    const [loadingSelectApplicant, setLoadingSelectApplicant] = useState(false);
    const [loadingSelectEquipment, setLoadingSelectEquipment] = useState(false);
    const [loadingSelectResponsible, setLoadingSelectResponsible] = useState(false);
    const [loadingSelectState, setLoadingSelectState] = useState(false);

    // Инициализация значений для выпадающих списков
    const [departmentsToOptions, setDepartmentsToOptions] = useState(getOptions(departments));
    const [applicantToOptions, setApplicantToOptions] = useState(getOptions(people));
    const [equipmentToOptions, setEquipmentToOptions] = useState(getOptions(equipment));
    const [responsibleToOptions, setResponsibleToOptions] = useState(getOptions(people));
    const [stateToOptions, setStateToOptions] = useState(getOptions(tasks));

    let initialApplicantOptions = {_id: null}, initialEquipmentOptions = {_id: null}, initialResponsibleOptions = {_id: null},
        initialDepartmentOptions = {_id: null}, initialStateOptions = {_id: null};

    // Начальное значение выбранного элемента в выпадающем списке Заявитель
    if (people && people.length && item && item.applicant) {
        initialApplicantOptions = people.find(eq => eq._id === item.applicant._id);
    }
    // Начальное значение выбранного элемента в выпадающем списке Оборудование
    if (equipment && equipment.length && item && item.equipment) {
        initialEquipmentOptions = equipment.find(eq => eq._id === item.equipment._id);
    }
    // Начальное значение выбранного элемента в выпадающем списке Исполнитель
    if (people && people.length && item && item.responsible) {
        initialResponsibleOptions = people.find(eq => eq._id === item.responsible._id);
    }
    // Начальное значение выбранного элемента в выпадающем списке Подразделение
    if (departments && departments.length && item && item.department) {
        initialDepartmentOptions = departments.find(eq => eq._id === item.department._id);
    }
    // Начальное значение выбранного элемента в выпадающем списке Состояние
    if (tasks && tasks.length && item && item.state) {
        initialStateOptions = tasks.find(eq => eq._id === item.state._id);
    }

    // Создание заголовка раздела и имени формы
    const title = !item || item.isNewItem ? "Создание записи в журнале дефектов и отказов" : "Редактирование записи в журнале дефектов и отказов";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        // Устанавливаем спиннер загрузки
        setLoadingSave(true);

        // Обновляем данные в выпадающих списках
        await LogDORoute.getAll();

        // Проверяем, есть ли выбранный элемент в списке заявитель
        const foundApplicant = people.find(person => {
            return person._id === values.applicant;
        });
        // Проверяем, есть ли выбранный элемент в списке оборудования
        const foundEquipment = equipment.find(eq => {
            return eq._id === values.equipment;
        });
        // Проверяем, есть ли выбранный элемент в списке исполнитель
        const foundResponsible = people.find(person => {
            return person._id === values.responsible;
        });
        // Проверяем, есть ли выбранный элемент в списке подразделения
        const foundDepartment = departments.find(department => {
            return department._id === values.department;
        });
        // Проверяем, есть ли выбранный элемент в списке состояние
        const foundState = tasks.find(task => {
            return task._id === values.state;
        });

        values.applicant = foundApplicant ? foundApplicant : null;
        values.equipment = foundEquipment ? foundEquipment : null;
        values.responsible = foundResponsible ? foundResponsible : null;
        values.department = foundDepartment ? foundDepartment : null;
        values.state = foundState ? foundState : null;
        values.dateDone = values.dateDone ? values.dateDone.format(TabOptions.dateFormat) : null;
        values.planDateDone = values.planDateDone ? values.planDateDone.format(TabOptions.dateFormat) : null;
        values.files = files;

        await LogDORoute.save(values, setLoadingSave, onRemove, specKey);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await LogDORoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove, specKey);
    };

    const cancelHandler = () => LogDORoute.cancel(onRemove, specKey, setLoadingCancel);

    // Настройка компонента UploadComponent (вкладка "Файлы")
    const uploadProps = {
        files,
        model: "logDO",
        item,
        actionCreatorAdd: ActionCreator.ActionCreatorLogDO.addFile,
        actionCreatorDelete: ActionCreator.ActionCreatorLogDO.deleteFile
    };

    const [form] = Form.useForm();

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form
                                    form={form}
                                    className="form-styles"
                                    name="logDO-item"
                                    layout="vertical"
                                    onFinish={saveHandler}
                                    onFinishFailed={onFailed}
                                    initialValues={{
                                        _id: !item ? null : item._id,
                                        isNewItem: !item ? null : item.isNewItem,
                                        date: item && item.date ? moment(item.date) : moment(),
                                        applicant: item && initialApplicantOptions ? initialApplicantOptions._id : null,
                                        equipment: item && initialEquipmentOptions ? initialEquipmentOptions._id : null,
                                        responsible: item && initialResponsibleOptions ? initialResponsibleOptions._id : null,
                                        department: item && initialDepartmentOptions ? initialDepartmentOptions._id : null,
                                        state: item && initialStateOptions ? initialStateOptions._id : null,
                                        notes: !item ? null : item.notes,
                                        sendEmail: !item ? null : item.sendEmail,
                                        productionCheck: !item ? null : item.productionCheck,
                                        task: !item ? null : item.task,
                                        dateDone: item && item.dateDone ? moment(item.dateDone) : null,
                                        planDateDone: item && item.planDateDone ? moment(item.planDateDone) : null,
                                        content: !item ? null : item.content,
                                        downtime: !item ? null : item.downtime,
                                        acceptTask: !item ? null : item.acceptTask
                                    }}
                                >
                                    <Tabs defaultActiveKey="request">
                                        <TabPane tab="Заявка" key="request" className="tabPane-styles">
                                            <Form.Item name="_id" hidden={true}>
                                                <Input/>
                                            </Form.Item>
                                            <Form.Item name="isNewItem" hidden={true}>
                                                <Input/>
                                            </Form.Item>

                                            <Row justify="space-between" gutter={8}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label="Дата заявки"
                                                        name="date"
                                                        rules={[{required: true, message: "Введите дату заявки!"}]}
                                                    >
                                                        <DatePicker showTime={{format: "HH:mm"}} format={TabOptions.dateFormat} style={{width: "100%"}}/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label="Заявитель"
                                                        name="applicant"
                                                        rules={[{required: true, message: "Выберите заявителя!"}]}
                                                    >
                                                        <Row>
                                                            <Col xs={{span: 18}} sm={{span: 18}} md={{span: 20}} lg={{span: 20}} xl={{span: 20}}>
                                                                <Form.Item name="applicant" noStyle>
                                                                    <Select
                                                                        options={applicantToOptions}
                                                                        onDropdownVisibleChange={async open => {
                                                                            await dropdownRender(open, setLoadingSelectApplicant, PersonRoute, setApplicantToOptions, people);
                                                                        }}
                                                                        loading={loadingSelectApplicant}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col xs={{span: 6}} sm={{span: 6}} md={{span: 4}} lg={{span: 4}} xl={{span: 4}}>
                                                                <Button
                                                                    className="button-add-select"
                                                                    onClick={() => openRecordTab("people", "-1")}
                                                                    icon={<PlusOutlined/>}
                                                                    type="secondary"
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                            <Form.Item
                                                label="Оборудование"
                                                name="equipment"
                                                rules={[{required: true, message: "Выберите оборудование!"}]}
                                            >
                                                <Row>
                                                    <Col xs={{span: 21}} sm={{span: 21}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                                        <Form.Item name="equipment" noStyle>
                                                            <Select
                                                                options={equipmentToOptions}
                                                                onDropdownVisibleChange={async open => {
                                                                    await dropdownRender(open, setLoadingSelectEquipment, EquipmentRoute, setEquipmentToOptions, equipment);
                                                                }}
                                                                loading={loadingSelectEquipment}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={{span: 3}} sm={{span: 3}} md={{span: 2}} lg={{span: 2}} xl={{span: 2}}>
                                                        <Button
                                                            className="button-add-select"
                                                            onClick={() => openRecordTab("equipment", "-1")}
                                                            icon={<PlusOutlined/>}
                                                            type="secondary"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Item>

                                            <Form.Item
                                                label="Описание"
                                                name="notes"
                                                rules={[{required: true, message: "Введите описание заявки!"}]}
                                            >
                                                <TextArea rows={2} placeholder="Максимально 1000 символов" />
                                            </Form.Item>

                                            <Form.Item name="sendEmail" valuePropName="checked" noStyle>
                                                <Checkbox>Оперативное уведомление ответственных специалистов</Checkbox>
                                            </Form.Item>

                                            <Form.Item name="productionCheck" valuePropName="checked">
                                                <Checkbox>Производство остановлено</Checkbox>
                                            </Form.Item>
                                        </TabPane>

                                        <TabPane tab="Выполнение" key="done" className="tabPane-styles">
                                            <Row justify="space-between" gutter={8}>
                                                <Col span={12}>
                                                    <Form.Item label="Исполнитель">
                                                        <Row>
                                                            <Col xs={{span: 18}} sm={{span: 18}} md={{span: 20}} lg={{span: 20}} xl={{span: 20}}>
                                                                <Form.Item noStyle name="responsible">
                                                                    <Select
                                                                        options={responsibleToOptions}
                                                                        onDropdownVisibleChange={async open => {
                                                                            await dropdownRender(open, setLoadingSelectResponsible, PersonRoute, setResponsibleToOptions, people);
                                                                        }}
                                                                        loading={loadingSelectResponsible}
                                                                        onChange={_id => {
                                                                            const foundPerson = people.find(person => {
                                                                                return person._id === _id;
                                                                            });

                                                                            foundPerson ? form.setFieldsValue({department: foundPerson.department._id}) :
                                                                                form.setFieldsValue({department: null})
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col xs={{span: 6}} sm={{span: 6}} md={{span: 4}} lg={{span: 4}} xl={{span: 4}}>
                                                                <Button
                                                                    className="button-add-select"
                                                                    onClick={() => openRecordTab("people", "-1")}
                                                                    icon={<PlusOutlined/>}
                                                                    type="secondary"
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item label="Подразделение">
                                                        <Row>
                                                            <Col xs={{span: 18}} sm={{span: 18}} md={{span: 20}} lg={{span: 20}} xl={{span: 20}}>
                                                                <Form.Item noStyle name="department">
                                                                    <Select
                                                                        options={departmentsToOptions}
                                                                        onDropdownVisibleChange={async open => {
                                                                            await dropdownRender(open, setLoadingSelectDep, DepartmentRoute, setDepartmentsToOptions, departments);
                                                                        }}
                                                                        loading={loadingSelectDep}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col xs={{span: 6}} sm={{span: 6}} md={{span: 4}} lg={{span: 4}} xl={{span: 4}}>
                                                                <Button
                                                                    className="button-add-select"
                                                                    onClick={() => openRecordTab("departments", "-1")}
                                                                    icon={<PlusOutlined/>}
                                                                    type="secondary"
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Form.Item label="Задание" name="task">
                                                <TextArea rows={2} placeholder="Максимально 1000 символов"/>
                                            </Form.Item>

                                            <Form.Item label="Состояние">
                                                <Row>
                                                    <Col xs={{span: 21}} sm={{span: 21}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                                        <Form.Item noStyle name="state">
                                                            <Select
                                                                options={stateToOptions}
                                                                onDropdownVisibleChange={async open => {
                                                                    await dropdownRender(open, setLoadingSelectState, TaskStatusRoute, setStateToOptions, tasks);
                                                                }}
                                                                loading={loadingSelectState}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={{span: 3}} sm={{span: 3}} md={{span: 2}} lg={{span: 2}} xl={{span: 2}}>
                                                        <Button
                                                            className="button-add-select"
                                                            onClick={() => openRecordTab("tasks", "-1")}
                                                            icon={<PlusOutlined/>}
                                                            type="secondary"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Item>

                                            <Row gutter={8}>
                                                <Col span={12}>
                                                    <Form.Item label="Планируемая дата выполнения" name="planDateDone">
                                                        <DatePicker showTime={{format: "HH:mm"}} format={TabOptions.dateFormat} style={{width: "100%"}}/>
                                                    </Form.Item>
                                                </Col>

                                                <Col span={12}>
                                                    <Form.Item label="Дата выполнения" name="dateDone">
                                                        <DatePicker showTime={{format: "HH:mm"}} format={TabOptions.dateFormat} style={{width: "100%"}}/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                            <Form.Item label="Содержание работ" name="content">
                                                <TextArea rows={2} placeholder="Максимально 1000 символов"/>
                                            </Form.Item>

                                            <Row gutter={8} justify="space-between">
                                                <Col span={12}>
                                                    <Form.Item label="Время простоя, мин" name="downtime">
                                                        <Input type="number" style={{textAlign: "right"}} />
                                                    </Form.Item>
                                                </Col>

                                                <Col span={10}>
                                                    <Form.Item label=" " name="acceptTask" valuePropName="checked">
                                                        <Checkbox>Работа принята</Checkbox>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </TabPane>

                                        <TabPane tab="Дополнительно" key="files" className="tabPane-styles">
                                            <Form.Item name="files" wrapperCol={{span: 24}}>
                                                <UploadComponent {...uploadProps}/>
                                            </Form.Item>
                                        </TabPane>
                                    </Tabs>

                                    <TabButtons
                                        loadingSave={loadingSave}
                                        item={item}
                                        deleteHandler={deleteHandler}
                                        cancelHandler={cancelHandler}
                                        loadingCancel={loadingCancel}
                                    />
                                </Form>
                            }
                        />
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}