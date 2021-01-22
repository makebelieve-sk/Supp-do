import React, {useEffect, useState} from 'react';
import {Skeleton, Card, Form, Input, Row, Button, message, Select, Col} from 'antd';
import {useSelector, useDispatch} from "react-redux";

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";
import {PlusSquareOutlined} from "@ant-design/icons";
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

    const [ selectDep, setSelectDep ] = useState(null);
    const [ selectProfession, setSelectProfession ] = useState(null);

    let initialDepartment = null;
    let initialProfession = null;
    let initialDepartmentName = '';
    let initialProfName = '';

    // Установка выпадающих списков полей "Профессии" и "Подразделение"
    const [form] = Form.useForm();
    let departmentsToOptions = [{ label: 'Не выбрано', value: '' }, ];
    if (departments && departments.length > 0) {
        departments.forEach((department) => {
            let object = {
                label: department.name,
                value: department.name
            }

            // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
            if (specKey !== 'newPerson' && editTab && editTab.department) {
                if (editTab.department._id === department._id) {
                    initialDepartment = department;
                    initialDepartmentName = department.name;
                }
            }

            departmentsToOptions.push(object);
        })
    }
    let professionToOptions = [{ label: 'Не выбрано', value: '' }, ];
    if (profession && profession.length > 0) {
        profession.forEach((prof) => {
            let object = {
                label: prof.name,
                value: prof.name
            }

            // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
            if (specKey !== 'newPerson' && editTab && editTab.profession) {
                if (editTab.profession._id === prof._id) {
                    initialProfession = prof;
                    initialProfName = prof.name;
                }
            }

            professionToOptions.push(object);
        })
    }

    // Установка начального значения выпадающего списка, если вкладка редактируется
    useEffect(() => {
        form.setFieldsValue({ department: initialDepartmentName, profession: initialProfName });
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

            specKey === 'newPerson' ? dispatch(ActionCreator.pushPerson(data.person)) :
                people.forEach((pers, index) => {
                    if (pers._id === data.person._id) {
                        dispatch(ActionCreator.editPerson(index, data.person));
                    }
                });
        } catch (e) {}
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
        } catch (e) {}
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

        form.setFieldsValue({ department: value });
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

        form.setFieldsValue({ profession: value });
    };

    return (
        <Card style={{width: '100%', marginTop: 16}}>
            <div className="container">
                <Skeleton loading={false} active>
                    <Meta
                        title={title}
                        description={
                            <Form form={form} name="control-ref" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                                <Form.Item
                                    label="ФИО"
                                    name="name"
                                    initialValue={specKey === 'newPerson' ? '' : editTab.name}
                                    rules={[{required: true, message: 'Введите ФИО сотрудника!',}]}
                                >
                                    <Input/>
                                </Form.Item>

                                <Row gutter={8}>
                                    <Col span={22}>
                                        <Form.Item
                                            name="department"
                                            label="Подразделение"
                                            rules={[{required: true, message: 'Выберите подразделение!',}]}
                                        >
                                            <Select options={departmentsToOptions} onChange={handleChangeDepartment}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <Button
                                            onClick={() => add('Создание подразделения', DepartmentTab, 'newDepartment', tabs)}
                                            icon={<PlusSquareOutlined/>}
                                            type="primary"
                                        />
                                    </Col>
                                </Row>

                                <Row gutter={8}>
                                    <Col span={22}>
                                        <Form.Item
                                            name="profession"
                                            label="Профессия"
                                            rules={[{required: true, message: 'Выберите сотрудника!',}]}
                                        >
                                            <Select options={professionToOptions} onChange={handleChangeProfession}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <Button
                                            onClick={() => add('Создание профессии', ProfessionTab, 'newProfession', tabs)}
                                            icon={<PlusSquareOutlined/>}
                                            type="primary"
                                        />
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="tabNumber"
                                    label="Табельный номер"
                                    initialValue={specKey === 'newPerson' ? '' : editTab.tabNumber}
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
                                            <Button type="danger" onClick={deleteHandler} loading={loadingDelete}
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