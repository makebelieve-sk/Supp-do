import React, { useEffect } from 'react';
import {Skeleton, Card, Form, Input, Button, message} from 'antd';
import {useDispatch} from "react-redux";

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";

const {Meta} = Card;

export const ProfessionTab = ({ onRemove }) => {
    const { request, loading, error, clearError } = useHttp();
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            message.error(error);
        }

        clearError();
    }, [dispatch, error, request, clearError]);

    const onFinish = async (values) => {
        try {
            const data = await request('/api/directory/professions', 'POST', values);
            message.success(data.message);

            onRemove('newProfession', 'remove');
            dispatch(ActionCreator.pushProfession(data.profession));
        } catch (e) {}
    };

    const onFinishFailed = () => {
        message.error('Заполните обязательные поля');
    };

    const cancelHandler = () => {
        onRemove('newProfession', 'remove');
    }

    return (
        <Card style={{width: 300, marginTop: 16}}>
            <Skeleton loading={false} active>
                <Meta
                    title="Создание профессии"
                    description={
                        <Form name="control-ref" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                            <Form.Item
                                label="Профессия"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Пожалуйтса, введите название профессии!',
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                name="notes"
                                label="Примечание"
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item>
                                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        Сохранить
                                    </Button>
                                    <Button type="danger" onClick={cancelHandler}>
                                        Отмена
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    }
                />
            </Skeleton>
        </Card>
    )
}