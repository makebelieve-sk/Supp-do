import React, {useState, useEffect} from 'react';
import {Button, Card, Form, Input, message, Row, Select, Skeleton} from 'antd';
import {useDispatch, useSelector} from "react-redux";

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";

const {Meta} = Card;

export const DepartmentTab = ({add, specKey, onRemove}) => {
    const {request, loading, loadingDelete, error, clearError} = useHttp();

    const {departments, editTab} = useSelector((state) => ({
        departments: state.departments,
        editTab: state.editTab
    }));
    const dispatch = useDispatch();

    const [ selectDep, setSelectDep ] = useState(null);

    let initialDepartment = null;
    let initialName = '';

    // Установка выпадающего списка поля "Принадлежит"
    const [form] = Form.useForm();
    let departmentsToOptions = [{ label: 'Не выбрано', value: '' }, ];
    if (departments && departments.length > 0) {
        departments.forEach((department) => {
            let object = {
                label: department.name,
                value: department.name
            }

            // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
            if (specKey !== 'newDepartment' && editTab && editTab.parent) {
                if (editTab.parent._id === department._id) {
                    initialDepartment = department;
                    initialName = department.name;
                }
            }

            departmentsToOptions.push(object);
        })
    }

    // Установка начального значения выпадающего списка, если вкладка редактируется
    useEffect(() => {
        form.setFieldsValue({ parent: initialName });
    }, [form, initialName]);

    // При появлении ошибки, инициализируем окно вывода этой ошибки
    useEffect(() => {
        if (error) {
            message.error(error);
        }

        clearError();
    }, [dispatch, error, request, clearError]);

    let key = specKey === 'newDepartment' ? 'newDepartment' : 'updateDepartment';
    let title = specKey === 'newDepartment' ? 'Создание подразделения' : 'Редактирование подразделения';

    // Функция нажатия на кнопку "Сохранить"
    const onFinish = async (values) => {
        try {
            values.parent = selectDep ? selectDep : initialDepartment;

            let method = specKey === 'newDepartment' ? 'POST' : 'PUT';
            let body = specKey === 'newDepartment' ? values : {editTab, values};

            const data = await request('/api/directory/departments', method, body);

            message.success(data.message);

            onRemove(key, 'remove');

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

    // Изменение значения в выпадающем списке "Подразделение", и сохранение этого значения в стейте
    const handleChange = (value) => {
        if (departments && departments.length > 0) {
            let department = departments.find((department) => {
                return department.name === value;
            });

            if (department) {
                setSelectDep(department);
            }
        }

        form.setFieldsValue({ parent: value });
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
                                    <Select options={departmentsToOptions} onChange={(newValue) => handleChange(newValue)} />
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
                                            <Button type="danger" onClick={deleteHandler} loading={loadingDelete} style={{marginLeft: 10}}>
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