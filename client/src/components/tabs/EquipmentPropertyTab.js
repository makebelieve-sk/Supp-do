// Вкладка раздела "Характеристики оборудования"
import React, {useState} from 'react';
import {Card, Form, Input, Row, Col, Button, Skeleton} from 'antd';
import {useSelector} from "react-redux";
import {CheckOutlined, StopOutlined} from '@ant-design/icons';

import {ActionCreator} from "../../redux/combineActions";
import {CheckTypeTab, onCancel, onDelete, onFailed, onSave} from "../helpers/tab.helpers/tab.functions";

const {Meta} = Card;

export const EquipmentPropertyTab = ({specKey, onRemove}) => {
    // Инициализация стейта для показа спиннера загрузки при сохранении и удалении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Получение списка характеристик оборудования и загрузки записи из хранилища redux
    const {equipmentProperties, rowData, loadingSkeleton} = useSelector((state) => ({
        equipmentProperties: state.reducerEquipmentProperty.equipmentProperties,
        rowData: state.reducerEquipmentProperty.rowDataEquipmentProperty,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Создание заголовка раздела и имени формы
    const title = specKey === 'newEquipmentProperty' ? 'Создание характеристики оборудования' : 'Редактирование характеристики оборудования';
    const name = rowData ? `control-ref-equipment-property-${rowData.name}` : "control-ref-equipment-property";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = (values) => onSave(
        "equipment-property", values, setLoadingSave, ActionCreator.ActionCreatorEquipmentProperty.editEquipmentProperty,
        ActionCreator.ActionCreatorEquipmentProperty.createEquipmentProperty, equipmentProperties, onRemove, specKey, rowData
    ).then(null);

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = (setLoadingDelete, setVisiblePopConfirm) => onDelete(
        "equipment-property", setLoadingDelete, ActionCreator.ActionCreatorEquipmentProperty.deleteEquipmentProperty,
        equipmentProperties, onRemove, specKey, rowData, setVisiblePopConfirm
    ).then(null);

    // Обработка нажатия на кнопку "Отмена"
    const cancelHandler = () => onCancel(onRemove, specKey);

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form
                                    style={{marginTop: '5%'}}
                                    form={form}
                                    labelCol={{span: 6}}
                                    name={name}
                                    onFinish={saveHandler}
                                    onFinishFailed={onFailed}
                                    initialValues={{
                                        _id: rowData ? rowData._id : "",
                                        name: rowData ? rowData.name : "",
                                        notes: rowData ? rowData.notes : ""
                                    }}
                                >
                                    <Form.Item
                                        label="Наименование"
                                        name="name"
                                        rules={[{required: true, message: 'Введите наименование!'}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item name="notes" label="Примечание">
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item name="_id" hidden={true}>
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item>
                                        <Row justify="end" style={{marginTop: 20}}>
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
                                                icon={<StopOutlined/>}
                                            >
                                                Отмена
                                            </Button>
                                        </Row>
                                    </Form.Item>
                                </Form>
                            }
                        />
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}