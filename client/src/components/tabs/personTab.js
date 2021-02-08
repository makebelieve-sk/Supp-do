import React, {useState} from 'react';
import {Card, Form, Input, Row, Button, message, Select, Col, Skeleton} from 'antd';
import {useSelector, useDispatch} from "react-redux";
import {
    CheckOutlined,
    DeleteOutlined,
    PlusOutlined,
    PrinterOutlined,
    StopOutlined
} from "@ant-design/icons";

import {request} from "../helpers/request.helper";
import {RowMapHelper} from "../helpers/dataTableMap.helper";
import {ActionCreator} from "../../redux/combineActions";

const {Meta} = Card;

export const PersonTab = ({specKey, onRemove}) => {
    // Получение списков подразделений, профессий, вкладок, порсонала и загрузки записи из хранилища redux
    const {people, professions, departments, rowData, loadingSkeleton} = useSelector((state) => ({
        professions: state.reducerProfession.professions,
        departments: state.reducerDepartment.departments,
        people: state.reducerPerson.people,
        rowData: state.reducerPerson.rowDataPerson,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));
    const dispatch = useDispatch();

    // Создание стейта для значений в выпадающих списках "Подразделения" и "Персонал", начальных значений
    // показ спиннера загрузки при сохранении, показ спиннера загрузки при обновлении выпадающи списков
    const [selectDep, setSelectDep] = useState(null);
    const [selectProfession, setSelectProfession] = useState(null);
    const [departmentsToOptions, setDepartmentsToOptions] = useState([]);
    const [professionsToOptions, setProfessionsToOptions] = useState([]);
    const [loadingSelectDep, setLoadingSelectDep] = useState(false);
    const [loadingSelectProf, setLoadingSelectProf] = useState(false);

    let initialDepartment = null;
    let initialProfession = null;

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
    if (rowData) {
        if (rowData.department && rowData.profession) {
            initialDepartment = rowData.department;
            initialProfession = rowData.profession;
        }
    }

    let title = rowData ? 'Редактирование записи о сотруднике' : 'Создание записи о сотруднике';

    // Функция сохранения записи
    const onSave = async (values) => {
        try {
            values.department = selectDep ? selectDep : initialDepartment;
            values.profession = selectProfession ? selectProfession : initialProfession;

            let method = !rowData ? 'POST' : 'PUT';

            const data = await request('/api/directory/people', method, values);

            if (data) {
                message.success(data.message);

                // Удаление текущей вкладки
                onRemove(specKey, 'remove');

                // Если это редактирование записи, то происходит изменение записи в хранилище redux,
                // иначе происходит запись новой записи в хранилище redux
                rowData ?
                    people.forEach((pers, index) => {
                        if (pers._id === data.person._id) {
                            dispatch(ActionCreator.ActionCreatorPerson.editPerson(index, data.person));
                        }
                    }) :
                    dispatch(ActionCreator.ActionCreatorPerson.createPerson(data.person));
            }
        } catch (e) {}
    };

    // Функция удаления записи
    const deleteHandler = async () => {
        try {
            if (rowData) {
                const data = await request('/api/directory/people/' + rowData._id, 'DELETE', rowData);

                if (data) {
                    message.success(data.message);
                    // Удаление текущей вкладки
                    onRemove(specKey, 'remove');

                    // Удаляем запись из хранилища redux
                    people.forEach((pers, index) => {
                        if (pers._id === rowData._id) {
                            dispatch(ActionCreator.ActionCreatorPerson.deletePerson(index));
                        }
                    });
                }
            }
        } catch (e) {}
    };

    // Вывод сообщения валидации формы
    const onFinishFailed = () => {
        message.error('Заполните обязательные поля').then(r => console.log(r));
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

    // Обновление выпадающего списка "Профессии"
    const dropDownRenderProfessions = async (open) => {
        if (open) {
            setLoadingSelectProf(true);

            const dataProfessions = await request('/api/directory/professions');

            dispatch(ActionCreator.ActionCreatorProfession.getAllProfessions(dataProfessions));

            let professionsToOptions = [{label: 'Не выбрано', value: ''}];
            if (dataProfessions) {
                dataProfessions.forEach((prof) => {
                    let object = {
                        label: prof.name,
                        value: prof.name
                    }

                    professionsToOptions.push(object);
                })
            }

            setLoadingSelectProf(false);

            setProfessionsToOptions(professionsToOptions);
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
                                <Form labelCol={{span: 6}} wrapperCol={{span: 18}} style={{marginTop: '5%'}}
                                      form={form} name={rowData ? `control-ref-person-${rowData.name}` :
                                    "control-ref-person"}
                                      onFinish={onSave} onFinishFailed={onFinishFailed}>
                                    <Form.Item
                                        label="ФИО"
                                        name="name"
                                        initialValue={!rowData ? '' : rowData.name}
                                        rules={[{required: true, message: 'Введите ФИО сотрудника!',}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item label="Подразделение">
                                        <Row gutter={8}>
                                            <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}}
                                                 xl={{span: 22}}>
                                                <Form.Item
                                                    name="department"
                                                    noStyle
                                                    initialValue={rowData && rowData.department ? rowData.department.name : "Не выбрано"}
                                                    rules={[{required: true, message: 'Выберите подразделение!'}]}
                                                >
                                                    <Select
                                                        options={departmentsToOptions}
                                                        onDropdownVisibleChange={(open) => dropDownRenderDepartments(open)}
                                                        loading={loadingSelectDep}
                                                        onChange={handleChangeDepartment}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{span: 4}} sm={{span: 4}} md={{span: 2}} lg={{span: 2}}
                                                 xl={{span: 2}}>
                                                <Button
                                                    style={{width: '100%'}}
                                                    onClick={() => RowMapHelper('departments', null)}
                                                    icon={<PlusOutlined/>}
                                                    type="secondary"
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label="Профессия">
                                        <Row gutter={8}>
                                            <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}}
                                                 xl={{span: 22}}>
                                                <Form.Item
                                                    name="profession"
                                                    noStyle
                                                    initialValue={rowData && rowData.profession ? rowData.profession.name : "Не выбрано"}
                                                    rules={[{required: true, message: 'Выберите сотрудника!'}]}
                                                >
                                                    <Select
                                                        options={professionsToOptions}
                                                        onDropdownVisibleChange={(open) => dropDownRenderProfessions(open)}
                                                        loading={loadingSelectProf}
                                                        onChange={handleChangeProfession}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{span: 4}} sm={{span: 4}} md={{span: 2}} lg={{span: 2}}
                                                 xl={{span: 2}}>
                                                <Button
                                                    style={{width: '100%'}}
                                                    onClick={() => RowMapHelper('professions', null)}
                                                    icon={<PlusOutlined/>}
                                                    type="secondary"
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item
                                        name="tabNumber"
                                        label="Таб. номер"
                                        initialValue={!rowData ? '' : rowData.tabNumber}
                                    >
                                        <Input maxLength={255} type="number" style={{textAlign: 'right'}}/>
                                    </Form.Item>

                                    <Form.Item
                                        name="notes"
                                        label="Примечание"
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
                                                icon={<CheckOutlined/>}>
                                            Сохранить
                                        </Button>
                                        {!rowData ? null :
                                            <>
                                                <Button className="button-style" type="danger" onClick={deleteHandler}
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