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

export const PersonTab = ({add, specKey, onRemove, loadingData, tabData}) => {
    // Получение функции создания запросов на сервер, состояний загрузки/загрузки при удалении элемента и ошибки,
    // очищения ошибки
    const {request, loadingDelete, error, clearError} = useHttp();

    // Получение списков подразделений, профессий, вкладок и порсонала из хранилища redux
    const {people, professions, departments, tabs} = useSelector((state) => ({
        people: state.people,
        professions: state.professions,
        departments: state.departments,
        tabs: state.tabs
    }));
    const dispatch = useDispatch();

    // Создание стейта для значений в выпадающих списках "Подразделения" и "Персонал", начальных значений
    // и показа спиннера загрузки при сохранении
    const [selectDep, setSelectDep] = useState(null);
    const [selectProfession, setSelectProfession] = useState(null);
    const [departmentsToOptions, setDepartmentsToOptions] = useState([]);
    const [professionsToOptions, setProfessionsToOptions] = useState([]);
    const [loadingSave, setLoadingSave] = useState(false);

    let initialDepartment = null;
    let initialProfession = null;
    let initialDepartmentName = '';
    let initialProfName = '';

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
    if (tabData && tabData.profession) {
        initialDepartment = tabData.department;
        initialProfession = tabData.profession;

        initialDepartmentName = tabData.department.name;
        initialProfName = tabData.profession.name;
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
    }, [request, departments, professions]);

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

    let title = !tabData ? 'Создание записи о сотруднике' : 'Редактирование записи о сотруднике';

    // Функция сохранения записи
    const onSave = async (values) => {
        try {
            setLoadingSave(true);

            values.department = selectDep ? selectDep : initialDepartment;
            values.profession = selectProfession ? selectProfession : initialProfession;

            let method = !tabData ? 'POST' : 'PUT';
            let body = !tabData ? values : {tabData, values};

            const data = await request('/api/directory/people', method, body);

            if (data) {
                setLoadingSave(false);

                message.success(data.message);

                // Удаление текущей вкладки
                onRemove(specKey, 'remove');

                // Если это редактирование записи, то происходит изменение записи в хранилище redux,
                // иначе происходит запись новой записи в хранилище redux
                !tabData ? dispatch(ActionCreator.createPerson(data.person)) :
                    people.forEach((pers, index) => {
                        if (pers._id === data.person._id) {
                            dispatch(ActionCreator.editPerson(index, data.person));
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
                const data = await request('/api/directory/people', 'DELETE', tabData);

                if (data) {
                    message.success(data.message);
                    // Удаление текущей вкладки
                    onRemove(specKey, 'remove');

                    // Удаляем запись из хранилища redux
                    people.forEach((pers, index) => {
                        if (pers._id === tabData._id) {
                            dispatch(ActionCreator.deletePerson(index));
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
        if (professions && professions.length > 0) {
            let prof = professions.find((prf) => {
                return prf.name === value;
            });

            if (professions) {
                setSelectProfession(prof);
            }
        }

        form.setFieldsValue({profession: value});
    };

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{ span: 24 }} md={{ span: 20 }} lg={{ span: 16 }} xl={{ span: 12 }}>
                <Card className="card-style" bordered>
                    <Skeleton loading={false} active>
                        <Meta
                            title={title}
                            description={
                                <Form labelCol={{span: 6}} wrapperCol={{span: 18}} style={{marginTop: '5%'}} form={form}
                                      name="control-ref"
                                      onFinish={onSave} onFinishFailed={onFinishFailed}>
                                    <Form.Item
                                        label="ФИО"
                                        name="name"
                                        initialValue={!tabData ? '' : tabData.name}
                                        rules={[{required: true, message: 'Введите ФИО сотрудника!',}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item label="Подразделение">
                                        <Row gutter={8}>
                                            <Col xs={{ span: 20 }} sm={{ span: 20 }} md={{ span: 22 }} lg={{ span: 22 }} xl={{ span: 22 }}>
                                                <Form.Item
                                                    name="department"
                                                    noStyle
                                                    rules={[{required: true, message: 'Выберите подразделение!'}]}
                                                >
                                                    <Select options={departmentsToOptions}
                                                            onChange={handleChangeDepartment}/>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{ span: 4 }} sm={{ span: 4 }} md={{ span: 2 }} lg={{ span: 2 }} xl={{ span: 2 }}>
                                                <Button
                                                    style={{width: '100%'}}
                                                    onClick={() => add('Создание подразделения', DepartmentTab, 'newDepartment', tabs, null)}
                                                    icon={<PlusOutlined/>}
                                                    type="secondary"
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label="Профессия">
                                        <Row gutter={8}>
                                            <Col xs={{ span: 20 }} sm={{ span: 20 }} md={{ span: 22 }} lg={{ span: 22 }} xl={{ span: 22 }}>
                                                <Form.Item
                                                    name="profession"
                                                    noStyle
                                                    rules={[{required: true, message: 'Выберите сотрудника!'}]}
                                                >
                                                    <Select options={professionsToOptions} onChange={handleChangeProfession}/>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{ span: 4 }} sm={{ span: 4 }} md={{ span: 2 }} lg={{ span: 2 }} xl={{ span: 2 }}>
                                                <Button
                                                    style={{width: '100%'}}
                                                    onClick={() => add('Создание профессии', ProfessionTab, 'newProfession', tabs, null)}
                                                    icon={<PlusOutlined/>}
                                                    type="secondary"
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item
                                        name="tabNumber"
                                        label="Таб. номер"
                                        initialValue={!tabData ? '' : tabData.tabNumber}
                                    >
                                        <Input maxLength={255} type="number" style={{textAlign: 'right'}}/>
                                    </Form.Item>

                                    <Form.Item
                                        name="notes"
                                        label="Примечание"
                                        initialValue={!tabData ? '' : tabData.notes}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Row justify="end" style={{marginTop: 20}} xs={{ gutter: [8,8] }}>
                                        <Button className="button-style" type="primary" htmlType="submit" loading={loadingSave}
                                                icon={<CheckOutlined/>}>
                                            Сохранить
                                        </Button>
                                        {!tabData ? null :
                                            <>
                                                <Button className="button-style" type="danger" onClick={deleteHandler}
                                                        loading={loadingDelete} icon={<DeleteOutlined/>}>
                                                    Удалить
                                                </Button>
                                                <Button className="button-style" type="secondary" onClick={() => alert(1)}
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