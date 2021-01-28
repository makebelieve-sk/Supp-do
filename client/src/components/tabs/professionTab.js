import React, {useEffect, useState} from 'react';
import {Skeleton, Card, Form, Input, Row, Button, message} from 'antd';
import {useSelector, useDispatch} from "react-redux";
import {CheckOutlined, DeleteOutlined, PrinterOutlined, StopOutlined} from '@ant-design/icons';

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";

const {Meta} = Card;

export const ProfessionTab = ({add, specKey, onRemove, loadingData, tabData}) => {
    // Установка спиннера загрузки при сохранении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Получение функции создания запросов на сервер, состояний загрузки/загрузки при удалении элемента и ошибки,
    // очищения ошибки
    const {request, loading, loadingDelete, error, clearError} = useHttp();

    // Получение списка профессий из хранилища redux
    const professions = useSelector((state) => state.professions);
    const dispatch = useDispatch();

    // Определение начальных значений для полей "Наименование" и "Примечание"
    let initialName, initialNotes;

    // Если вкладка редактирования, то устанавливаем начальные значения для полей "Наименование" и "Примечание"
    if (tabData) {
        initialName = tabData.name;
        initialNotes = tabData.notes;
    }

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Установка начальных значений полей "Наименование" и "Примечание", и если вкладка редактируется
    useEffect(() => {
        form.setFieldsValue({name: initialName, notes: initialNotes});
    }, [form, initialName, initialNotes]);

    // При появлении ошибки, инициализируем окно вывода этой ошибки
    useEffect(() => {
        if (error) {
            message.error(error);
        }

        clearError();
    }, [dispatch, error, request, clearError]);

    let title = specKey === 'newProfession' ? 'Создание профессии' : 'Редактирование профессии';

    // Функция сохранения записи
    const onSave = async (values) => {
        try {
            setLoadingSave(true);

            let method = !tabData ? 'POST' : 'PUT';
            let body = !tabData ? values : {tabData, values};

            const data = await request('/api/directory/professions', method, body);

            if (data) {
                setLoadingSave(false);

                message.success(data.message);

                // Удаление текущей вкладки
                onRemove(specKey, 'remove');

                // Если это редактирование записи, то происходит изменение записи в хранилище redux,
                // иначе происходит запись новой записи в хранилище redux
                !tabData ?
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
            if (tabData) {
                const data = await request('/api/directory/professions', 'DELETE', tabData);

                if (data) {
                    message.success(data.message);

                    // Удаление текущей вкладки
                    onRemove(specKey, 'remove');

                    // Удаляем запись из хранилища redux
                    professions.forEach((prof, index) => {
                        if (prof._id === tabData._id) {
                            dispatch(ActionCreator.deleteProfession(index));
                        }
                    });
                }
            }
        } catch (e) {}
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
        <div className="container">
            <Card style={{margin: '0 auto', width: '90%'}} bordered>
                <Skeleton loading={loading} active>
                    <Meta
                        title={title}
                        description={
                            <Form style={{marginTop: '5%'}} form={form} name="control-ref"
                                  onFinish={onSave} onFinishFailed={onFinishFailed}>
                                <Form.Item
                                    label="Профессия"
                                    name="name"
                                    initialValue={!tabData ? '' : tabData.name}
                                    rules={[{required: true, message: 'Введите название профессии!'}]}
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

                                <Form.Item>
                                    <Row justify="end" style={{ marginTop: 20}}>
                                        <Button type="primary" htmlType="submit" loading={loadingSave}
                                                style={{width: '9em'}} icon={<CheckOutlined />}>
                                            Сохранить
                                        </Button>
                                        {!tabData ? null :
                                            <>
                                                <Button type="danger" onClick={deleteHandler} loading={loadingDelete}
                                                        style={{marginLeft: 10, width: '9em'}} icon={<DeleteOutlined/>}>
                                                    Удалить
                                                </Button>
                                                <Button type="secondary" onClick={() => alert(1)}
                                                        style={{marginLeft: 10, width: '9em'}} icon={<PrinterOutlined />}>
                                                    Печать
                                                </Button>
                                            </>
                                        }
                                        <Button type="secondary" onClick={cancelHandler}
                                                style={{marginLeft: 10, width: '9em'}} icon={<StopOutlined />}>
                                            Отмена
                                        </Button>
                                    </Row>
                                </Form.Item>
                            </Form>
                        }
                    />
                </Skeleton>
            </Card>
        </div>
    )
}