// Вкладка "Персонал"
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Card, Form, Input, Row, Button, Select, Col, Skeleton} from "antd";
import {CheckOutlined, PlusOutlined, StopOutlined} from "@ant-design/icons";

import {ProfessionRoute} from "../../../routes/route.profession";
import {DepartmentRoute} from "../../../routes/route.Department";
import {PersonRoute} from "../../../routes/route.Person";

import {getOptions, CheckTypeTab, onFailed} from "../../helpers/tab.helpers/tab.functions";
import {RowMapHelper} from "../../helpers/table.helpers/tableMap.helper";

const {Meta} = Card;

export const PersonTab = ({specKey, onRemove}) => {
    // Получение списков подразделений, профессий, вкладок, порсонала и загрузки записи из хранилища redux
    const {professions, departments, item, loadingSkeleton} = useSelector((state) => ({
        professions: state.reducerProfession.professions,
        departments: state.reducerDepartment.departments,
        item: state.reducerPerson.rowDataPerson,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    // Создание состояний для значений в выпадающих списках "Подразделения" и "Персонал"
    const [departmentsOptions, setDepartmentsOptions] = useState(getOptions(departments));
    const [professionsOptions, setProfessionsOptions] = useState(getOptions(professions));

    // Инициализация состояний для показа спиннера загрузки при сохранении записи и в выпадающих меню
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingSelectDepartment, setLoadingSelectDepartment] = useState(false);
    const [loadingSelectProfession, setLoadingSelectProfession] = useState(false);

    let initialDepartmentOption = {_id: null};
    let initialProfessionOption = {_id: null};

    // Начальное значение выбранного элемента в выпадающем списке Подразделения
    if (departments && departments.length && item && item.department) {
        initialDepartmentOption = departments.find(department => department._id === item.department._id);
    }

    // Начальное значение выбранного элемента в выпадающем списке Профессии
    if (professions && professions.length && item && item.profession) {
        initialProfessionOption = professions.find(profession => profession._id === item.profession._id);
    }

    // Создание заголовка раздела и имени формы
    const title = !item || item.isNewItem ? "Создание записи о сотруднике" : "Редактирование записи о сотруднике";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        // Устанавливаем спиннер загрузки
        setLoadingSave(true);

        // Обновляем список подразделений
        await PersonRoute.getAll();

        // Проверяем, есть ли выбранный элемент в списке подразделений
        const foundDepartment = departments.find(department => {
            return department._id === values.department;
        });

        // Проверяем, есть ли выбранный элемент в списке профессий
        const foundProfession = professions.find(profession => {
            return profession._id === values.profession;
        });

        values.department = foundDepartment ? foundDepartment : null;
        values.profession = foundProfession ? foundProfession : null;

        await PersonRoute.save(values, setLoadingSave, onRemove, specKey);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await PersonRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove, specKey);
    };

    const cancelHandler = () => PersonRoute.cancel(onRemove, specKey);

    // Обновление выпадающего списка "Подразделения"
    const dropDownRenderHandler = async (open, setLoadingSelect, model, setOptions, dataStore) => {
        try {
            if (open) {
                setLoadingSelect(true);

                await model.getAll();

                setOptions(getOptions(dataStore));

                setLoadingSelect(false);
            }
        } catch (e) {
            setLoadingSelect(false);
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
                                <Form
                                    labelCol={{span: 6}} wrapperCol={{span: 18}} style={{marginTop: '5%'}}
                                    name="person-item"
                                    onFinish={saveHandler}
                                    onFinishFailed={onFailed}
                                    initialValues={{
                                        _id: !item ? null : item._id,
                                        isNewItem: !item ? null : item.isNewItem,
                                        name: !item ? null : item.name,
                                        notes: !item ? null : item.notes,
                                        department: item && initialDepartmentOption ? initialDepartmentOption._id : null,
                                        profession: item && initialProfessionOption ? initialProfessionOption._id : null,
                                    }}
                                >
                                    <Form.Item name="_id" hidden={true}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="isNewItem" hidden={true}>
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item
                                        label="ФИО"
                                        name="name"
                                        rules={[{required: true, message: 'Введите ФИО сотрудника!',}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Подразделение"
                                        name="department"
                                        rules={[{
                                            required: true,
                                            message: 'Выберите подразделение!'
                                        }]}
                                    >
                                        <Row gutter={8}>
                                            <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                                <Form.Item name="department" noStyle>
                                                    <Select
                                                        options={departmentsOptions}
                                                        onDropdownVisibleChange={async open => {
                                                            await dropDownRenderHandler(open, setLoadingSelectDepartment, DepartmentRoute, setDepartmentsOptions, departments)
                                                        }}
                                                        loading={loadingSelectDepartment}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{span: 4}} sm={{span: 4}} md={{span: 2}} lg={{span: 2}} xl={{span: 2}}>
                                                <Button
                                                    style={{width: '100%'}}
                                                    onClick={() => RowMapHelper("departments", "-1")}
                                                    icon={<PlusOutlined/>}
                                                    type="secondary"
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item
                                        label="Профессия"
                                        name="profession"
                                        rules={[{
                                            required: true,
                                            message: 'Выберите сотрудника!'
                                        }]}
                                    >
                                        <Row gutter={8}>
                                            <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                                <Form.Item name="profession" noStyle>
                                                    <Select
                                                        options={professionsOptions}
                                                        onDropdownVisibleChange={async open => {
                                                            await dropDownRenderHandler(open, setLoadingSelectProfession, ProfessionRoute, setProfessionsOptions, professions)
                                                        }}
                                                        loading={loadingSelectProfession}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{span: 4}} sm={{span: 4}} md={{span: 2}} lg={{span: 2}} xl={{span: 2}}>
                                                <Button
                                                    style={{width: '100%'}}
                                                    onClick={() => RowMapHelper("professions", "-1")}
                                                    icon={<PlusOutlined/>}
                                                    type="secondary"
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item name="notes" label="Примечание">
                                        <Input maxLength={255} type="text"/>
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

                                        {CheckTypeTab(item, deleteHandler)}

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