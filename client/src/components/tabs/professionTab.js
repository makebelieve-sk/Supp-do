import React, {useEffect, useState} from 'react';
import {Card, Form, Input, Row, Col, Button, message, Skeleton} from 'antd';
import {useSelector, useDispatch} from "react-redux";
import {CheckOutlined, DeleteOutlined, PrinterOutlined, StopOutlined} from '@ant-design/icons';

import ActionCreator from "../../redux/actionCreators";
import {request} from "../helpers/request.helper";

const {Meta} = Card;

export const ProfessionTab = ({specKey, onRemove}) => {
    // Установка спиннера загрузки при сохранении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Получение списка профессий и загрузки записи из хранилища redux
    const {professions, rowData, loadingSkeleton} = useSelector((state) => ({
        professions: state.professions,
        rowData: state.rowDataProfession,
        loadingSkeleton: state.loadingSkeleton
    }));
    const dispatch = useDispatch();

    // Определение начальных значений для полей "Наименование" и "Примечание"
    let initialName, initialNotes, initialId;

    // Если вкладка редактирования, то устанавливаем начальные значения для полей "Наименование" и "Примечание"
    if (rowData) {
        initialName = rowData.name;
        initialNotes = rowData.notes;
        initialId = rowData._id;
    }

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Установка начальных значений полей "Наименование" и "Примечание", и если вкладка редактируется
    useEffect(() => {
        if (rowData) {
            form.setFieldsValue({name: initialName, notes: initialNotes, _id: initialId});
        } else {
            return null;
        }
    }, [form, initialName, initialNotes, initialId, rowData]);

    let title = specKey === 'newProfession' ? 'Создание профессии' : 'Редактирование профессии';

    // Функция сохранения записи
    const onSave = async (values) => {
        try {
            setLoadingSave(true);

            let method = !rowData ? 'POST' : 'PUT';

            const data = await request('/api/directory/professions', method, values);

            if (data) {
                setLoadingSave(false);

                message.success(data.message);

                // Удаление текущей вкладки
                onRemove(specKey, 'remove');

                // Если это редактирование записи, то происходит изменение записи в хранилище redux,
                // иначе происходит запись новой записи в хранилище redux
                !rowData ?
                    dispatch(ActionCreator.createProfession(data.profession)) :
                    professions.forEach((prof, index) => {
                        if (prof._id === data.profession._id) {
                            dispatch(ActionCreator.editProfession(index, data.profession));
                        }
                    });
            }
        } catch (e) {
        }
    };

    // Функция удаления записи
    const deleteHandler = async () => {
        try {
            if (rowData) {
                const data = await request('/api/directory/professions/' + rowData._id, 'DELETE', rowData);

                if (data) {
                    message.success(data.message);

                    // Удаление текущей вкладки
                    onRemove(specKey, 'remove');

                    // Удаляем запись из хранилища redux
                    professions.forEach((prof, index) => {
                        if (prof._id === rowData._id) {
                            dispatch(ActionCreator.deleteProfession(index));
                        }
                    });
                }
            }
        } catch (e) {
        }
    };

    // Вывод сообщения валидации формы
    const onFinishFailed = () => {
        message.error('Заполните обязательные поля');
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
                                <Form style={{marginTop: '5%'}} form={form}
                                      name={rowData ? `control-ref-profession-${rowData.name}` :
                                          "control-ref-profession"}
                                      onFinish={onSave} onFinishFailed={onFinishFailed}>
                                    <Form.Item
                                        label="Профессия"
                                        name="name"
                                        initialValue={!rowData ? '' : rowData.name}
                                        rules={[{required: true, message: 'Введите название профессии!'}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item
                                        name="notes"
                                        label="Примечание"
                                        initialValue={!rowData ? '' : rowData.notes}
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
                                            {!rowData ? null :
                                                <>
                                                    <Button className="button-style" type="danger" onClick={deleteHandler}
                                                            icon={<DeleteOutlined/>}>
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