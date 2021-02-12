import React, {useState} from 'react';
import {Button, Card, Form, Input, Row, Col, Select, Skeleton, Tabs, message, Upload} from 'antd';
import {useSelector, useDispatch} from "react-redux";

import {CheckOutlined, DeleteOutlined, InboxOutlined, StopOutlined} from "@ant-design/icons";
import {ActionCreator} from "../../redux/combineActions";
import {
    checkTypeTab,
    onCancel, onChange,
    onDelete,
    onDropDownRender,
    onFailed,
    onSave
} from "../helpers/rowTabs.helper";

const {Meta} = Card;
const {TabPane} = Tabs;
const {Dragger} = Upload;

export const EquipmentTab = ({specKey, onRemove}) => {
    // Инициализация стейта для показа спиннера загрузки при сохранении/удалении записи и обновлении
    // выпадающего списка
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingSelectEquipment, setLoadingSelectEquipment] = useState(false);
    const [loadingSelectCharacteristics, setLoadingSelectCharacteristics] = useState(false);

    // Получение списка подразделений и загрузки записи из хранилища redux
    const {equipment, rowData, loadingSkeleton, equipmentProperties, selectsArray} = useSelector((state) => ({
        equipment: state.reducerEquipment.equipment,
        rowData: state.reducerEquipment.rowDataEquipment,
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        equipmentProperties: state.reducerEquipmentProperty.equipmentProperties,
        selectsArray: state.reducerEquipment.selectsArray
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
    const title = rowData ? 'Редактирование оборудования' : 'Создание оборудования';
    const name = rowData ? `control-ref-equipment-${rowData.name}` : "control-ref-equipment";

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
            properties: rightSelectsArray
        };

        onSave(
            "equipment", objectSendToServer, setLoadingSave, ActionCreator.ActionCreatorEquipment.editEquipment,
            ActionCreator.ActionCreatorEquipment.createEquipment, equipment, onRemove, specKey, rowData
        ).then(null);
    }

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = () => onDelete(
        "equipment", setLoadingDelete, ActionCreator.ActionCreatorEquipment.deleteEquipment,
        equipment, onRemove, specKey, rowData
    ).then(null);

    // Обработка нажатия на кнопку "Отмена"
    const cancelHandler = () => onCancel(onRemove, specKey);

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
    const editButtonsComponent = checkTypeTab(rowData, deleteHandler, loadingDelete);

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

    const props = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {
            const {status} = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`).then(null);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`).then(r => console.log(r));
            }
        },
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
                                            <TabPane tab="Характеристики" key="characteristics" style={{paddingTop: '5%'}}>
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
                                                        <p className="ant-upload-text">Щелкните или перетащите файл в эту область, чтобы загрузить</p>
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