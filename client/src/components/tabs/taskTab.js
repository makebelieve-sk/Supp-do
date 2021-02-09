// Вкладка "Состояние заявок"
import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {SketchPicker} from 'react-color';
import {Card, Form, Input, Row, Col, Button, Skeleton, Checkbox, Dropdown} from 'antd';
import {CheckOutlined, EditOutlined, StopOutlined} from '@ant-design/icons';

import {ActionCreator} from "../../redux/combineActions";
import {checkTypeTab, onCancel, onDelete, onFailed, onSave} from "../helpers/rowTabs.helper";

const {Meta} = Card;

export const TaskTab = ({specKey, onRemove}) => {
    // Стейт для отображения выпадающего меню для колонок
    const [visible, setVisible] = useState(false);

    // Инициализация стейта для показа спиннера загрузки при сохранении и удалении записи
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    // Получение списка состояний заявок и загрузки записи из хранилища redux
    const {tasks, rowData, loadingSkeleton} = useSelector((state) => ({
        tasks: state.reducerTask.tasks,
        rowData: state.reducerTask.rowDataTask,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    // Установка цвета
    let initialColor = rowData ? rowData.color : '#FFFFFF';

    // Стейт для поля "Цвет"
    const [color, setColor] = useState(initialColor);

    // Инициализация хука от Form antd
    const [form] = Form.useForm();

    // Установка начальных значений полей "Наименование", "Цвет" и "Примечание", и если вкладка редактируется
    // Также устанавливаем текущий цвет в стейт
    useEffect(() => {
        setColor(initialColor);
    }, [initialColor]);

    // Создание заголовка раздела и имени формы
    const title = rowData ? 'Создание записи о состоянии заявки' : 'Редактирование записи о состоянии заявки';
    const name = rowData ? `control-ref-task-${rowData.name}` : "control-ref-task";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = (values) => onSave(
        "taskStatus", values, setLoadingSave, ActionCreator.ActionCreatorTask.editTask,
        ActionCreator.ActionCreatorTask.createTask, tasks, onRemove, specKey, rowData
    ).then(null);

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = () => onDelete(
        "taskStatus", setLoadingDelete, ActionCreator.ActionCreatorTask.deleteTask,
        tasks, onRemove, specKey, rowData
    ).then(null);

    // Обработка нажатия на кнопку "Отмена"
    const cancelHandler = () => onCancel(onRemove, specKey);

    // Инициализация кнопок, появляющихся при редактировании записи
    const editButtonsComponent = checkTypeTab(rowData, deleteHandler, loadingDelete);

    // Создание компонента цветового пикера
    let colorPickerComponent = <>
        <SketchPicker
            color={color}
            onChangeComplete={(newColor, event) => {
                if (event.type === 'mousedown') {
                    // Обновляем значение инпута цвета с помощью хука useForm
                    form.setFieldsValue({color: newColor.hex.toUpperCase()});
                    // Обновляем стейт цвета
                    setColor(newColor.hex.toUpperCase());
                }
            }}
        />
    </>;

    // Функция для изменения стейта отображения цветового пикера
    const handleVisibleChange = flag => {
        setVisible(flag);
    };

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form
                                    style={{marginTop: '5%'}}
                                    form={form}
                                    labelCol={{span: 6}}
                                    name={name}
                                    onFinish={saveHandler}
                                    onFinishFailed={onFailed}
                                >
                                    <Form.Item
                                        label="Наименование"
                                        name="name"
                                        initialValue={!rowData ? '' : rowData.name}
                                        rules={[{required: true, message: 'Введите наименование записи!'}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item label="Цвет">
                                        <Row gutter={8}>
                                            <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                                <Form.Item
                                                    name="color"
                                                    noStyle
                                                    initialValue={color}
                                                >
                                                    <Input maxLength={255} type="text" disabled/>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{span: 4}} sm={{span: 4}} md={{span: 2}} lg={{span: 2}} xl={{span: 2}}>
                                                <Dropdown
                                                    overlay={colorPickerComponent}
                                                    onVisibleChange={handleVisibleChange}
                                                    visible={visible}
                                                >
                                                    <Button
                                                        style={{width: '100%', backgroundColor: color}}
                                                        icon={<EditOutlined/>}
                                                        size="middle"
                                                    />
                                                </Dropdown>
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item name="notes" label="Примечание" initialValue={!rowData ? '' : rowData.notes}>
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item name="isFinish" valuePropName="checked" wrapperCol={{offset: 6}}>
                                        <Checkbox>Завершено</Checkbox>
                                    </Form.Item>

                                    <Form.Item name="_id" hidden={true} initialValue={!rowData ? '' : rowData._id}>
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item>
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

                                            {editButtonsComponent}

                                            <Button
                                                className="button-style"
                                                type="secondary"
                                                onClick={cancelHandler}
                                                icon={<StopOutlined/>}
                                            >
                                                Отмена
                                            </Button>
                                        </Row>
                                    </Form.Item>
                                </Form>
                            }
                        />
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}