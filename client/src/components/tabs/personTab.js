import React, {useEffect, useState} from 'react';
import {Skeleton, Card, Form, Input, Row, Button, message, Select, Col} from 'antd';
import {useSelector, useDispatch} from "react-redux";

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";
import {
    CheckOutlined,
    DeleteOutlined,
    PlusOutlined,
    PrinterOutlined,
    StopOutlined
} from "@ant-design/icons";
import {ProfessionTab} from "./professionTab";
import {DepartmentTab} from "./departmentTab";

const {Meta} = Card;

export const PersonTab = ({add, specKey, onRemove}) => {
    const {request, loading, loadingDelete, error, clearError} = useHttp();

    const {people, editTab, profession, departments, tabs} = useSelector((state) => ({
        people: state.people,
        editTab: state.editTab,
        profession: state.profession,
        departments: state.departments,
        tabs: state.tabs
    }));
    const dispatch = useDispatch();

    const [selectDep, setSelectDep] = useState(null);
    const [selectProfession, setSelectProfession] = useState(null);
    const [departmentsToOptions, setDepartmentsToOptions] = useState([]);
    const [professionsToOptions, setProfessionsToOptions] = useState([]);

    let initialDepartment = null;
    let initialProfession = null;
    let initialDepartmentName = '';
    let initialProfName = '';

    // Установка выпадающих списков полей "Профессии" и "Подразделение"
    const [form] = Form.useForm();

    // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
    if (specKey !== 'newPerson' && editTab && editTab.profession) {
        initialDepartment = editTab.department;
        initialProfession = editTab.profession;

        initialDepartmentName = editTab.department.name;
        initialProfName = editTab.profession.name;
    }

    // Обновление выпадающих списков
    useEffect(() => {
        const getData = async () => {
            const dataDepartments = await request('/api/directory/departments');
            const dataProfessions = await request('/api/directory/professions');

            let departmentsToOptions = [{label: 'Не выбрано', value: ''}];
            let professionsToOptions = [{label: 'Не выбрано', value: ''}];

            if (dataDepartments) {
                dataDepartments.forEach((department) => {
                    let object = {
                        label: department.name,
                        value: department.name
                    }

                    departmentsToOptions.push(object);
                })
            }
            if (dataProfessions) {
                dataProfessions.forEach((prof) => {
                    let object = {
                        label: prof.name,
                        value: prof.name
                    }

                    professionsToOptions.push(object);
                })
            }

            setDepartmentsToOptions(departmentsToOptions);
            setProfessionsToOptions(professionsToOptions);
        }

        getData();
    }, [request, departments, profession]);

    // Установка начального значения выпадающего списка, если вкладка редактируется
    useEffect(() => {
        form.setFieldsValue({department: initialDepartmentName, profession: initialProfName});
    }, [form, initialDepartmentName, initialProfName]);

    // При появлении ошибки, инициализируем окно вывода этой ошибки
    useEffect(() => {
        if (error) {
            message.error(error);
        }

        clearError();
    }, [dispatch, error, request, clearError]);

    let key = specKey === 'newPerson' ? 'newPerson' : 'updatePerson';
    let title = specKey === 'newPerson' ? 'Создание записи о сотруднике' : 'Редактирование записи о сотруднике';

    // Функция нажатия на кнопку "Сохранить"
    const onFinish = async (values) => {
        try {
            values.department = selectDep ? selectDep : initialDepartment;
            values.profession = selectProfession ? selectProfession : initialProfession;

            let method = specKey === 'newPerson' ? 'POST' : 'PUT';
            let body = specKey === 'newPerson' ? values : {editTab, values};

            const data = await request('/api/directory/person', method, body);
            message.success(data.message);

            onRemove(key, 'remove');

            specKey === 'newPerson' ? dispatch(ActionCreator.createPerson(data.person)) :
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

    // Изменение значения в выпадающем списке "Подразделение", и сохранение этого значения в стейте
    const handleChangeDepartment = (value) => {
        if (departments && departments.length > 0) {
            let department = departments.find((department) => {
                return department.name === value;
            });

            if (department) {
                setSelectDep(department);
            }
        }

        form.setFieldsValue({department: value});
    };

    // Изменение значения в выпадающем списке "Персонал", и сохранение этого значения в стейте
    const handleChangeProfession = (value) => {
        if (profession && profession.length > 0) {
            let prof = profession.find((prf) => {
                return prf.name === value;
            });

            if (profession) {
                setSelectProfession(prof);
            }
        }

        form.setFieldsValue({profession: value});
    };

    return (
        <div className="container">
            <Card style={{margin: '0 auto', width: '90%'}} bordered>
                <Skeleton loading={false} active>
                    <Meta
                        title={title}
                        description={
                            <Form labelCol={{span: 8}} wrapperCol={{span: 16}} style={{marginTop: '5%'}} form={form}
                                  name="control-ref"
                                  onFinish={onFinish} onFinishFailed={onFinishFailed}>
                                <Form.Item
                                    label="ФИО"
                                    name="name"
                                    initialValue={specKey === 'newPerson' ? '' : editTab.name}
                                    rules={[{required: true, message: 'Введите ФИО сотрудника!',}]}
                                >
                                    <Input maxLength={255} type="text"/>
                                </Form.Item>

                                <Form.Item label="Подразделение">
                                    <Row gutter={8}>
                                        <Col span={22}>
                                            <Form.Item
                                                name="department"
                                                noStyle
                                                rules={[{required: true, message: 'Выберите подразделение!'}]}
                                            >
                                                <Select options={departmentsToOptions}
                                                        onChange={handleChangeDepartment}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <Button
                                                style={{width: '100%'}}
                                                onClick={() => add('Создание подразделения', DepartmentTab, 'newDepartment', tabs)}
                                                icon={<PlusOutlined/>}
                                                type="secondary"
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>

                                <Form.Item label="Профессия">
                                    <Row gutter={8}>
                                        <Col span={22}>
                                            <Form.Item
                                                name="profession"
                                                noStyle
                                                rules={[{required: true, message: 'Выберите сотрудника!'}]}
                                            >
                                                <Select options={professionsToOptions} onChange={handleChangeProfession}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <Button
                                                style={{width: '100%'}}
                                                onClick={() => add('Создание профессии', ProfessionTab, 'newProfession', tabs)}
                                                icon={<PlusOutlined/>}
                                                type="secondary"
                                            />
                                        </Col>
                                    </Row>
                                </Form.Item>

                                <Form.Item
                                    name="tabNumber"
                                    label="Табельный номер"
                                    initialValue={specKey === 'newPerson' ? '' : editTab.tabNumber}
                                >
                                    <Input maxLength={255} type="number" style={{textAlign: 'right'}}/>
                                </Form.Item>

                                <Form.Item
                                    name="notes"
                                    label="Примечание"
                                    initialValue={specKey === 'newPerson' ? '' : editTab.notes}
                                >
                                    <Input maxLength={255} type="text"/>
                                </Form.Item>

                                <Row justify="end" style={{marginTop: 20}}>
                                    <Button type="primary" htmlType="submit" loading={loading}
                                            style={{width: '9em'}} icon={<CheckOutlined/>}>
                                        Сохранить
                                    </Button>
                                    {specKey === 'newProfession' ? null :
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