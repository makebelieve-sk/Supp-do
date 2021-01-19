import React, {useEffect} from 'react';
import {Skeleton, Card, Form, Input, Row, Button, message, Select, Col} from 'antd';
import {useSelector, useDispatch} from "react-redux";

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";
import {PlusSquareOutlined} from "@ant-design/icons";

const {Meta} = Card;

export const PersonTab = ({add, specKey, onRemove}) => {
    const {request, loading, error, clearError} = useHttp();

    const {people, editTab, profession, departments} = useSelector((state) => ({
        people: state.people,
        editTab: state.editTab,
        profession: state.profession,
        departments: state.departments
    }));
    const dispatch = useDispatch();

    // Установка выпадающих списков полей "Профессии" и "Подразделение"
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
    let professionToOptions = [];
    if (profession && profession.length > 0) {
        profession.forEach((prof) => {
            let object = {
                label: prof.name,
                value: prof.name
            }

            professionToOptions.push(object);
        })
    }

    // При появлении ошибки, инициализируем окно вывода этой ошибки
    useEffect(() => {
        if (error) {
            message.error(error);
        }

        clearError();
    }, [dispatch, error, request, clearError]);

    let key = specKey === 'newPerson' ? 'newPerson' : `updatePerson-${editTab._id}`;
    let title = specKey === 'newPerson' ? 'Создание записи о сотруднике' : 'Редактирование записи о сотруднике';

    // Функция нажатия на кнопку "Сохранить"
    const onFinish = async (values) => {
        try {
            let method = specKey === 'newPerson' ? 'POST' : 'PUT';
            let body = specKey === 'newPerson' ? values : {editTab, values};

            const data = await request('/api/directory/person', method, body);
            message.success(data.message);

            onRemove(key, 'remove');

            specKey === 'newPerson' ? dispatch(ActionCreator.pushPerson(data.person)) :
                people.forEach((pers, index) => {
                    if (pers._id === data.person._id) {
                        dispatch(ActionCreator.editPerson(index, data.person));
                    }
                });
        } catch (e) {
        }
    };

    // Функция нажатия на кнопку "Удалить"
    const deleteHandler = async () => {
        try {
            if (editTab) {
                const data = await request('/api/directory/person', 'DELETE', editTab);
                message.success(data.message);

                onRemove(key, 'remove');

                people.forEach((pers, index) => {
                    if (pers._id === editTab._id) {
                        dispatch(ActionCreator.deletePerson(index));
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

    const handleChange = () => {
        form.setFieldsValue({sights: []});
    };

    return (
        <Card style={{width: '100%', marginTop: 16}}>
            <div className="container">
                <Skeleton loading={false} active>
                    <Meta
                        title={title}
                        description={
                            <Form name="control-ref" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                                <Form.Item
                                    label="ФИО"
                                    name="name"
                                    initialValue={specKey === 'newPerson' ? '' : editTab.name}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Введите ФИО сотрудника!',
                                        },
                                    ]}
                                >
                                    <Input/>
                                </Form.Item>

                                <Row gutter={8}>
                                    <Col span={22}>
                                        <Form.Item name="department" label="Подразделение">
                                            <Select options={departmentsToOptions} onChange={handleChange}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <Button icon={<PlusSquareOutlined/>} type="primary"/>
                                    </Col>
                                </Row>

                                <Row gutter={8}>
                                    <Col span={22}>
                                        <Form.Item name="profession" label="Профессия">
                                            <Select options={professionToOptions} onChange={handleChange}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <Button icon={<PlusSquareOutlined/>} type="primary"/>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="tabNumber"
                                    label="Табельный номер"
                                    initialValue={specKey === 'newPerson' ? '' : editTab.notes}
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    name="notes"
                                    label="Примечание"
                                    initialValue={specKey === 'newPerson' ? '' : editTab.notes}
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item>
                                    <Row justify="end">
                                        <Button type="primary" htmlType="submit" loading={loading}>
                                            Сохранить
                                        </Button>
                                        {specKey === 'newProfession' ? null :
                                            <Button type="danger" onClick={deleteHandler} loading={loading}
                                                    style={{marginLeft: 10}}>
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