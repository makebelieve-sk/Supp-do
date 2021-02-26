// Раздел "Оборудование"
import React, {useState} from 'react';
import {Button, Card, Form, Input, Row, Col, Select, Skeleton, Tabs} from 'antd';
import {CheckOutlined, StopOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";

import {UploadComponent} from "../contentComponent/tab.components/uploadComponent";
import {CharacteristicComponent} from "../contentComponent/tab.components/characteristic.component";
import {ActionCreator} from "../../redux/combineActions";
import {CheckTypeTab, onChange, onDropDownRender, onFailed} from "../helpers/tab.helpers/tab.functions";
import {HOCFunctions} from "../helpers/tab.helpers/tab.HOC.functions";
import {RowMapHelper} from "../helpers/table.helpers/tableMap.helper";

const {Meta} = Card;
const {TabPane} = Tabs;

export const EquipmentTab = ({specKey, onRemove}) => {
    // Получение списка подразделений и загрузки записи из хранилища redux
    const {equipment, rowData, loadingSkeleton, equipmentProperties, selectsArray, files} = useSelector((state) => ({
        equipment: state.reducerEquipment.equipment,
        rowData: state.reducerEquipment.rowDataEquipment,
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        equipmentProperties: state.reducerEquipmentProperty.equipmentProperties,
        selectsArray: state.reducerEquipment.selectsArray,
        files: state.reducerEquipment.files
    }));

    // Инициализация стейта для показа спиннера загрузки при сохранении/удалении записи, обновлении выпадающих списков
    // и списка файлов
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingSelectEquipment, setLoadingSelectEquipment] = useState(false);
    const [loadingSelectCharacteristics, setLoadingSelectCharacteristics] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);

    // Создание стейта для значений в выпадающих списках
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

    // Создание заголовка раздела и наименования формы
    const title = rowData ? 'Редактирование оборудования' : 'Создание оборудования';
    const name = rowData ? `control-ref-equipment-${rowData.name}` : "control-ref-equipment";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = (values) => {
        const selectOptions = {selectEquipment, initialEquipment, equipmentProperties, selectsArray};

        const onSaveOptions = {
            url: "equipment", setLoadingSave, actionCreatorEdit: ActionCreator.ActionCreatorEquipment.editEquipment, rowData,
            actionCreatorCreate: ActionCreator.ActionCreatorEquipment.createEquipment, dataStore: equipment, onRemove, specKey,
        };

        HOCFunctions.onSave.onSaveHOCEquipment(values, files, selectOptions, onSaveOptions);
    }

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = (setLoadingDelete, setVisiblePopConfirm) => {
        const onSaveOptions = {
            url: "equipment", setLoadingDelete, actionCreatorDelete: ActionCreator.ActionCreatorEquipment.deleteEquipment,
            rowData, dataStore: equipment, onRemove, specKey, setVisiblePopConfirm
        };

        HOCFunctions.onDelete(setLoadingDelete, "equipment", onSaveOptions).then(null);
    }

    // Обработка нажатия на кнопку "Отмена"
    const cancelHandler = () => {
        const onCancelOptions = { onRemove, specKey };

        HOCFunctions.onCancel(setLoadingCancel, onCancelOptions).then(null);
    }

    // Изменение значения в выпадающих списках
    const changeHandler = (value) => onChange(form, value, setSelectEquipment, equipment);

    // Обновление выпадающих списков
    const dropDownRenderHandler = (open) => onDropDownRender(
        open, setLoadingSelectEquipment, "equipment", ActionCreator.ActionCreatorEquipment.getAllEquipment,
        setEquipmentToOptions);

    // Обновление выпадающих списков во вкладке "Характеристики"
    const dropDownRenderHandlerProperty = (open) => onDropDownRender(
        open, setLoadingSelectCharacteristics, "equipment-property",
        ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties, setEquipmentPropertyToOptions);

    // Настройка компонента CharacteristicComponent (вкладка "Характеристики")
    const characteristicProps = {
        selectsArray: selectsArray,
        equipmentPropertyToOptions: equipmentPropertyToOptions,
        dropDownRenderHandlerProperty: dropDownRenderHandlerProperty,
        loadingSelectCharacteristics: loadingSelectCharacteristics
    }

    // Настройка компонента UploadComponent (вкладка "Файлы")
    const uploadProps = {
        files,
        model: "equipment",
        rowData,
        actionCreatorAdd: ActionCreator.ActionCreatorEquipment.addFile,
        actionCreatorDelete: ActionCreator.ActionCreatorEquipment.deleteFile
    }

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 24}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <>
                                    <Form
                                        className="form-styles"
                                        name={name}
                                        form={form}
                                        layout="vertical"
                                        onFinish={saveHandler}
                                        onFinishFailed={onFailed}
                                        initialValues={{
                                            _id: rowData ? rowData._id : "",
                                            parent: rowData && rowData.parent ? rowData.parent.name : "Не выбрано",
                                            name: rowData ? rowData.name : "",
                                            notes: rowData ? rowData.notes : ""
                                        }}
                                    >
                                        <Tabs defaultActiveKey="name">
                                            <TabPane tab="Наименование" key="name" className="tabPane-styles">
                                                <Form.Item name="parent" label="Принадлежит">
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
                                                    rules={[{
                                                        required: true,
                                                        message: "Введите название подразделения!"
                                                    }]}
                                                >
                                                    <Input maxLength={255} type="text"/>
                                                </Form.Item>

                                                <Form.Item label="Примечание" name="notes">
                                                    <Input maxLength={255} type="text"/>
                                                </Form.Item>

                                                <Form.Item name="_id" hidden={true}>
                                                    <Input/>
                                                </Form.Item>
                                            </TabPane>

                                            <TabPane tab="Характеристики" key="characteristics" className="tabPane-styles">
                                                <Row className="button-add-equipmentProperty" justify="end">
                                                    <Button
                                                        type="primary"
                                                        onClick={() => RowMapHelper("equipmentProperties", null)}
                                                    >Добавить характеристику</Button>
                                                </Row>
                                                <CharacteristicComponent {...characteristicProps} />
                                            </TabPane>

                                            <TabPane tab="Дополнительно" key="files" className="tabPane-styles">
                                                <Form.Item name="files" wrapperCol={{span: 24}}>
                                                    <UploadComponent {...uploadProps}/>
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
                                </>
                            }
                        />
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}