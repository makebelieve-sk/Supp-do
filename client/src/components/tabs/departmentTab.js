import React, {useState, useEffect} from 'react';
import {Button, Card, Form, Input, message, Row, Select, Skeleton} from 'antd';
import {useDispatch, useSelector} from "react-redux";

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";
import {CheckOutlined, DeleteOutlined, PrinterOutlined, StopOutlined} from "@ant-design/icons";

const {Meta} = Card;

export const DepartmentTab = ({add, specKey, onRemove, loadingData, tabData}) => {
    // Получение функции создания запросов на сервер, состояний загрузки/загрузки при удалении элемента и ошибки,
    // очищения ошибки
    const {request, loading, loadingDelete, error, clearError} = useHttp();

    // Получение списка подразделений из хранилища redux
    const departments = useSelector((state) => state.departments);
    const dispatch = useDispatch();

    // Создание стейта для значений в выпадающем списке "Подразделения" и начального значения и
    // установка спиннера загрузки при сохранении записи
    const [selectDep, setSelectDep] = useState(null);
    const [departmentsToOptions, setDepartmentsToOptions] = useState([]);
    const [loadingSave, setLoadingSave] = useState(false);

    let initialDepartment = null;
    let initialName = '';

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
    if (tabData && tabData.parent) {
        initialDepartment = tabData;
        initialName = tabData.name;
    }

    // Обновление выпадающих списков
    useEffect(() => {
        const getDepartments = async () => {
            const data = await request('/api/directory/departments');
            let departmentsToOptions = [{label: 'Не выбрано', value: ''}];

            if (data) {
                data.forEach((department) => {
                    let object = {
                        label: department.name,
                        value: department.name
                    }

                    departmentsToOptions.push(object);
                })
            }

            setDepartmentsToOptions(departmentsToOptions);
        }

        getDepartments();
    }, [request, departments]);

    // Установка начального значения выпадающего списка, если вкладка редактируется
    useEffect(() => {
        form.setFieldsValue({parent: initialName});
    }, [form, initialName]);

    // При появлении ошибки, инициализируем окно вывода этой ошибки
    useEffect(() => {
        if (error) {
            message.error(error);
        }

        clearError();
    }, [dispatch, error, request, clearError]);

    let title = !tabData ? 'Создание подразделения' : 'Редактирование подразделения';

    // Функция сохранения записи
    const onSave = async (values) => {
        try {
            setLoadingSave(true);

            values.parent = selectDep ? selectDep : initialDepartment;

            let method = !tabData ? 'POST' : 'PUT';
            let body = !tabData ? values : {tabData, values};

            const data = await request('/api/directory/departments', method, body);

            if (data) {
                setLoadingSave(false);

                message.success(data.message);

                // Удаление текущей вкладки
                onRemove(specKey, 'remove');

                // Если это редактирование записи, то происходит изменение записи в хранилище redux,
                // иначе происходит запись новой записи в хранилище redux
                !tabData ? dispatch(ActionCreator.createDepartment(data.department)) :
                    departments.forEach((department, index) => {
                        if (department._id === data.department._id) {
                            dispatch(ActionCreator.editDepartment(index, data.department));
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
                const data = await request('/api/directory/departments', 'DELETE', tabData);

                if (data) {
                    message.success(data.message);

                    // Удаление текущей вкладки
                    onRemove(specKey, 'remove');

                    // Удаляем запись из хранилища redux
                    departments.forEach((department, index) => {
                        if (department._id === tabData._id) {
                            dispatch(ActionCreator.deleteDepartment(index));
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
        onRemove(specKey, 'remove');
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

        form.setFieldsValue({parent: value});
    };

    return (
        <div className="container">
            <Card style={{margin: '0 auto', width: '90%'}} bordered>
                <Skeleton loading={false} active>
                    <Meta
                        title={title}
                        description={
                            <Form labelCol={{span: 8}} wrapperCol={{span: 16}} style={{marginTop: '5%'}} form={form} name="control-ref"
                                  onFinish={onSave} onFinishFailed={onFinishFailed}>
                                <Form.Item name="parent" label="Принадлежит">
                                    <Select options={departmentsToOptions}
                                            onChange={(newValue) => handleChange(newValue)}/>
                                </Form.Item>

                                <Form.Item
                                    label="Наименование"
                                    name="name"
                                    initialValue={!tabData ? '' : tabData.name}
                                    rules={[{required: true, message: 'Введите название подразделения!'}]}
                                >
                                    <Input maxLength={255} type="text"/>
                                </Form.Item>

                                <Form.Item
                                    label="Примечание"
                                    name="notes"
                                    initialValue={!tabData ? '' : tabData.notes}
                                >
                                    <Input maxLength={255} type="text"/>
                                </Form.Item>

                                <Row justify="end" style={{marginTop: 20}}>
                                    <Button type="primary" htmlType="submit" loading={loadingSave}
                                            style={{width: '9em'}} icon={<CheckOutlined/>}>
                                        Сохранить
                                    </Button>
                                    {!tabData ? null :
                                        <>
                                            <Button type="danger" onClick={deleteHandler} loading={loadingDelete}
                                                    style={{marginLeft: 10, width: '9em'}} icon={<DeleteOutlined/>}>
                                                Удалить
                                            </Button>
                                            <Button type="secondary" onClick={() => alert(1)}
                                                    style={{marginLeft: 10, width: '9em'}} icon={<PrinterOutlined/>}>
                                                Печать
                                            </Button>
                                        </>
                                    }
                                    <Button type="secondary" onClick={cancelHandler}
                                            style={{marginLeft: 10, width: '9em'}} icon={<StopOutlined/>}>
                                        Отмена
                                    </Button>
                                </Row>
                            </Form>
                        }
                    />
                </Skeleton>
            </Card>
        </div>
    )
}