// Раздел "Журнал дефектов и отказов"
import React, {useState} from 'react';
import {Button, Card, Form, Input, Row, Col, Select, Skeleton, Tabs, DatePicker, Checkbox} from 'antd';
import {CheckOutlined, PlusOutlined, StopOutlined,} from "@ant-design/icons";
import {useSelector} from "react-redux";
import moment from "moment";

import {UploadComponent} from "../contentComponent/tab.components/uploadComponent";
import {ActionCreator} from "../../redux/combineActions";
import {CheckTypeTab, onFailed} from "../helpers/tab.helpers/tab.functions";
import {HOCFunctions} from "../helpers/tab.helpers/tab.HOC.functions";
import TabOptions from "../../options/tab.options/tab.options";
import {RowMapHelper} from "../helpers/table.helpers/tableMap.helper";
import getParents from "../helpers/getRowParents.helper";

const {Meta} = Card;
const {TabPane} = Tabs;
const {TextArea} = Input;

export const LogDOTab = ({specKey, onRemove}) => {
    // Получение списка подразделений и загрузки записи из хранилища redux
    const {loadingSkeleton, logDO, rowData, departments, people, equipment, tasks, files} = useSelector((state) => ({
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        logDO: state.reducerLogDO.logDO,
        rowData: state.reducerLogDO.rowDataLogDO,
        departments: state.reducerDepartment.departments,
        people: state.reducerPerson.people,
        equipment: state.reducerEquipment.equipment,
        tasks: state.reducerTask.tasks,
        files: state.reducerLogDO.files,
    }));

    // Инициализация стейта для показа спиннера загрузки при сохранении/удалении записи, обновлении
    // выпадающих списков и списка файлов
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [loadingSelectDep, setLoadingSelectDep] = useState(false);
    const [loadingSelectPeople, setLoadingSelectPeople] = useState(false);
    const [loadingSelectEquipment, setLoadingSelectEquipment] = useState(false);
    const [loadingSelectResponsible, setLoadingSelectResponsible] = useState(false);
    const [loadingSelectState, setLoadingSelectState] = useState(false);
    const [loadingSelectAcceptTask, setLoadingSelectAcceptTask] = useState(false);

    // Инициализация значений для выпадающих списков
    const [departmentsToOptions, setDepartmentsToOptions] = useState([]);
    const [peopleToOptions, setPeopleToOptions] = useState([]);
    const [equipmentToOptions, setEquipmentToOptions] = useState([]);
    const [responsibleToOptions, setResponsibleToOptions] = useState([]);
    const [stateToOptions, setStateToOptions] = useState([]);
    const [acceptTaskToOptions, setAcceptTaskToOptions] = useState([]);

    // Инициализация выбранного элемента из выпадающих списков
    const [selectDep, setSelectDep] = useState(null);
    const [selectPeople, setSelectPeople] = useState(null);
    const [selectEquipment, setSelectEquipment] = useState(null);
    const [selectResponsible, setSelectResponsible] = useState(null);
    const [selectState, setSelectState] = useState(null);
    const [selectAcceptTask, setSelectAcceptTask] = useState(null);

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Инициализация начлаьного значения в выпадающем списке
    let initialApplicant = null, initialEquipment = null, initialDepartment = null, initialResponsible = null,
        initialState = null, initialAcceptTask = null;

    let foundParentName = {}, foundParentNameDepartments = {};

    // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
    if (rowData) {
        initialApplicant = rowData.applicant;
        initialEquipment = rowData.equipment;
        initialDepartment = rowData.department;
        initialResponsible = rowData.responsible;
        initialState = rowData.state;
        initialAcceptTask = rowData.acceptTask;

        if (equipment && equipment.length && rowData.equipment) {
            equipment.forEach(item => {
                if (item.parent) {
                    item.nameWithParent = getParents(item, equipment) + item.name;
                } else {
                    item.nameWithParent = item.name;
                }
            })

            foundParentName = equipment.find(item => item._id === rowData.equipment._id)
        }
        if (departments && departments.length && rowData.department) {
            departments.forEach(item => {
                if (item.parent) {
                    item.nameWithParent = getParents(item, departments) + item.name;
                } else {
                    item.nameWithParent = item.name;
                }
            })

            foundParentNameDepartments = departments.find(item => item._id === rowData.department._id);
        }
    }

    // Создание заголовка раздела и наименования формы
    const title = rowData ? 'Редактирование записи' : 'Создание записи';
    const name = rowData ? `control-ref-log-do-${rowData.name}` : "control-ref-log-do";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = (values) => {
        const selectOptions = {
            selectPeople,
            initialApplicant,
            selectEquipment,
            initialEquipment,
            selectDep,
            initialDepartment,
            selectResponsible,
            initialResponsible,
            selectState,
            initialState,
            selectAcceptTask,
            initialAcceptTask
        };

        const onSaveOptions = {
            url: "log-do", setLoadingSave, actionCreatorEdit: ActionCreator.ActionCreatorLogDO.editLogDO, rowData,
            actionCreatorCreate: ActionCreator.ActionCreatorLogDO.createLogDO, dataStore: logDO, onRemove, specKey,
        };

        const dateOptions = {

        }

        HOCFunctions.onSave.onSaveHOCLogDO(values, files, selectOptions, onSaveOptions, dateOptions);
    }

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = (setLoadingDelete, setVisiblePopConfirm) => {
        const onSaveOptions = {
            url: "log-do", setLoadingDelete, actionCreatorDelete: ActionCreator.ActionCreatorLogDO.deleteLogDO, rowData,
            dataStore: logDO, onRemove, specKey, setVisiblePopConfirm
        };

        HOCFunctions.onDelete(setLoadingDelete, "logDO", onSaveOptions).then(null);
    }

    // Обработка нажатия на кнопку "Отмена"
    const cancelHandler = () => {
        const onCancelOptions = {onRemove, specKey};

        HOCFunctions.onCancel(setLoadingCancel, onCancelOptions).then(null);
    }

    // Изменение значения в выпадающих списках
    const changeHandler = (value, data) => {
        const dataStore = {departments, people, equipment, responsible: "responsible", tasks, acceptTask: "acceptTask"};

        const setSelect = {
            setSelectDep, setSelectPeople, setSelectEquipment, setSelectResponsible, setSelectState,
            setSelectAcceptTask
        };

        HOCFunctions.onChange(form, value, data, dataStore, setSelect);
    }

    // Обновление выпадающих списков
    const dropDownRenderHandler = (open, data) => {
        const dataStore = {departments, people, equipment, responsible: "responsible", tasks, acceptTask: "acceptTask"};
        const setLoading = {
            setLoadingSelectDep, setLoadingSelectPeople, setLoadingSelectEquipment,
            setLoadingSelectResponsible, setLoadingSelectState, setLoadingSelectAcceptTask
        };
        const setOptions = {
            setDepartmentsToOptions, setPeopleToOptions, setEquipmentToOptions, setResponsibleToOptions,
            setStateToOptions, setAcceptTaskToOptions
        };

        HOCFunctions.onDropDownRender(open, data, dataStore, setLoading, setOptions);
    }

    // Настройка компонента UploadComponent (вкладка "Файлы")
    const uploadProps = {
        files,
        model: "logDO",
        rowData,
        actionCreatorAdd: ActionCreator.ActionCreatorLogDO.addFile,
        actionCreatorDelete: ActionCreator.ActionCreatorLogDO.deleteFile
    }

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form
                                    className="form-styles"
                                    name={name}
                                    form={form}
                                    layout="vertical"
                                    onFinish={saveHandler}
                                    onFinishFailed={onFailed}
                                    initialValues={{
                                        _id: rowData ? rowData._id : "",
                                        numberLog: rowData ? moment(rowData.numberLog, TabOptions.dateFormat) : "",
                                        date: rowData && rowData.date ? moment(rowData.date) : moment(),
                                        applicant: rowData && rowData.applicant ? rowData.applicant.name : "Не выбрано",
                                        equipment: rowData && rowData.equipment && foundParentName ? foundParentName.nameWithParent : "Не выбрано",
                                        notes: rowData ? rowData.notes : "",
                                        sendEmail: rowData ? rowData.sendEmail : false,
                                        productionCheck: rowData ? rowData.productionCheck : false,
                                        department: rowData && rowData.department && foundParentNameDepartments ? foundParentNameDepartments.nameWithParent : "Не выбрано",
                                        responsible: rowData && rowData.responsible ? rowData.responsible.name : "Не выбрано",
                                        task: rowData ? rowData.task : "",
                                        state: rowData && rowData.state ? rowData.state.name : "Не выбрано",
                                        dateDone: rowData && rowData.dateDone ? moment(rowData.dateDone, TabOptions.dateFormat) : null,
                                        planDateDone: rowData && rowData.planDateDone ? moment(rowData.planDateDone, TabOptions.dateFormat) : null,
                                        content: rowData ? rowData.content : "",
                                        downtime: rowData ? rowData.downtime : "",
                                        acceptTask: rowData && rowData.acceptTask ? rowData.acceptTask.name : "Не выбрано",
                                    }}
                                >
                                    <Tabs defaultActiveKey="name">
                                        <TabPane tab="Заявка" key="request" className="tabPane-styles">
                                            <Form.Item
                                                label="Дата заявки"
                                                name="date"
                                                rules={[{required: true, message: "Введите дату заявки!"}]}
                                            >
                                                <DatePicker showTime={{format: "HH:mm"}}
                                                            format={TabOptions.dateFormat}/>
                                            </Form.Item>

                                            <Form.Item label="Заявитель" required={true}>
                                                <Row gutter={8}>
                                                    <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}}
                                                         xl={{span: 22}}>
                                                        <Form.Item
                                                            name="applicant"
                                                            noStyle
                                                            rules={[{
                                                                required: true,
                                                                transform: value => value === "Не выбрано" ? "" : value,
                                                                message: "Выберите заявителя!"
                                                            }]}
                                                        >
                                                            <Select
                                                                options={peopleToOptions}
                                                                onDropdownVisibleChange={(open) => dropDownRenderHandler(open, people)}
                                                                loading={loadingSelectPeople}
                                                                onChange={(value) => changeHandler(value, people)}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={{span: 4}} sm={{span: 4}} md={{span: 2}} lg={{span: 2}}
                                                         xl={{span: 2}}>
                                                        <Button
                                                            style={{width: "100%"}}
                                                            onClick={() => RowMapHelper("people", null)}
                                                            icon={<PlusOutlined/>}
                                                            type="secondary"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Item>

                                            <Form.Item label="Оборудование" required={true}>
                                                <Row gutter={8}>
                                                    <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}}
                                                         xl={{span: 22}}>
                                                        <Form.Item
                                                            name="equipment"
                                                            noStyle
                                                            rules={[{
                                                                required: true,
                                                                transform: value => value === "Не выбрано" ? "" : value,
                                                                message: "Выберите оборудование!"
                                                            }]}
                                                        >
                                                            <Select
                                                                options={equipmentToOptions}
                                                                onDropdownVisibleChange={(open) => dropDownRenderHandler(open, equipment)}
                                                                loading={loadingSelectEquipment}
                                                                onChange={(value) => changeHandler(value, equipment)}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={{span: 4}} sm={{span: 4}} md={{span: 2}} lg={{span: 2}}
                                                         xl={{span: 2}}>
                                                        <Button
                                                            style={{width: "100%"}}
                                                            onClick={() => RowMapHelper("equipment", null)}
                                                            icon={<PlusOutlined/>}
                                                            type="secondary"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Item>

                                            <Form.Item
                                                label="Описание"
                                                name="notes"
                                                rules={[{required: true, message: 'Введите описание заявки!'}]}
                                            >
                                                <TextArea rows={2} placeholder="Максимально 1000 символов" />
                                            </Form.Item>

                                            <Form.Item name="sendEmail" valuePropName="checked">
                                                <Checkbox>Оперативное уведомление ответственных специалистов</Checkbox>
                                            </Form.Item>

                                            <Form.Item name="productionCheck" valuePropName="checked">
                                                <Checkbox>Производство остановлено</Checkbox>
                                            </Form.Item>

                                            <Form.Item name="_id" hidden={true}>
                                                <Input/>
                                            </Form.Item>

                                            <Form.Item name="numberLog" hidden={true}>
                                                <Input/>
                                            </Form.Item>
                                        </TabPane>

                                        <TabPane tab="Выполнение" key="done" className="tabPane-styles">
                                            <Form.Item label="Исполнитель">
                                                <Row gutter={8}>
                                                    <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}}
                                                         xl={{span: 22}}>
                                                        <Form.Item noStyle name="responsible">
                                                            <Select
                                                                options={responsibleToOptions}
                                                                onDropdownVisibleChange={(open) => dropDownRenderHandler(open, "responsible")}
                                                                loading={loadingSelectResponsible}
                                                                onChange={(value) => changeHandler(value, "responsible")}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={{span: 4}} sm={{span: 4}} md={{span: 2}} lg={{span: 2}}
                                                         xl={{span: 2}}>
                                                        <Button
                                                            style={{width: "100%"}}
                                                            onClick={() => RowMapHelper("people", null)}
                                                            icon={<PlusOutlined/>}
                                                            type="secondary"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Item>

                                            <Form.Item label="Подразделение">
                                                <Row gutter={8}>
                                                    <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}}
                                                         xl={{span: 22}}>
                                                        <Form.Item noStyle name="department">
                                                            <Select
                                                                options={departmentsToOptions}
                                                                onDropdownVisibleChange={(open) => dropDownRenderHandler(open, departments)}
                                                                loading={loadingSelectDep}
                                                                onChange={(value) => changeHandler(value, departments)}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={{span: 4}} sm={{span: 4}} md={{span: 2}} lg={{span: 2}}
                                                         xl={{span: 2}}>
                                                        <Button
                                                            style={{width: '100%'}}
                                                            onClick={() => RowMapHelper('departments', null)}
                                                            icon={<PlusOutlined/>}
                                                            type="secondary"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Item>

                                            <Form.Item label="Задание" name="task">
                                                <TextArea rows={2} placeholder="Максимально 1000 символов"/>
                                            </Form.Item>

                                            <Form.Item label="Состояние">
                                                <Row gutter={8}>
                                                    <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}}
                                                         xl={{span: 22}}>
                                                        <Form.Item noStyle name="state">
                                                            <Select
                                                                options={stateToOptions}
                                                                onDropdownVisibleChange={(open) => dropDownRenderHandler(open, tasks)}
                                                                loading={loadingSelectState}
                                                                onChange={(value) => changeHandler(value, tasks)}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={{span: 4}} sm={{span: 4}} md={{span: 2}} lg={{span: 2}}
                                                         xl={{span: 2}}>
                                                        <Button
                                                            style={{width: "100%"}}
                                                            onClick={() => RowMapHelper("tasks", null)}
                                                            icon={<PlusOutlined/>}
                                                            type="secondary"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Item>

                                            <Row justify="space-between">
                                                <Form.Item label="Планируемая дата выполнения" name="planDateDone">
                                                    <DatePicker showTime={{format: "HH:mm"}} format={TabOptions.dateFormat}/>
                                                </Form.Item>

                                                <Form.Item label="Дата выполнения" name="dateDone">
                                                    <DatePicker showTime={{format: "HH:mm"}} format={TabOptions.dateFormat}/>
                                                </Form.Item>
                                            </Row>

                                            <Form.Item label="Содержание работ" name="content">
                                                <TextArea rows={2} placeholder="Максимально 1000 символов"/>
                                            </Form.Item>

                                            <Row justify="space-between">
                                                <Col span={10}>
                                                    <Form.Item label="Время простоя, мин" name="downtime">
                                                        <Input type="number" style={{textAlign: "right"}} />
                                                    </Form.Item>
                                                </Col>

                                                <Col span={10}>
                                                    <Form.Item label="Работа принята" name="acceptTask">
                                                        <Select
                                                            options={acceptTaskToOptions}
                                                            onDropdownVisibleChange={(open) => dropDownRenderHandler(open, "acceptTask")}
                                                            loading={loadingSelectAcceptTask}
                                                            onChange={(value) => changeHandler(value, "acceptTask")}
                                                        />
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

                                    <Row justify="end" xs={{gutter: [8, 8]}}>
                                        <Button
                                            className="button-style"
                                            type="primary"
                                            htmlType="submit"
                                            loading={loadingSave}
                                            icon={<CheckOutlined/>}
                                        >
                                            Сохранить
                                        </Button>

                                        {CheckTypeTab(rowData, deleteHandler)}

                                        <Button
                                            className="button-style"
                                            type="secondary"
                                            onClick={cancelHandler}
                                            loading={loadingCancel}
                                            icon={<StopOutlined/>}
                                        >
                                            Отмена
                                        </Button>
                                    </Row>
                                </Form>
                            }
                        />
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}