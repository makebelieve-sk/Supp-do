// Вкладка "Персонал"
import React, {useState} from 'react';
import {Card, Form, Input, Row, Button, Select, Col, Skeleton} from 'antd';
import {useSelector} from "react-redux";
import {CheckOutlined, PlusOutlined, StopOutlined} from "@ant-design/icons";

import {RowMapHelper} from "../helpers/table.helpers/tableMap.helper";
import {ActionCreator} from "../../redux/combineActions";
import {CheckTypeTab, onSave, onDelete, onFailed, onCancel, onChange, onDropDownRender} from "../helpers/tab.helpers/tab.functions";
import getParents from "../helpers/getRowParents.helper";

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

    // Создание стейта для значений в выпадающих списках "Подразделения" и "Персонал", начальных значений
    // показ спиннера загрузки при сохранении, показ спиннера загрузки при обновлении выпадающи списков
    const [departmentsToOptions, setDepartmentsToOptions] = useState([]);
    const [professionsToOptions, setProfessionsToOptions] = useState([]);

    // Инициализация стейта для показа спиннера загрузки в выпадающих меню
    const [loadingSelectDep, setLoadingSelectDep] = useState(false);
    const [loadingSelectProf, setLoadingSelectProf] = useState(false);

    // Инициализация стейта для показа спиннера загрузки при сохранении
    const [loadingSave, setLoadingSave] = useState(false);

    // Инициализация первоначальных значений в в выпадающих списках
    let initialDepartment = null, initialProfession = null, foundParentName = {};

    // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
    if (rowData) {
        if (rowData.department && rowData.profession) {
            initialDepartment = rowData.department;
            initialProfession = rowData.profession;
        } else if (rowData.department) {
            initialDepartment = rowData.department;
        } else if (rowData.profession) {
            initialProfession = rowData.profession;
        }

        if (departments && departments.length && rowData.department) {
            departments.forEach(item => {
                if (item.parent) {
                    item.nameWithParent = getParents(item, departments) + item.name;
                } else {
                    item.nameWithParent = item.name;
                }
            })

            foundParentName = departments.find(item => item._id === rowData.department._id);
        }
    }

    // Инициализация выбранного элемента из выпадающих списков
    const [selectDep, setSelectDep] = useState(null);
    const [selectProfession, setSelectProfession] = useState(null);

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Создание заголовка раздела и имени формы
    const title = rowData ? 'Редактирование записи о сотруднике' : 'Создание записи о сотруднике';
    const name = rowData ? `control-ref-person-${rowData.name}` : "control-ref-person";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = (values) => {
        values.department = selectDep === "Не выбрано" ? null : selectDep ? selectDep : initialDepartment;
        values.profession = selectProfession === "Не выбрано" ? null : selectProfession ? selectProfession : initialProfession;

        onSave(
            "people", values, setLoadingSave, ActionCreator.ActionCreatorPerson.editPerson,
            ActionCreator.ActionCreatorPerson.createPerson, people, onRemove, specKey, rowData
        ).then(null);
    }

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = (setLoadingDelete, setVisiblePopConfirm) => onDelete(
        "people", setLoadingDelete, ActionCreator.ActionCreatorPerson.deletePerson,
        people, onRemove, specKey, rowData, setVisiblePopConfirm
    ).then(null);

    // Обработка нажатия на кнопку "Отмена"
    const cancelHandler = () => onCancel(onRemove, specKey);

    // Изменение значения в выпадающем списке "Подразделение", и сохранение этого значения в стейте
    const changeHandler = (value, dataStore) => {
        const setSelect = dataStore === departments ? setSelectDep : setSelectProfession;

        onChange(form, value, setSelect, dataStore);
    };

    // Изменение значения в выпадающем списке "Профессия"
    const changeHandlerProfession = (value) => {
        if (value === "Не выбрано") {
            setSelectProfession(value);
            return null;
        }

        if (professions && professions.length > 0) {
            let foundProfession = professions.find((prof) => {
                return prof.name === value;
            });

            if (foundProfession) {
                setSelectProfession(foundProfession);
            }
        }
    };

    // Обновление выпадающего списка
    const dropDownRenderHandler = (open, dataStore) => {
        let setLoading = setLoadingSelectProf,
            key = "professions",
            dispatchAction = ActionCreator.ActionCreatorProfession.getAllProfessions,
            setSelectToOptions = setProfessionsToOptions;

        if (dataStore === departments) {
            setLoading = setLoadingSelectDep;
            key = "departments";
            dispatchAction = ActionCreator.ActionCreatorDepartment.getAllDepartments;
            setSelectToOptions = setDepartmentsToOptions;
        }

        onDropDownRender(open, setLoading, key, dispatchAction, setSelectToOptions).then(null);
    }

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form
                                    labelCol={{span: 6}} wrapperCol={{span: 18}} style={{marginTop: '5%'}}
                                    form={form}
                                    name={name}
                                    onFinish={saveHandler}
                                    onFinishFailed={onFailed}
                                    initialValues={{
                                        _id: rowData ? rowData._id : "",
                                        name: rowData ? rowData.name : "",
                                        department: rowData && rowData.department && foundParentName ? foundParentName.nameWithParent : "Не выбрано",
                                        profession: rowData && rowData.profession ? rowData.profession.name : "Не выбрано",
                                        notes: rowData ? rowData.notes : ""
                                    }}
                                >
                                    <Form.Item
                                        label="ФИО"
                                        name="name"
                                        rules={[{required: true, message: 'Введите ФИО сотрудника!',}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item label="Подразделение">
                                        <Row gutter={8}>
                                            <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                                <Form.Item
                                                    name="department"
                                                    noStyle
                                                    rules={[{
                                                        required: true,
                                                        transform: value => value === "Не выбрано" ? "" : value,
                                                        message: 'Выберите подразделение!'
                                                    }]}
                                                >
                                                    <Select
                                                        options={departmentsToOptions}
                                                        onDropdownVisibleChange={(open) => dropDownRenderHandler(open, departments)}
                                                        loading={loadingSelectDep}
                                                        onChange={(value) => changeHandler(value, departments)}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{span: 4}} sm={{span: 4}} md={{span: 2}} lg={{span: 2}} xl={{span: 2}}>
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
                                            <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                                <Form.Item
                                                    name="profession"
                                                    noStyle
                                                    rules={[{
                                                        required: true,
                                                        transform: value => value === "Не выбрано" ? "" : value,
                                                        message: 'Выберите сотрудника!'}]}
                                                >
                                                    <Select
                                                        options={professionsToOptions}
                                                        onDropdownVisibleChange={(open) => dropDownRenderHandler(open, professions)}
                                                        loading={loadingSelectProf}
                                                        onChange={changeHandlerProfession}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{span: 4}} sm={{span: 4}} md={{span: 2}} lg={{span: 2}} xl={{span: 2}}>
                                                <Button
                                                    style={{width: '100%'}}
                                                    onClick={() => RowMapHelper('professions', null)}
                                                    icon={<PlusOutlined/>}
                                                    type="secondary"
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item name="notes" label="Примечание">
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item name="_id" hidden={true}>
                                        <Input/>
                                    </Form.Item>

                                    <Row justify="end" style={{marginTop: 20}} xs={{gutter: [8, 8]}}>
                                        <Button
                                            className="button-style"
                                            type="primary"
                                            htmlType="submit"
                                            loading={loadingSave}
                                            icon={<CheckOutlined/>}
                                        >
                                            Сохранить
                                        </Button>

                                        {CheckTypeTab(rowData, deleteHandler)}

                                        <Button
                                            className="button-style"
                                            type="secondary"
                                            onClick={cancelHandler}
                                            icon={<StopOutlined/>}
                                        >
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