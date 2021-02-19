import React, {useState} from 'react';
import {Button, Card, Form, Input, Row, Col, Select, Skeleton, Tabs, message, Upload, Popconfirm, DatePicker, Checkbox } from 'antd';
import {
    CheckOutlined,
    // DeleteOutlined,
    // InboxOutlined,
    StopOutlined,
    // QuestionCircleOutlined,
    // CloudDownloadOutlined
} from "@ant-design/icons";
import {useSelector, useDispatch} from "react-redux";

import {ActionCreator} from "../../redux/combineActions";
import {
    CheckTypeTab,
    onCancel, onChange,
    onDelete,
    onDropDownRender,
    onFailed,
    onSave
} from "../helpers/rowTabs.helper";
import {request} from "../helpers/request.helper";
import moment from "moment";

const {Meta} = Card;
const {TabPane} = Tabs;
// const {Dragger} = Upload;
// const { RangePicker } = DatePicker;
const { TextArea } = Input;

const dateFormat = "DD.MM.YYYY HH:mm";

export const LogDOTab = ({specKey, onRemove}) => {
    // Инициализация стейта для показа спиннера загрузки при сохранении/удалении записи, обновлении
    // выпадающего списка и списка файлов
    const [loadingSave, setLoadingSave] = useState(false);
    // const [loadingSelectCharacteristics, setLoadingSelectCharacteristics] = useState(false);
    // const [loadingDeleteFile, setLoadingDeleteFile] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);

    const [loadingSelectDep, setLoadingSelectDep] = useState(false);
    const [loadingSelectPeople, setLoadingSelectPeople] = useState(false);
    const [loadingSelectEquipment, setLoadingSelectEquipment] = useState(false);
    const [loadingSelectResponsible, setLoadingSelectResponsible] = useState(false);
    const [loadingSelectState, setLoadingSelectState] = useState(false);
    const [loadingSelectAcceptTask, setLoadingSelectAcceptTask] = useState(false);

    // Получение списка подразделений и загрузки записи из хранилища redux
    const {loadingSkeleton, logDO, rowData, departments, people, equipment, tasks, equipmentProperties, files} = useSelector((state) => ({
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        logDO: state.reducerLogDO.logDO,
        rowData: state.reducerLogDO.rowDataLogDO,
        departments: state.reducerDepartment.departments,
        people: state.reducerPerson.people,
        equipment: state.reducerEquipment.equipment,
        tasks: state.reducerTask.tasks,
        equipmentProperties: state.reducerEquipmentProperty.equipmentProperties,
        files: state.reducerEquipment.files,
    }));
    // const dispatch = useDispatch();

    // Создание стейта для значений в выпадающем списке "Перечень оборудования" и начального значения и
    // установка спиннера загрузки при сохранении записи
    const [selectEquipment, setSelectEquipment] = useState(null);

    const [departmentsToOptions, setDepartmentsToOptions] = useState([]);
    const [peopleToOptions, setPeopleToOptions] = useState([]);
    const [equipmentToOptions, setEquipmentToOptions] = useState([]);
    const [responsibleToOptions, setResponsibleToOptions] = useState([]);
    const [stateToOptions, setStateToOptions] = useState([]);
    const [acceptTaskToOptions, setAcceptTaskToOptions] = useState([]);

    // Инициализация выбранного элемента из выпадающих списков
    const [selectDep, setSelectDep] = useState(null);
    const [selectPeople, setSelectPeople] = useState(null);
    const [selectResponsible, setSelectResponsible] = useState(null);
    const [selectState, setSelectState] = useState(null);
    const [selectAcceptTask, setSelectAcceptTask] = useState(null);

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Инициализация начлаьного значения в выпадающем списке
    let initialApplicant = null, initialEquipment = null, initialDepartment = null, initialResponsible = null,
        initialState = null, initialAcceptTask = null;

    // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
    if (rowData) {
        initialApplicant = rowData.applicant;
        initialEquipment = rowData.equipment;
        initialDepartment = rowData.department;
        initialResponsible = rowData.responsible;
        initialState = rowData.state;
        initialAcceptTask = rowData.acceptTask;
    }

    // Создание заголовка раздела и имени формы
    const title = rowData ? 'Редактирование записи' : 'Создание записи';
    const name = rowData ? `control-ref-log-do-${rowData.name}` : "control-ref-log-do";

    // Функция создания номера записи
    const getNumberLog = (numberLog) => {
        if (numberLog.toString().length < 4) {
            return getNumberLog(`0${numberLog}`);
        } else {
            localStorage.setItem("numberLog", numberLog);
            return numberLog;
        }
    }

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = (values) => {
        let numberLog = localStorage.getItem("numberLog");

        if (!numberLog) {
            numberLog = 0;
        }

        values.numberLog = getNumberLog(++numberLog) + "/" + moment().get("year");
        values.date = values.date.format(dateFormat);
        values.applicant = selectPeople === "Не выбрано" ? null : selectPeople ? selectPeople : initialApplicant;
        values.equipment = selectEquipment === "Не выбрано" ? null : selectEquipment ? selectEquipment : initialEquipment;
        values.department = selectDep === "Не выбрано" ? null : selectDep ? selectDep : initialDepartment;
        values.responsible = selectResponsible === "Не выбрано" ? null : selectResponsible ? selectResponsible : initialResponsible;
        values.state = selectState === "Не выбрано" ? null : selectState ? selectState : initialState;
        // values.dateDone = values.dateDone.format(dateFormat);
        values.acceptTask = selectAcceptTask === "Не выбрано" ? null : selectAcceptTask ? selectAcceptTask : initialAcceptTask;
        values.files = [];

        console.log("В методе onSave, отправляем на сервер: ", values);

        onSave(
            "log-do", values, setLoadingSave, ActionCreator.ActionCreatorLogDO.editLogDO,
            ActionCreator.ActionCreatorLogDO.createLogDO, logDO, onRemove, specKey, rowData
        ).then(null);
    }

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        // try {
            // setLoadingDelete(true);
            // const data = await request("/files/delete/" + rowData._id, "DELETE");
            //
            // if (data) {
                onDelete(
                    "log-do", setLoadingDelete, ActionCreator.ActionCreatorLogDO.deleteLogDO,
                    logDO, onRemove, specKey, rowData, setVisiblePopConfirm
                ).then(null);
        //     }
        // } catch (e) {
        //     message.error("Возникла ошибка при удалении файлов записи, пожалуйста, удалите файлы вручную");
        // }
    }

    // Обработка нажатия на кнопку "Отмена"
    const cancelHandler = async () => {
        try {
            setLoadingCancel(true);

            const data = await request("/files/cancel", "DELETE");

            if (data) {
                setLoadingCancel(false);
                onCancel(onRemove, specKey);
            }
        } catch (e) {
            message.error("Возникла ошибка при удалении файлов записи, пожалуйста, удалите файлы вручную");
        }
    }

    // Изменение значения в выпадающих списках, и сохранение этого значения в стейте
    const changeHandler = (value, dataStore) => {
        const setSelect = dataStore === departments ? setSelectDep : dataStore === people ?
            setSelectPeople : dataStore === equipment ? setSelectEquipment : dataStore === "responsible" ?
                setSelectResponsible : dataStore === tasks ? setSelectState : setSelectAcceptTask;

        if (dataStore === "responsible" || dataStore === "acceptTask") {
            dataStore = people;
        }

        onChange(form, value, setSelect, dataStore);
    }

    // Обновление выпадающего списка
    const dropDownRenderHandler = (open, dataStore) => {
        let setLoading = setLoadingSelectDep,
            key = "departments",
            dispatchAction = ActionCreator.ActionCreatorDepartment.getAllDepartments,
            setSelectToOptions = setDepartmentsToOptions;

        if (dataStore === people) {
            setLoading = setLoadingSelectPeople;
            key = "people";
            dispatchAction = ActionCreator.ActionCreatorPerson.getAllPeople;
            setSelectToOptions = setPeopleToOptions;
        }

        if (dataStore === equipment) {
            setLoading = setLoadingSelectEquipment;
            key = "equipment";
            dispatchAction = ActionCreator.ActionCreatorEquipment.getAllEquipment;
            setSelectToOptions = setEquipmentToOptions;
        }

        if (dataStore === "responsible") {
            setLoading = setLoadingSelectResponsible;
            key = "people";
            dispatchAction = ActionCreator.ActionCreatorPerson.getAllPeople;
            setSelectToOptions = setResponsibleToOptions;
        }

        if (dataStore === tasks) {
            setLoading = setLoadingSelectState;
            key = "taskStatus";
            dispatchAction = ActionCreator.ActionCreatorTask.getAllTasks;
            setSelectToOptions = setStateToOptions;
        }

        if (dataStore === "acceptTask") {
            setLoading = setLoadingSelectAcceptTask;
            key = "people";
            dispatchAction = ActionCreator.ActionCreatorPerson.getAllPeople;
            setSelectToOptions = setAcceptTaskToOptions;
        }

        onDropDownRender(open, setLoading, key, dispatchAction, setSelectToOptions).then(null);
    }

    // Инициализация кнопок, появляющихся при редактировании записи
    const editButtonsComponent = CheckTypeTab(rowData, deleteHandler);

    // Удаляет файл из redux`а, из базы данных и с диска
    // const removeFile = async (deletedFile) => {
    //     setLoadingDeleteFile(true);
    //
    //     let findFile = files.find(file => {
    //         return JSON.stringify(file) === JSON.stringify(deletedFile);
    //     });
    //
    //     let indexOf = files.indexOf(findFile);
    //
    //     if (findFile && indexOf >= 0) {
    //         dispatch(ActionCreator.ActionCreatorEquipment.deleteFile(indexOf));
    //
    //         const id = rowData ? rowData._id : -1;
    //
    //         try {
    //             const data = await request("/files/delete-file/" + id, "DELETE", deletedFile);
    //
    //             if (data) {
    //                 message.success(data.message);
    //             }
    //         } catch (e) {
    //             message.error("Возникла ошибка при удалении файла " + deletedFile.name);
    //         }
    //     } else {
    //         message.error(`Файл ${deletedFile.name} не найден`);
    //     }
    //
    //     setLoadingDeleteFile(false);
    // }

    // Настройки компонента "Upload"
    // const props = {
    //     name: 'file',
    //     multiple: true,
    //     action: "/files/upload",
    //     data: {
    //         equipmentId: rowData ? rowData._id : -1,
    //     },
    //     defaultFileList: files,
    //     fileList: files,
    //     showUploadList: {
    //         showDownloadIcon: true,
    //         downloadIcon: <CloudDownloadOutlined/>,
    //         showRemoveIcon: true,
    //         removeIcon: (file) => {
    //             return <Popconfirm
    //                 title="Вы уверены, что хотите удалить файл?"
    //                 okText="Удалить"
    //                 onConfirm={() => removeFile(file)}
    //                 okButtonProps={{loading: loadingDeleteFile}}
    //                 icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
    //             >
    //                 <DeleteOutlined/>
    //             </Popconfirm>
    //         }
    //     },
    //     onChange(info) {
    //         const {status} = info.file;
    //
    //         if (status === 'done') {
    //             message.success(`Файл ${info.file.name} успешно загружен.`).then(null);
    //         } else if (status === 'error') {
    //             message.error(`Возникла ошибка при загрузке файла ${info.file.name}.`).then(r => console.log(r));
    //         }
    //
    //         // Создаем объект файла
    //         let newFileList = info.fileList.map(file => {
    //             return {
    //                 name: file.name,
    //                 url: `public/${file.name}`,
    //                 status: "done",
    //                 uid: `-1-${file.name}`
    //             }
    //         });
    //
    //         dispatch(ActionCreator.ActionCreatorEquipment.getAllFiles(newFileList));
    //     },
    //     async onRemove(file) {
    //         return new Promise((resolve, reject) => {
    //             return <Popconfirm
    //                 onConfirm={() => {
    //                     resolve(true);
    //                     removeFile(file);
    //                 }}
    //                 onCancel={() => {
    //                     reject(true);
    //                 }}
    //             >
    //                 <DeleteOutlined/>
    //             </Popconfirm>
    //         });
    //     }
    // };

    // Изменение времени в датапикере
    const changeDateHandler = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    }

    // Нажатие на кнопку "ОК" в дата пикере
    const onOk = (value) => {
        console.log('onOk: ', value);
    }

    // Изменение времени в датапикере
    // const changeDateDoneHandler = (value, dateString) => {
    //     console.log('Selected Time: ', value);
    //     console.log('Formatted Selected Time: ', dateString);
    // }

    // Нажатие на кнопку "ОК" в дата пикере
    // const onOkDone = (value) => {
    //     console.log('onOk: ', value);
    // }

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <>
                                    <Form
                                        labelCol={{span: 6}}
                                        wrapperCol={{span: 18}}
                                        style={{marginTop: "5%"}}
                                        form={form}
                                        name={name}
                                        onFinish={saveHandler}
                                        onFinishFailed={onFailed}
                                        initialValues={{
                                            _id: rowData ? rowData._id : "",
                                            numberLog: rowData ? rowData.numberLog : "",
                                            date: moment(),
                                            applicant: rowData && rowData.applicant ? rowData.applicant.name : "Не выбрано",
                                            equipment: rowData && rowData.equipment ? rowData.equipment.name : "Не выбрано",
                                            notes: rowData ? rowData.notes : "",
                                            sendEmail: rowData ? rowData.sendEmail : false,
                                            department: rowData && rowData.department ? rowData.department.name : "Не выбрано",
                                            responsible: rowData && rowData.responsible ? rowData.responsible.name : "Не выбрано",
                                            task: rowData ? rowData.task : "",
                                            state: rowData && rowData.state ? rowData.state.name : "Не выбрано",
                                            // dateDone: rowData && rowData.dateDone ? rowData.dateDone : moment(),
                                            content: rowData ? rowData.content : "",
                                            acceptTask: rowData && rowData.acceptTask ? rowData.acceptTask.name : "Не выбрано",
                                        }}
                                    >
                                        <Tabs defaultActiveKey="name">
                                            <TabPane tab="Заявка" key="request" style={{paddingTop: '5%'}}>
                                                <Form.Item
                                                    label="Дата заявки"
                                                    name="date"
                                                    rules={[{required: true, message: "Введите дату заявки!"}]}
                                                >
                                                    <DatePicker
                                                        showTime={{ format: "HH:mm" }}
                                                        format={dateFormat}
                                                        onChange={changeDateHandler}
                                                        onOk={onOk}
                                                        // value={rowData ? rowData.date : moment()}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Заявитель"
                                                    name="applicant"
                                                    rules={[{required: true, message: "Выберите заявителя!"}]}
                                                >
                                                    <Select
                                                        options={peopleToOptions}
                                                        onDropdownVisibleChange={(open) => dropDownRenderHandler(open, people)}
                                                        loading={loadingSelectPeople}
                                                        onChange={(value) => changeHandler(value, people)}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Оборудование"
                                                    name="equipment"
                                                    rules={[{required: true, message: "Выберите оборудование!"}]}
                                                >
                                                    <Select
                                                        options={equipmentToOptions}
                                                        onDropdownVisibleChange={(open) => dropDownRenderHandler(open, equipment)}
                                                        loading={loadingSelectEquipment}
                                                        onChange={(value) => changeHandler(value, equipment)}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Описание"
                                                    name="notes"
                                                    rules={[{required: true, message: 'Введите описание заявки!'}]}
                                                >
                                                    <TextArea rows={4} />
                                                </Form.Item>

                                                <Form.Item
                                                    label=""
                                                    name="sendEmail"
                                                    valuePropName="checked"
                                                >
                                                    <Checkbox>Уведомить исполнителей по электронной почте</Checkbox>
                                                </Form.Item>

                                                <Form.Item name="_id" hidden={true}>
                                                    <Input/>
                                                </Form.Item>

                                                <Form.Item name="numberLog" hidden={true}>
                                                    <Input/>
                                                </Form.Item>
                                            </TabPane>
                                            <TabPane tab="Выполнение" key="done"
                                                     style={{paddingTop: '5%'}}>
                                                <Form.Item
                                                    label="Подразделение"
                                                    name="department"
                                                >
                                                    <Select
                                                        options={departmentsToOptions}
                                                        onDropdownVisibleChange={(open) => dropDownRenderHandler(open, departments)}
                                                        loading={loadingSelectDep}
                                                        onChange={(value) => changeHandler(value, departments)}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Ответственный"
                                                    name="responsible"
                                                >
                                                    <Select
                                                        options={responsibleToOptions}
                                                        onDropdownVisibleChange={(open) => dropDownRenderHandler(open, "responsible")}
                                                        loading={loadingSelectResponsible}
                                                        onChange={(value) => changeHandler(value, "responsible")}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Задание"
                                                    name="task"
                                                >
                                                    <TextArea rows={4} />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Состояние"
                                                    name="state"
                                                >
                                                    <Select
                                                        options={stateToOptions}
                                                        onDropdownVisibleChange={(open) => dropDownRenderHandler(open, tasks)}
                                                        loading={loadingSelectState}
                                                        onChange={(value) => changeHandler(value, tasks)}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Дата выполнения"
                                                    name="dateDone"
                                                >
                                                    <DatePicker
                                                        showTime={{ format: "HH:mm" }}
                                                        format={dateFormat}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Содержание работ"
                                                    name="content"
                                                >
                                                    <TextArea rows={4} />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Работа принята"
                                                    name="acceptTask"
                                                >
                                                    <Select
                                                        options={acceptTaskToOptions}
                                                        onDropdownVisibleChange={(open) => dropDownRenderHandler(open, "acceptTask")}
                                                        loading={loadingSelectAcceptTask}
                                                        onChange={(value) => changeHandler(value, "acceptTask")}
                                                    />
                                                </Form.Item>
                                            </TabPane>
                                            <TabPane tab="Файлы" key="files" style={{paddingTop: '5%'}}>
                                            {/*    <Form.Item name="files" wrapperCol={{span: 24}}>*/}
                                            {/*        <Dragger {...props}>*/}
                                            {/*            <p className="ant-upload-drag-icon">*/}
                                            {/*                <InboxOutlined/>*/}
                                            {/*            </p>*/}
                                            {/*            <p className="ant-upload-text">Щелкните или перетащите файл*/}
                                            {/*                в эту область, чтобы загрузить</p>*/}
                                            {/*            <p className="ant-upload-hint">*/}
                                            {/*                Поддержка одиночной или массовой загрузки.*/}
                                            {/*            </p>*/}
                                            {/*        </Dragger>*/}
                                            {/*    </Form.Item>*/}
                                            </TabPane>
                                        </Tabs>

                                        <Row justify="end" style={{marginTop: 20}} xs={{gutter: [8, 8]}}>
                                            <Button
                                                className="button-style"
                                                type="primary"
                                                htmlType="submit"
                                                loading={loadingSave}
                                                icon={<CheckOutlined/>}
                                            >
                                                Сохранить
                                            </Button>

                                            {editButtonsComponent}

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
                                </>
                            }
                        />
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}