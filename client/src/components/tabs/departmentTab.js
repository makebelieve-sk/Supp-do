import React, {useState, useEffect} from 'react';
import {Button, Card, Form, Input, message, Row, Col, Select, Skeleton} from 'antd';
import {useDispatch, useSelector} from "react-redux";

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";
import {CheckOutlined, DeleteOutlined, PrinterOutlined, StopOutlined} from "@ant-design/icons";

const {Meta} = Card;

export const DepartmentTab = ({add, specKey, onRemove, loadingData, tabData}) => {
    // Получение функции создания запросов на сервер, состояний загрузки/загрузки при удалении элемента и ошибки,
    // очищения ошибки
    const {request, loadingDelete, error, clearError} = useHttp();

    // Получение списка подразделений и загрузки записи из хранилища redux
    const {departments, loadingSkeleton} = useSelector((state) => ({
        departments: state.departments,
        loadingSkeleton: state.loadingSkeleton
    }));
    const dispatch = useDispatch();

    // Создание стейта для значений в выпадающем списке "Подразделения" и начального значения и
    // установка спиннера загрузки при сохранении записи
    const [selectDep, setSelectDep] = useState(null);
    const [departmentsToOptions, setDepartmentsToOptions] = useState([]);
    const [loadingSave, setLoadingSave] = useState(false);

    let initialDepartment = null;
    let initialName = '';
    let initialNotes = '';
    let initialParent = '';

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
    if (tabData) {
        initialDepartment = tabData;
        initialName = tabData.name;
        initialNotes = tabData.notes;
        if (tabData.parent) {
            initialParent = tabData.parent.name
        }
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
        if (tabData) {
            form.setFieldsValue({name: initialName, notes: initialNotes, parent: initialParent});
        } else {
            return null;
        }
    }, [form, initialName, initialNotes, initialParent, tabData]);

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
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form labelCol={{span: 6}} wrapperCol={{span: 18}} style={{marginTop: '5%'}} form={form}
                                      name={tabData ? `control-ref-department-${tabData.name}` : "control-ref-department"}
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

                                    <Row justify="end" style={{marginTop: 20}} xs={{gutter: [8, 8]}}>
                                        <Button className="button-style" type="primary" htmlType="submit"
                                                loading={loadingSave}
                                                icon={<CheckOutlined/>}>
                                            Сохранить
                                        </Button>
                                        {!tabData ? null :
                                            <>
                                                <Button className="button-style" type="danger" onClick={deleteHandler}
                                                        loading={loadingDelete}
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
                                </Form>
                            }
                        />
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}