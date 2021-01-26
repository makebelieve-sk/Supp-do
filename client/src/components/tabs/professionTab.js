import React, {useEffect} from 'react';
import {Skeleton, Card, Form, Input, Row, Button, message} from 'antd';
import {useSelector, useDispatch} from "react-redux";
import {CheckOutlined, DeleteOutlined, PrinterOutlined, StopOutlined} from '@ant-design/icons';

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";

const {Meta} = Card;

export const ProfessionTab = ({add, specKey, onRemove}) => {
    const {request, loading, loadingDelete, error, clearError} = useHttp();

    const {profession, editTab} = useSelector((state) => ({
        profession: state.profession,
        editTab: state.editTab
    }));
    const dispatch = useDispatch();

    let initialName, initialNotes;

    // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
    if (specKey !== 'newProfession' && editTab) {
        initialName = editTab.name;
        initialNotes = editTab.notes;
    }

    // Установка выпадающего списка поля "Принадлежит"
    const [form] = Form.useForm();

    // Установка начального значения выпадающего списка, если вкладка редактируется
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

    let key = specKey === 'newProfession' ? 'newProfession' : 'updateProfession';
    let title = specKey === 'newProfession' ? 'Создание профессии' : 'Редактирование профессии';

    // Функция нажатия на кнопку "Сохранить"
    const onFinish = async (values) => {
        try {
            let method = specKey === 'newProfession' ? 'POST' : 'PUT';
            let body = specKey === 'newProfession' ? values : {editTab, values};

            const data = await request('/api/directory/professions', method, body);
            message.success(data.message);

            onRemove(key, 'remove');

            specKey === 'newProfession' ? dispatch(ActionCreator.createProfession(data.profession)) :
                profession.forEach((prof, index) => {
                    if (prof._id === data.profession._id) {
                        dispatch(ActionCreator.editProfession(index, data.profession));
                    }
                });
        } catch (e) {
        }
    };

    // Функция нажатия на кнопку "Удалить"
    const deleteHandler = async () => {
        try {
            if (editTab) {
                const data = await request('/api/directory/professions', 'DELETE', editTab);
                message.success(data.message);

                onRemove(key, 'remove');

                profession.forEach((prof, index) => {
                    if (prof._id === editTab._id) {
                        dispatch(ActionCreator.deleteProfession(index));
                    }
                });
            }
        } catch (e) {
        }
    };

    // Вывод сообщения валидации
    const onFinishFailed = () => {
        message.error('Заполните обязательные поля');
    };

    // Функция нажатия на кнопку "Отмена"
    const cancelHandler = () => {
        onRemove(key, 'remove');
    }

    return (
        <div className="container">
            <Card style={{margin: '0 auto', width: '90%'}} bordered>
                <Skeleton loading={false} active>
                    <Meta
                        title={title}
                        description={
                            <Form style={{marginTop: '5%'}} form={form} name="control-ref"
                                  onFinish={onFinish} onFinishFailed={onFinishFailed}>
                                <Form.Item
                                    label="Профессия"
                                    name="name"
                                    initialValue={specKey === 'newProfession' ? '' : editTab.name}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Введите название профессии!',
                                        },
                                    ]}
                                >
                                    <Input maxLength={255} type="text"/>
                                </Form.Item>

                                <Form.Item
                                    name="notes"
                                    label="Примечание"
                                    initialValue={specKey === 'newProfession' ? '' : editTab.notes}
                                >
                                    <Input maxLength={255} type="text"/>
                                </Form.Item>

                                <Form.Item>
                                    <Row justify="end" style={{ marginTop: 20}}>
                                        <Button type="primary" htmlType="submit" loading={loading}
                                                style={{width: '9em'}} icon={<CheckOutlined />}>
                                            Сохранить
                                        </Button>
                                        {specKey === 'newProfession' ? null :
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