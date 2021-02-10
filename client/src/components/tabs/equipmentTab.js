import React, {useState} from 'react';
import {Button, Card, Form, Input, Row, Col, Select, Skeleton} from 'antd';
import {useSelector} from "react-redux";

import {CheckOutlined, StopOutlined} from "@ant-design/icons";
import {ActionCreator} from "../../redux/combineActions";
import {
    checkTypeTab,
    onCancel,
    onChange,
    onDelete,
    onDropDownRender,
    onFailed,
    onSave
} from "../helpers/rowTabs.helper";

const {Meta} = Card;

export const EquipmentTab = ({specKey, onRemove}) => {
    // Инициализация стейта для показа спиннера загрузки при сохранении/удалении записи и обновлении
    // выпадающего списка
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingSelectEquipment, setLoadingSelectEquipment] = useState(false);

    // Получение списка подразделений и загрузки записи из хранилища redux
    const {equipment, rowData, loadingSkeleton} = useSelector((state) => ({
        equipment: state.reducerEquipment.equipment,
        rowData: state.reducerEquipment.rowDataEquipment,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    // Создание стейта для значений в выпадающем списке "Перечень оборудования" и начального значения и
    // установка спиннера загрузки при сохранении записи
    const [selectEquipment, setSelectEquipment] = useState(null);
    const [equipmentToOptions, setEquipmentToOptions] = useState([]);

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

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
        values.parent = selectEquipment === "Не выбрано" ? null : selectEquipment ? selectEquipment : initialEquipment;

        onSave(
            "equipment", values, setLoadingSave, ActionCreator.ActionCreatorEquipment.editEquipment,
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

    // Инициализация кнопок, появляющихся при редактировании записи
    const editButtonsComponent = checkTypeTab(rowData, deleteHandler, loadingDelete);

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form
                                    labelCol={{span: 6}}
                                    wrapperCol={{span: 18}}
                                    style={{marginTop: '5%'}}
                                    form={form}
                                    name={name}
                                    onFinish={saveHandler}
                                    onFinishFailed={onFailed}
                                >
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
                                        rules={[{required: true, message: "Введите название подразделения!"}]}
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
                            }
                        />
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}