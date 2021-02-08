import React, {useState} from 'react';
import {Button, Card, Form, Input, message, Row, Col, Select, Skeleton} from 'antd';
import {useDispatch, useSelector} from "react-redux";

import {CheckOutlined, DeleteOutlined, PrinterOutlined, StopOutlined} from "@ant-design/icons";
import {request} from "../helpers/request.helper";
import {ActionCreator} from "../../redux/combineActions";

const {Meta} = Card;

export const DepartmentTab = ({specKey, onRemove}) => {
    // Инициализация стейта для показа спиннера загрузки при сохранении/удалении записи и обновлении
    // выпадающего списка
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingSelectDep, setLoadingSelectDep] = useState(false);

    // Получение списка подразделений и загрузки записи из хранилища redux
    const {departments, rowData, loadingSkeleton} = useSelector((state) => ({
        departments: state.reducerDepartment.departments,
        rowData: state.reducerDepartment.rowDataDepartment,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));
    const dispatch = useDispatch();

    // Создание стейта для значений в выпадающем списке "Подразделения" и начального значения и
    // установка спиннера загрузки при сохранении записи
    const [selectDep, setSelectDep] = useState(null);
    const [departmentsToOptions, setDepartmentsToOptions] = useState([]);

    let initialDepartment = null;

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
    if (rowData) {
        initialDepartment = rowData.parent;
    }

    // Создание заголовка раздела
    let title = rowData ? 'Редактирование подразделения' : 'Создание подразделения';

    // Функция сохранения записи
    const onSave = async (values) => {
        try {
            setLoadingSave(true);

            values.parent = selectDep === "Не выбрано" ? null : selectDep ? selectDep : initialDepartment;

            let method = rowData ? 'PUT' : 'POST';

            const data = await request('/api/directory/departments', method, values);

            setLoadingSave(true);

            if (data) {
                message.success(data.message);

                // Удаление текущей вкладки
                onRemove(specKey, 'remove');

                // Если это редактирование записи, то происходит изменение записи в хранилище redux,
                // иначе происходит запись новой записи в хранилище redux
                rowData ?
                    departments.forEach((department, index) => {
                        if (department._id === data.department._id) {
                            dispatch(ActionCreator.ActionCreatorDepartment.editDepartment(index, data.department));
                        }
                    }) :
                    dispatch(ActionCreator.ActionCreatorDepartment.createDepartment(data.department));
            }
        } catch (e) {}
    };

    // Функция удаления записи
    const deleteHandler = async () => {
        try {
            if (rowData) {
                setLoadingDelete(true);

                const data = await request('/api/directory/departments/' + rowData._id, 'DELETE', rowData);

                setLoadingDelete(false);

                if (data) {
                    message.success(data.message);

                    // Удаление текущей вкладки
                    onRemove(specKey, 'remove');

                    // Удаляем запись из хранилища redux
                    departments.forEach((department, index) => {
                        if (department._id === rowData._id) {
                            dispatch(ActionCreator.ActionCreatorDepartment.deleteDepartment(index));
                        }
                    });
                }
            }
        } catch (e) {
        }
    };

    // Вывод сообщения валидации формы
    const onFinishFailed = () => {
        message.error('Заполните обязательные поля').then(r => console.log(r));
    };

    // Функция нажатия на кнопку "Отмена"
    const cancelHandler = () => {
        onRemove(specKey, 'remove');
    };

    // Изменение значения в выпадающем списке "Подразделение", и сохранение этого значения в стейте
    const handleChange = (value) => {
        form.setFieldsValue({parent: value});

        if (value === "Не выбрано") {
            setSelectDep("Не выбрано");
            return null;
        }

        if (departments && departments.length > 0) {
            let department = departments.find((department) => {
                return department.name === value;
            });

            if (department) {
                setSelectDep(department);
            }
        }
    };

    // Обновление выпадающего списка "Подразделения"
    const dropDownRenderDepartments = async (open) => {
        if (open) {
            setLoadingSelectDep(true);

            const dataDepartments = await request('/api/directory/departments');

            dispatch(ActionCreator.ActionCreatorDepartment.getAllDepartments(dataDepartments));

            let departmentsToOptions = [{label: 'Не выбрано', value: ''}];

            if (dataDepartments) {
                dataDepartments.forEach((department) => {
                    let object = {
                        label: department.name,
                        value: department.name
                    }

                    departmentsToOptions.push(object);
                })
            }

            setLoadingSelectDep(false);

            setDepartmentsToOptions(departmentsToOptions);
        }
    }

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form labelCol={{span: 6}} wrapperCol={{span: 18}} style={{marginTop: '5%'}} form={form}
                                      name={rowData ? `control-ref-department-${rowData.name}` :
                                          "control-ref-department"}
                                      onFinish={onSave} onFinishFailed={onFinishFailed}>
                                    <Form.Item
                                        name="parent"
                                        initialValue={rowData && rowData.parent ? rowData.parent.name : "Не выбрано"}
                                        label="Принадлежит"
                                    >
                                        <Select
                                            options={departmentsToOptions}
                                            onDropdownVisibleChange={(open) => dropDownRenderDepartments(open)}
                                            loading={loadingSelectDep}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Наименование"
                                        name="name"
                                        initialValue={!rowData ? '' : rowData.name}
                                        rules={[{required: true, message: 'Введите название подразделения!'}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Примечание"
                                        name="notes"
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

                                    <Row justify="end" style={{marginTop: 20}} xs={{gutter: [8, 8]}}>
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
                                </Form>
                            }
                        />
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}