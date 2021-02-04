// Вкладка раздела Характеристики оборудования
import React, {useEffect, useState} from 'react';
import {Card, Form, Input, Row, Col, Button, message, Skeleton} from 'antd';
import {useSelector, useDispatch} from "react-redux";
import {CheckOutlined, DeleteOutlined, PrinterOutlined, StopOutlined} from '@ant-design/icons';

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";

const {Meta} = Card;

export const EquipmentPropertyTab = ({add, specKey, onRemove, loadingData, tabData}) => {
    // Установка спиннера загрузки при сохранении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Получение функции создания запросов на сервер, состояний загрузки/загрузки при удалении элемента и ошибки,
    // очищения ошибки
    const {request, loadingDelete, error, clearError} = useHttp();

    // Получение списка характеристик оборудования и загрузки записи из хранилища redux
    const {equipmentProperties, loadingSkeleton} = useSelector((state) => ({
        equipmentProperties: state.equipmentProperties,
        loadingSkeleton: state.loadingSkeleton
    }));
    const dispatch = useDispatch();

    // Определение начальных значений для полей "Наименование" и "Примечание"
    let initialName, initialNotes, initialId;

    // Если вкладка редактирования, то устанавливаем начальные значения для полей "Наименование" и "Примечание"
    if (tabData) {
        initialName = tabData.name;
        initialNotes = tabData.notes;
        initialId = tabData._id;
    }

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Установка начальных значений полей "Наименование" и "Примечание", и если вкладка редактируется
    useEffect(() => {
        if (tabData) {
            form.setFieldsValue({name: initialName, notes: initialNotes, _id: initialId});
        } else {
            return null;
        }
    }, [form, initialName, initialNotes, initialId, tabData]);

    // При появлении ошибки, инициализируем окно вывода этой ошибки
    useEffect(() => {
        if (error) {
            message.error(error).then(r => console.log(r));
        }

        clearError();
    }, [dispatch, error, request, clearError]);

    // Заголовок вкладки
    let title = specKey === 'newEquipmentProperty' ? 'Создание характеристики оборудования' : 'Редактирование характеристики оборудования';

    // Функция сохранения записи
    const onSave = async (values) => {
        try {
            setLoadingSave(true);

            let method = !tabData ? 'POST' : 'PUT';

            const data = await request('/api/directory/equipment-property', method, values);

            if (data) {
                setLoadingSave(false);

                message.success(data.message);

                // Удаление текущей вкладки
                onRemove(specKey, 'remove');

                // Если это редактирование записи, то происходит изменение записи в хранилище redux,
                // иначе происходит запись новой записи в хранилище redux
                !tabData ?
                    dispatch(ActionCreator.createEquipmentProperty(data.equipmentProperty)) :
                    equipmentProperties.forEach((equipmentProp, index) => {
                        if (equipmentProp._id === data.equipmentProperty._id) {
                            dispatch(ActionCreator.editEquipmentProperty(index, data.equipmentProperty));
                        }
                    });
            }
        } catch (e) {
        }
    };

    // Функция удаления записи
    const deleteHandler = async () => {
        try {
            if (tabData) {
                const data = await request('/api/directory/equipment-property/' + tabData._id, 'DELETE', tabData);

                if (data) {
                    message.success(data.message);

                    // Удаление текущей вкладки
                    onRemove(specKey, 'remove');

                    // Удаляем запись из хранилища redux
                    equipmentProperties.forEach((equipmentProp, index) => {
                        if (equipmentProp._id === tabData._id) {
                            dispatch(ActionCreator.deleteEquipmentProperty(index));
                        }
                    });
                }
            }
        } catch (e) {
        }
    };

    // Вывод сообщения валидации формы
    const onFinishFailed = () => {
        message.error('Заполните обязательные поля').then(r => console.log(r));
    };

    // Функция нажатия на кнопку "Отмена"
    const cancelHandler = () => {
        // Удаляем текущую вкладку
        onRemove(specKey, 'remove');
    }

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form style={{marginTop: '5%'}} form={form} labelCol={{span: 6}}
                                      name={tabData ? `control-ref-equipment-property-${tabData.name}` :
                                          "control-ref-equipment-property"}
                                      onFinish={onSave} onFinishFailed={onFinishFailed}>
                                    <Form.Item
                                        label="Наименование"
                                        name="name"
                                        initialValue={!tabData ? '' : tabData.name}
                                        rules={[{required: true, message: 'Введите наименование!'}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item
                                        name="notes"
                                        label="Примечание"
                                        initialValue={!tabData ? '' : tabData.notes}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item
                                        name="_id"
                                        hidden={true}
                                    >
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item>
                                        <Row justify="end" style={{marginTop: 20}}>
                                            <Button className="button-style" type="primary" htmlType="submit"
                                                    loading={loadingSave}
                                                    icon={<CheckOutlined/>}>
                                                Сохранить
                                            </Button>
                                            {!tabData ? null :
                                                <>
                                                    <Button className="button-style" type="danger" onClick={deleteHandler}
                                                            loading={loadingDelete} icon={<DeleteOutlined/>}>
                                                        Удалить
                                                    </Button>
                                                    <Button className="button-style" type="secondary"
                                                            onClick={() => alert(1)}
                                                            icon={<PrinterOutlined/>}>
                                                        Печать
                                                    </Button>
                                                </>
                                            }
                                            <Button className="button-style" type="secondary" onClick={cancelHandler}
                                                    icon={<StopOutlined/>}>
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