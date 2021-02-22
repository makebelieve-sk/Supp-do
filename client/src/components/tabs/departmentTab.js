// Вкладка "Подразделения"
import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {Button, Card, Form, Input, Row, Col, Select, Skeleton} from 'antd';
import {CheckOutlined, StopOutlined} from "@ant-design/icons";

import {ActionCreator} from "../../redux/combineActions";
import {
    CheckTypeTab,
    onCancel,
    onDelete,
    onFailed,
    onSave,
    onChange,
    onDropDownRender
} from "../helpers/tab.helpers/tab.functions";

const {Meta} = Card;

export const DepartmentTab = ({specKey, onRemove}) => {
    // Получение списка подразделений и загрузки записи из хранилища redux
    const {departments, rowData, loadingSkeleton} = useSelector((state) => ({
        departments: state.reducerDepartment.departments,
        rowData: state.reducerDepartment.rowDataDepartment,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    // Инициализация стейта для показа спиннера загрузки при сохранении/редактировании/удалении записи и обновлении
    // выпадающего списка
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingSelectDep, setLoadingSelectDep] = useState(false);

    // Инициализация начлаьного значения в выпадающем списке
    let initialDepartment = null;

    // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
    if (rowData) {
        initialDepartment = rowData.parent;
    }

    // Создание стейта для значений в выпадающем списке "Подразделения" и начального значения
    const [selectDep, setSelectDep] = useState(null);
    const [departmentsToOptions, setDepartmentsToOptions] = useState([]);

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Создание заголовка раздела и имени формы
    const title = rowData ? 'Редактирование подразделения' : 'Создание подразделения';
    const name = rowData ? `control-ref-department-${rowData.name}` : "control-ref-department";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = (values) => {
        values.parent = selectDep === "Не выбрано" ? null : selectDep ? selectDep : initialDepartment;

        onSave(
            "departments", values, setLoadingSave, ActionCreator.ActionCreatorDepartment.editDepartment,
            ActionCreator.ActionCreatorDepartment.createDepartment, departments, onRemove, specKey, rowData
        ).then(null);
    }

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = (setLoadingDelete, setVisiblePopConfirm) => onDelete(
        "departments", setLoadingDelete, ActionCreator.ActionCreatorDepartment.deleteDepartment,
        departments, onRemove, specKey, rowData, setVisiblePopConfirm
    ).then(null);

    // Обработка нажатия на кнопку "Отмена"
    const cancelHandler = () => onCancel(onRemove, specKey);

    // Изменение значения в выпадающем списке "Подразделение", и сохранение этого значения в стейте
    const changeHandler = (value) => onChange(form, value, setSelectDep, departments);

    // Обновление выпадающего списка "Подразделения"
    const dropDownRenderHandler = (open) => onDropDownRender(
            open, setLoadingSelectDep, "departments", ActionCreator.ActionCreatorDepartment.getAllDepartments,
            setDepartmentsToOptions);

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
                                        parent: rowData && rowData.parent ? rowData.parent.name : "Не выбрано",
                                        name: rowData ? rowData.name : "",
                                        notes: rowData ? rowData.notes : ""
                                    }}
                                >
                                    <Form.Item name="parent" label="Принадлежит">
                                        <Select
                                            options={departmentsToOptions}
                                            onDropdownVisibleChange={dropDownRenderHandler}
                                            loading={loadingSelectDep}
                                            onChange={changeHandler}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Наименование"
                                        name="name"
                                        rules={[{required: true, message: 'Введите название подразделения!'}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item label="Примечание" name="notes">
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