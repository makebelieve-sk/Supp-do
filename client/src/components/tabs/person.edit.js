// Вкладка "Персонал"
import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Card, Form, Input, Row, Button, Select, Col, Skeleton} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {ProfessionRoute} from "../../routes/route.profession";
import {DepartmentRoute} from "../../routes/route.Department";
import {PersonRoute} from "../../routes/route.Person";

import {dropdownRender, getOptions, onFailed, TabButtons} from "./tab.functions/tab.functions";
import {openRecordTab} from "../helpers/table.helpers/table.helper.js";
import {ActionCreator} from "../../redux/combineActions";

const {Meta} = Card;

export const PersonTab = ({specKey, onRemove}) => {
    // Получение списков подразделений, профессий, вкладок, персонала и индикатора загрузки записи
    const {professions, departments, item, loadingSkeleton} = useSelector((state) => ({
        professions: state.reducerProfession.professions,
        departments: state.reducerDepartment.departments,
        item: state.reducerPerson.rowDataPerson,
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
    }));
    const dispatch = useDispatch();

    // Создание состояний для значений в выпадающих списках "Подразделения" и "Профессии"
    const [departmentsOptions, setDepartmentsOptions] = useState(getOptions(departments));
    const [professionsOptions, setProfessionsOptions] = useState(getOptions(professions));

    // Инициализация состояний для показа спиннера загрузки при сохранении записи и в выпадающих меню
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingSelectDepartment, setLoadingSelectDepartment] = useState(false);
    const [loadingSelectProfession, setLoadingSelectProfession] = useState(false);

    // Создание хука form
    const [form] = Form.useForm();

    // Изменение значений формы
    useEffect(() => {
        // Обновление выпадающих списков
        setDepartmentsOptions(getOptions(departments));
        setProfessionsOptions(getOptions(professions));

        // Установка значений формы
        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            name: item.name,
            notes: item.notes,
            department: item.department ? item.department._id : null,
            profession: item.profession ? item.profession._id : null
        });
        console.log("Ререндер useEffect");
    }, [form, item, departments, professions]);

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

    console.log("Ререндер вкладки");

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form
                                    labelCol={{span: 6}} wrapperCol={{span: 18}} style={{marginTop: "5%"}}
                                    form={form}
                                    name="person-item"
                                    onFinish={saveHandler}
                                    onFinishFailed={onFailed}
                                >
                                    <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                                    <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>

                                    <Form.Item
                                        label="ФИО"
                                        name="name"
                                        rules={[{
                                            required: true,
                                            pattern: /^[\W\w]+\s[\W\w]+.*$/g,
                                            message: "Поле ФИО не соотвествует шаблону 'Фамилия Имя Отчество'"
                                        }]}
                                    >
                                        <Input maxLength={255} type="text" onChange={e => {
                                            dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson({
                                                ...item,
                                                name: e.target.value
                                            }))
                                        }}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Подразделение"
                                        name="department"
                                        rules={[{
                                            required: true,
                                            message: "Выберите подразделение!"
                                        }]}
                                    >
                                        <Row>
                                            <Col xs={{span: 21}} sm={{span: 21}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                                <Form.Item name="department" noStyle>
                                                    <Select
                                                        options={departmentsOptions}
                                                        onDropdownVisibleChange={async open => {
                                                            await dropdownRender(open, setLoadingSelectDepartment, DepartmentRoute, setDepartmentsOptions, departments)
                                                        }}
                                                        loading={loadingSelectDepartment}
                                                        onChange={_id => {
                                                            const foundDepartment = departments.find(department => {
                                                                return department._id === _id;
                                                            });

                                                            dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson({
                                                                ...item,
                                                                department: foundDepartment
                                                            }))
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{span: 3}} sm={{span: 3}} md={{span: 2}} lg={{span: 2}} xl={{span: 2}}>
                                                <Button
                                                    className="button-add-select"
                                                    onClick={() => openRecordTab("departments", "-1")}
                                                    icon={<PlusOutlined/>}
                                                    type="secondary"
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item
                                        label="Профессия"
                                        name="profession"
                                        rules={[{required: true, message: "Выберите сотрудника!"}]}
                                    >
                                        <Row>
                                            <Col xs={{span: 21}} sm={{span: 21}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                                <Form.Item name="profession" noStyle>
                                                    <Select
                                                        options={professionsOptions}
                                                        onDropdownVisibleChange={async open => {
                                                            await dropdownRender(open, setLoadingSelectProfession, ProfessionRoute, setProfessionsOptions, professions)
                                                        }}
                                                        loading={loadingSelectProfession}
                                                        onChange={_id => {
                                                            const foundProfession = professions.find(profession => {
                                                                return profession._id === _id;
                                                            });

                                                            dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson({
                                                                ...item,
                                                                profession: foundProfession
                                                            }))
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{span: 3}} sm={{span: 3}} md={{span: 2}} lg={{span: 2}} xl={{span: 2}}>
                                                <Button
                                                    className="button-add-select"
                                                    onClick={() => openRecordTab("professions", "-1")}
                                                    icon={<PlusOutlined/>}
                                                    type="secondary"
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item name="notes" label="Примечание">
                                        <Input maxLength={255} type="text" onChange={e => {
                                            dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson({
                                                ...item,
                                                notes: e.target.value
                                            }))
                                        }}/>
                                    </Form.Item>

                                    <TabButtons
                                        loadingSave={loadingSave}
                                        item={item}
                                        deleteHandler={deleteHandler}
                                        cancelHandler={cancelHandler}
                                    />
                                </Form>
                            }
                        />
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}