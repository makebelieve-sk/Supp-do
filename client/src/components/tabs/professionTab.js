import React, {useEffect} from 'react';
import {Skeleton, Card, Form, Input, Row, Button, message} from 'antd';
import {useSelector, useDispatch} from "react-redux";

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";

const {Meta} = Card;

export const ProfessionTab = ({add, specKey, onRemove}) => {
    const {request, loading, error, clearError} = useHttp();

    const {profession, editTab} = useSelector((state) => ({
        profession: state.profession,
        editTab: state.editTab
    }));
    const dispatch = useDispatch();

    // При появлении ошибки, инициализируем окно вывода этой ошибки
    useEffect(() => {
        if (error) {
            message.error(error);
        }

        clearError();
    }, [dispatch, error, request, clearError]);

    let key = specKey === 'newProfession' ? 'newProfession' : `updateProfession-${editTab._id}`;
    let title = specKey === 'newProfession' ? 'Создание профессии' : 'Редактирование профессии';

    // Функция нажатия на кнопку "Сохранить"
    const onFinish = async (values) => {
        try {
            let method = specKey === 'newProfession' ? 'POST' : 'PUT';
            let body = specKey === 'newProfession' ? values : {editTab, values};

            const data = await request('/api/directory/professions', method, body);
            message.success(data.message);

            onRemove(key, 'remove');

            specKey === 'newProfession' ? dispatch(ActionCreator.pushProfession(data.profession)) :
                profession.forEach((prof, index) => {
                    if (prof._id === data.profession._id) {
                        dispatch(ActionCreator.editProfession(index, data.profession));
                    }
                });
        } catch (e) {}
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
        <Card style={{width: 300, marginTop: 16}}>
            <div className="container">
                <Skeleton loading={false} active>
                    <Meta
                        title={title}
                        description={
                            <Form name="control-ref" onFinish={onFinish} onFinishFailed={onFinishFailed}>
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
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    name="notes"
                                    label="Примечание"
                                    initialValue={specKey === 'newProfession' ? '' : editTab.notes}
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item>
                                    <Row justify="end">
                                        <Button type="primary" htmlType="submit" loading={loading}>
                                            Сохранить
                                        </Button>
                                        {specKey === 'newProfession' ? null :
                                            <Button type="danger" onClick={deleteHandler} loading={loading} style={{marginLeft: 10}}>
                                                Удалить
                                            </Button>
                                        }
                                        <Button type="secondary" onClick={cancelHandler} style={{marginLeft: 10}}>
                                            Отмена
                                        </Button>
                                    </Row>
                                </Form.Item>
                            </Form>
                        }
                    />
                </Skeleton>
            </div>
        </Card>
    )
}