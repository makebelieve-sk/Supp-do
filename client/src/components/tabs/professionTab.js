import React, {useState} from 'react';
import {Card, Form, Input, Row, Col, Button, message, Skeleton} from 'antd';
import {useSelector, useDispatch} from "react-redux";
import {CheckOutlined, DeleteOutlined, PrinterOutlined, StopOutlined} from '@ant-design/icons';

import {request} from "../helpers/request.helper";
import {ActionCreator} from "../../redux/combineActions";

const {Meta} = Card;

export const ProfessionTab = ({specKey, onRemove}) => {
    // Инициализация стейта для показа спиннера загрузки при сохранении и удалении записи
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    // Получение списка профессий и загрузки записи из хранилища redux
    const {professions, rowData, loadingSkeleton} = useSelector((state) => ({
        professions: state.reducerProfession.professions,
        rowData: state.reducerProfession.rowDataProfession,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));
    const dispatch = useDispatch();

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Создание заголовка раздела
    let title = rowData ? 'Редактирование профессии' : 'Создание профессии';

    // Функция сохранения записи
    const onSave = async (values) => {
        try {
            setLoadingSave(true);

            let method = rowData ? 'PUT' : 'POST';

            const data = await request('/api/directory/professions', method, values);

            setLoadingSave(false);

            if (data) {
                message.success(data.message);

                // Удаление текущей вкладки
                onRemove(specKey, 'remove');

                // Если это редактирование записи, то происходит изменение записи в хранилище redux,
                // иначе происходит запись новой записи в хранилище redux
                rowData ?
                    professions.forEach((prof, index) => {
                        if (prof._id === data.profession._id) {
                            dispatch(ActionCreator.ActionCreatorProfession.editProfession(index, data.profession));
                        }
                    }) :
                    dispatch(ActionCreator.ActionCreatorProfession.createProfession(data.profession));
            }
        } catch (e) {}
    };

    // Функция удаления записи
    const deleteHandler = async () => {
        try {
            if (rowData) {
                setLoadingDelete(true);

                const data = await request('/api/directory/professions/' + rowData._id, 'DELETE', rowData);

                setLoadingDelete(false);

                if (data) {
                    message.success(data.message);

                    // Удаление текущей вкладки
                    onRemove(specKey, 'remove');

                    // Удаляем запись из хранилища redux
                    professions.forEach((prof, index) => {
                        if (prof._id === rowData._id) {
                            dispatch(ActionCreator.ActionCreatorProfession.deleteProfession(index));
                        }
                    });
                }
            }
        } catch (e) {}
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
                                        initialValue={!rowData ? '' : rowData._id}
                                    >
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item>
                                        <Row justify="end" style={{marginTop: 20}}>
                                            <Button className="button-style" type="primary" htmlType="submit"
                                                    loading={loadingSave} icon={<CheckOutlined/>}>
                                                Сохранить
                                            </Button>
                                            {!rowData ? null :
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