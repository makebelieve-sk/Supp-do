import React, {useEffect} from 'react';
import {Button, Card, Form, Input, message, Row, Select, Skeleton} from 'antd';
import {useDispatch, useSelector} from "react-redux";

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";

const {Meta} = Card;

export const DepartmentTab = ({add, specKey, onRemove}) => {
    const {request, loading, error, clearError} = useHttp();

    const {departments, editTab} = useSelector((state) => ({
        departments: state.departments,
        editTab: state.editTab
    }));
    const dispatch = useDispatch();

    // Установка выпадающего списка поля "Принадлежит"
    const [form] = Form.useForm();
    let departmentsToOptions = [];
    if (departments && departments.length > 0) {
        departments.forEach((department) => {
            let object = {
                label: department.name,
                value: department.name
            }

            departmentsToOptions.push(object);
        })
    }

    // При появлении ошибки, инициализируем окно вывода этой ошибки
    useEffect(() => {
        if (error) {
            message.error(error);
        }

        clearError();
    }, [dispatch, error, request, clearError]);

    let key = specKey === 'newDepartment' ? 'newDepartment' : `updateDepartment-${editTab._id}`;
    let title = specKey === 'newDepartment' ? 'Создание подразделения' : 'Редактирование подразделения';

    // Функция нажатия на кнопку "Сохранить"
    const onFinish = async (values) => {
        try {
            let method = specKey === 'newDepartment' ? 'POST' : 'PUT';
            let body = specKey === 'newDepartment' ? values : {editTab, values};

            const data = await request('/api/directory/departments', method, body);
            message.success(data.message);

            onRemove(key, 'remove');

            data.department['parent'] = values.parent;
            specKey === 'newDepartment' ? dispatch(ActionCreator.pushDepartment(data.department)) :
                departments.forEach((department, index) => {
                    if (department._id === data.department._id) {
                        dispatch(ActionCreator.editDepartment(index, data.department));
                    }
                });
        } catch (e) {}
    };

    // Функция нажатия на кнопку "Удалить"
    const deleteHandler = async () => {
        try {
            if (editTab) {
                const data = await request('/api/directory/departments', 'DELETE', editTab);
                message.success(data.message);

                onRemove(key, 'remove');

                departments.forEach((department, index) => {
                    if (department._id === editTab._id) {
                        dispatch(ActionCreator.deleteDepartment(index));
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
    };

    const handleChange = () => {
        form.setFieldsValue({ sights: [] });
    };

    return (
        <Card style={{width: '100%', marginTop: 16}}>
            <div className="container">
                <Skeleton loading={false} active>
                    <Meta
                        title={title}
                        description={
                            <Form form={form} name="control-ref" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                                <Form.Item name="parent" label="Принадлежит">
                                    <Select options={departmentsToOptions} onChange={handleChange} />
                                </Form.Item>

                                <Form.Item
                                    label="Наименование"
                                    name="name"
                                    initialValue={specKey === 'newDepartment' ? '' : editTab.name}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Введите название подразделения!',
                                        },
                                    ]}
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    label="Примечание"
                                    name="notes"
                                    initialValue={specKey === 'newDepartment' ? '' : editTab.notes}
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item>
                                    <Row justify="end">
                                        <Button type="primary" htmlType="submit" loading={loading}>
                                            Сохранить
                                        </Button>
                                        {specKey === 'newDepartment' ? null :
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