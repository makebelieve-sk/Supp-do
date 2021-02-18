import React, {useState} from 'react';
import {Button, Card, Form, Input, Row, Col, Select, Skeleton, Tabs, message, Upload, Popconfirm} from 'antd';
import {
    CheckOutlined,
    DeleteOutlined,
    InboxOutlined,
    StopOutlined,
    QuestionCircleOutlined,
    CloudDownloadOutlined
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

const {Meta} = Card;
const {TabPane} = Tabs;
const {Dragger} = Upload;

export const LogDOTab = ({specKey, onRemove}) => {
    // Инициализация стейта для показа спиннера загрузки при сохранении/удалении записи, обновлении
    // выпадающего списка и списка файлов
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingSelectEquipment, setLoadingSelectEquipment] = useState(false);
    const [loadingSelectCharacteristics, setLoadingSelectCharacteristics] = useState(false);
    const [loadingDeleteFile, setLoadingDeleteFile] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);

    // Получение списка подразделений и загрузки записи из хранилища redux
    const {equipment, rowData, loadingSkeleton, equipmentProperties, selectsArray, files, logDO} = useSelector((state) => ({
        equipment: state.reducerEquipment.equipment,
        rowData: state.reducerEquipment.rowDataEquipment,
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        equipmentProperties: state.reducerEquipmentProperty.equipmentProperties,
        selectsArray: state.reducerEquipment.selectsArray,
        files: state.reducerEquipment.files,
        logDO: state.reducerLogDO.logDO
    }));
    const dispatch = useDispatch();

    // Создание стейта для значений в выпадающем списке "Перечень оборудования" и начального значения и
    // установка спиннера загрузки при сохранении записи
    const [selectEquipment, setSelectEquipment] = useState(null);
    const [equipmentToOptions, setEquipmentToOptions] = useState([]);
    const [equipmentPropertyToOptions, setEquipmentPropertyToOptions] = useState([]);

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Инициализация начлаьного значения в выпадающем списке
    let initialEquipment = null;

    // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
    if (rowData) {
        initialEquipment = rowData.parent;
    }

    // Создание заголовка раздела и имени формы
    const title = rowData ? 'Редактирование записи' : 'Создание записи';
    const name = rowData ? `control-ref-logdo-${rowData.name}` : "control-ref-logdo";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = (values) => {
        let clonSelectsArray = selectsArray;
        let clonValues = {};

        // Находим поля value из values
        for (let key in values) {
            clonValues[key] = values[key];
        }

        delete clonValues["name"];
        delete clonValues["notes"];
        delete clonValues["_id"];
        delete clonValues["parent"];
        delete clonValues["files"];

        for (let key in clonValues) {
            if (key.slice(0, 5) === "label") {
                delete clonValues[key];
            }
        }

        let entriesArr = Object.entries(clonValues);

        // Переприсваиваем значение value
        entriesArr.forEach(arr => {
            let rowId = arr[0].split("-")[2];

            clonSelectsArray.forEach(select => {
                if (select.id === rowId * 1) {
                    select.value = arr[1];
                }
            })
        })

        // Находим и переприсваиваем equipmentProperty
        clonSelectsArray.forEach(select => {
            let foundEquipmentProperty = equipmentProperties.find(property => {
                return property.name === select.equipmentProperty;
            });

            if (foundEquipmentProperty) {
                select.equipmentProperty = foundEquipmentProperty;
            }
        });

        // Фильтруем неподходящие значения поля equipmentProperty
        let rightSelectsArray = clonSelectsArray.filter(select => {
            return select.equipmentProperty !== "Не выбрано" && select.equipmentProperty;
        });

        // Создаем конечный объект, который отправляется на сервер
        let objectSendToServer = {
            name: values.name,
            notes: values.notes,
            _id: values._id,
            parent: selectEquipment === "Не выбрано" ? null : selectEquipment ? selectEquipment : initialEquipment,
            properties: rightSelectsArray,
            files: files
        };

        onSave(
            "equipment", objectSendToServer, setLoadingSave, ActionCreator.ActionCreatorEquipment.editEquipment,
            ActionCreator.ActionCreatorEquipment.createEquipment, equipment, onRemove, specKey, rowData
        ).then(null);
    }

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        try {
            setLoadingDelete(true);
            const data = await request("/files/delete/" + rowData._id, "DELETE");

            if (data) {
                onDelete(
                    "equipment", setLoadingDelete, ActionCreator.ActionCreatorEquipment.deleteEquipment,
                    equipment, onRemove, specKey, rowData, setVisiblePopConfirm
                ).then(null);
            }
        } catch (e) {
            message.error("Возникла ошибка при удалении файлов записи, пожалуйста, удалите файлы вручную");
        }
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

    // Изменение значения в выпадающем списке "Подразделение", и сохранение этого значения в стейте
    const changeHandler = (value) => onChange(form, value, setSelectEquipment, equipment);

    // Обновление выпадающего списка "Подразделения"
    const dropDownRenderHandler = (open) => onDropDownRender(
        open, setLoadingSelectEquipment, "equipment", ActionCreator.ActionCreatorEquipment.getAllEquipment,
        setEquipmentToOptions);

    // Обновление выпадающего списка во вкладке "Характеристики"
    const dropDownRenderHandlerProperty = (open) => onDropDownRender(
        open, setLoadingSelectCharacteristics, "equipment-property",
        ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties, setEquipmentPropertyToOptions);

    // Инициализация кнопок, появляющихся при редактировании записи
    const editButtonsComponent = CheckTypeTab(rowData, deleteHandler);

    // Добавление строки во вкладке "Характеристики"
    const addRowProperty = (index) => {
        if (index === selectsArray.length - 1) {
            dispatch(ActionCreator.ActionCreatorEquipment.addSelectRow({
                equipmentProperty: "Не выбрано",
                value: "",
                id: Math.random()
            }));
        }
    };

    // Удаление строки во вкладке "Характеристики"
    const deleteRowProperty = (index) => {
        if (selectsArray.length === 1) {
            return null;
        }

        dispatch(ActionCreator.ActionCreatorEquipment.deleteSelectRow(index));
    };

    // Изменение строки во вкладке "Характеристики"
    const changeRowPropertyHandler = (value, index) => {
        let selectRow;

        selectRow = value === "Не выбрано" ?
            {
                equipmentProperty: null,
                value: null,
                id: selectsArray[index].id
            } :
            {
                equipmentProperty: value,
                value: selectsArray[index].value,
                id: selectsArray[index].id
            }

        dispatch(ActionCreator.ActionCreatorEquipment.editSelectRow(selectRow, index));
    }

    // Удаляет файл из redux`а, из базы данных и с диска
    const removeFile = async (deletedFile) => {
        setLoadingDeleteFile(true);

        let findFile = files.find(file => {
            return JSON.stringify(file) === JSON.stringify(deletedFile);
        });

        let indexOf = files.indexOf(findFile);

        if (findFile && indexOf >= 0) {
            dispatch(ActionCreator.ActionCreatorEquipment.deleteFile(indexOf));

            const id = rowData ? rowData._id : -1;

            try {
                const data = await request("/files/delete-file/" + id, "DELETE", deletedFile);

                if (data) {
                    message.success(data.message);
                }
            } catch (e) {
                message.error("Возникла ошибка при удалении файла " + deletedFile.name);
            }
        } else {
            message.error(`Файл ${deletedFile.name} не найден`);
        }

        setLoadingDeleteFile(false);
    }

    // Настройки компонента "Upload"
    const props = {
        name: 'file',
        multiple: true,
        action: "/files/upload",
        data: {
            equipmentId: rowData ? rowData._id : -1,
        },
        defaultFileList: files,
        fileList: files,
        showUploadList: {
            showDownloadIcon: true,
            downloadIcon: <CloudDownloadOutlined/>,
            showRemoveIcon: true,
            removeIcon: (file) => {
                return <Popconfirm
                    title="Вы уверены, что хотите удалить файл?"
                    okText="Удалить"
                    onConfirm={() => removeFile(file)}
                    okButtonProps={{loading: loadingDeleteFile}}
                    icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                >
                    <DeleteOutlined/>
                </Popconfirm>
            }
        },
        onChange(info) {
            const {status} = info.file;

            if (status === 'done') {
                message.success(`Файл ${info.file.name} успешно загружен.`).then(null);
            } else if (status === 'error') {
                message.error(`Возникла ошибка при загрузке файла ${info.file.name}.`).then(r => console.log(r));
            }

            // Создаем объект файла
            let newFileList = info.fileList.map(file => {
                return {
                    name: file.name,
                    url: `public/${file.name}`,
                    status: "done",
                    uid: `-1-${file.name}`
                }
            });

            dispatch(ActionCreator.ActionCreatorEquipment.getAllFiles(newFileList));
        },
        async onRemove(file) {
            return new Promise((resolve, reject) => {
                return <Popconfirm
                    onConfirm={() => {
                        resolve(true);
                        removeFile(file);
                    }}
                    onCancel={() => {
                        reject(true);
                    }}
                >
                    <DeleteOutlined/>
                </Popconfirm>
            });
        }
    };

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
                                    >
                                        <Tabs defaultActiveKey="name">
                                            <TabPane tab="Наименование" key="name" style={{paddingTop: '5%'}}>
                                                <Form.Item
                                                    name="parent"
                                                    initialValue={rowData && rowData.parent ? rowData.parent.name : "Не выбрано"}
                                                    label="Принадлежит"
                                                >
                                                    <Select
                                                        options={equipmentToOptions}
                                                        onDropdownVisibleChange={dropDownRenderHandler}
                                                        loading={loadingSelectEquipment}
                                                        onChange={changeHandler}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Наименование"
                                                    name="name"
                                                    initialValue={rowData ? rowData.name : ""}
                                                    rules={[{
                                                        required: true,
                                                        message: "Введите название подразделения!"
                                                    }]}
                                                >
                                                    <Input maxLength={255} type="text"/>
                                                </Form.Item>

                                                <Form.Item
                                                    label="Примечание"
                                                    name="notes"
                                                    initialValue={rowData ? rowData.notes : ""}
                                                >
                                                    <Input maxLength={255} type="text"/>
                                                </Form.Item>

                                                <Form.Item
                                                    name="_id"
                                                    hidden={true}
                                                    initialValue={rowData ? rowData._id : ""}
                                                >
                                                    <Input/>
                                                </Form.Item>
                                            </TabPane>
                                            <TabPane tab="Характеристики" key="characteristics"
                                                     style={{paddingTop: '5%'}}>
                                                {
                                                    selectsArray && selectsArray.length ?
                                                        selectsArray.map((label, index) => (
                                                            <Form.Item
                                                                key={`${label.equipmentProperty}-${label.id}`}
                                                                wrapperCol={{span: 24}}
                                                            >
                                                                <Row gutter={8}>
                                                                    <Col span={11}>
                                                                        <Form.Item
                                                                            name={`label-${label.equipmentProperty}-${label.id}`}
                                                                            noStyle
                                                                            initialValue={label.equipmentProperty === "Не выбрано" ?
                                                                                "Не выбрано" : label.equipmentProperty ? label.equipmentProperty.name ?
                                                                                    label.equipmentProperty.name : label.equipmentProperty : "Не выбрано"}
                                                                        >
                                                                            <Select
                                                                                onClick={() => addRowProperty(index)}
                                                                                options={equipmentPropertyToOptions}
                                                                                onDropdownVisibleChange={dropDownRenderHandlerProperty}
                                                                                loading={loadingSelectCharacteristics}
                                                                                onChange={(value) => changeRowPropertyHandler(value, index)}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col span={11}>
                                                                        <Form.Item
                                                                            name={`value-${label.value}1-${label.id}`}
                                                                            initialValue={label.value}
                                                                        >
                                                                            <Input
                                                                                onClick={() => addRowProperty(index)}
                                                                                maxLength={255}
                                                                                type="text"
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col span={2}>
                                                                        <Button
                                                                            onClick={() => deleteRowProperty(index)}
                                                                            icon={<DeleteOutlined/>}
                                                                            type="danger"
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </Form.Item>
                                                        )) : "Список характеристик пуст"
                                                }
                                            </TabPane>
                                            <TabPane tab="Файлы" key="files" style={{paddingTop: '5%'}}>
                                                <Form.Item name="files" wrapperCol={{span: 24}}>
                                                    <Dragger {...props}>
                                                        <p className="ant-upload-drag-icon">
                                                            <InboxOutlined/>
                                                        </p>
                                                        <p className="ant-upload-text">Щелкните или перетащите файл
                                                            в эту область, чтобы загрузить</p>
                                                        <p className="ant-upload-hint">
                                                            Поддержка одиночной или массовой загрузки.
                                                        </p>
                                                    </Dragger>
                                                </Form.Item>
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