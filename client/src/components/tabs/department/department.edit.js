// Вкладка "Подразделения"
import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {Button, Card, Form, Input, Row, Col, Select, Skeleton} from 'antd';
import {CheckOutlined, StopOutlined} from "@ant-design/icons";

import {Departments} from "../../../model/Department";
import getParents from "../../helpers/getRowParents.helper";
import {getOptions, CheckTypeTab, onFailed} from "../../helpers/tab.helpers/tab.functions";

const {Meta} = Card;

export const DepartmentTab = ({specKey, onRemove}) => {
    // Получение списка подразделений, редактируемой строки и загрузки записи
    const {departments, item, loadingSkeleton} = useSelector((state) => ({
        departments: state.reducerDepartment.departments,
        item: state.reducerDepartment.rowDataDepartment,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    // Инициализация состояния для показа индикатора загрузки при изменении записи и обновлении
    // выпадающего списка
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingSelect, setLoadingSelect] = useState(false);

    // Создание состояния для значений в выпадающем списке "Принадлежит"
    const [options, setOptions] = useState(getOptions(departments));

    let initialOption = {_id: null};

    // Начальное значение выбранного элемента в выпадающем списке
    if (departments && departments.length && item && item.parent) {
        departments.forEach(department => {
            if (department.parent) {
                department.nameWithParent = getParents(department, departments) + department.name;
            } else {
                item.nameWithParent = item.name;
            }
        })

        initialOption = departments.find(department => department._id === item.parent._id);
    }

    // Создание заголовка раздела и имени формы
    const title = !item || item.isCreated ? "Создание подразделения" : "Редактирование подразделения";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        // Обновляем список подразделений
        await Departments.getAll();

        // Проверяем, есть ли выбранный элемент в списке
        const foundDepartment = departments.find(department => {
            return department._id === values.parent;
        });

        values.parent = foundDepartment ? foundDepartment : null;

        await Departments.save(values, setLoadingSave, onRemove, specKey);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await Departments.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove, specKey);
    };

    const cancelHandler = () => Departments.cancel(onRemove, specKey);

    // Обновление выпадающего списка "Подразделения"
    const dropDownRenderHandler = async (open) => {
        try {
            if (open) {
                setLoadingSelect(true);

                await Departments.getAll();

                setOptions(getOptions(departments));

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
                                    name="department-item"
                                    onFinish={saveHandler}
                                    onFinishFailed={onFailed}
                                    initialValues={{
                                        _id: !item ? null : item._id,
                                        isCreated: !item ? null : item.isCreated,
                                        name: !item ? null : item.name,
                                        notes: !item ? null : item.notes,
                                        parent: item && initialOption ? initialOption._id : null
                                    }}
                                >
                                    <Form.Item name="_id" hidden={true}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="isCreated" hidden={true}>
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item name="parent" label="Принадлежит">
                                        <Select
                                            options={options}
                                            onDropdownVisibleChange={dropDownRenderHandler}
                                            loading={loadingSelect}
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