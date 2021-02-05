import React, {useEffect, useState} from 'react';
import {Card, Form, Input, Row, Col, Button, message, Skeleton, Checkbox, Dropdown} from 'antd';
import {useSelector, useDispatch} from "react-redux";
import { SketchPicker } from 'react-color';
import {
    CheckOutlined,
    DeleteOutlined,
    EditOutlined,
    PrinterOutlined,
    StopOutlined
} from '@ant-design/icons';

import ActionCreator from "../../redux/actionCreators";
import {request} from "../helpers/request.helper";

const {Meta} = Card;

export const TaskTab = ({specKey, onRemove}) => {
    // Установка спиннера загрузки при сохранении записи
    const [loadingSave, setLoadingSave] = useState(false);
    // Стейт для отображения выпадающего меню для колонок
    const [visible, setVisible] = useState(false);

    // Получение списка состояний заявок и загрузки записи из хранилища redux
    const {tasks, rowData, loadingSkeleton} = useSelector((state) => ({
        tasks: state.tasks,
        rowData: state.rowDataTask,
        loadingSkeleton: state.loadingSkeleton
    }));
    const dispatch = useDispatch();

    let initialColor = rowData ? rowData.color : '#FFFFFF';

    // Стейт для поля "Цвет"
    const [color, setColor] = useState(initialColor);

    // Определение начальных значений для полей "Наименование" и "Примечание"
    let initialName, initialNotes, initialIsFinish, initialId;

    // Если вкладка редактирования, то устанавливаем начальные значения для полей "Наименование", "Цвет" и "Примечание"
    if (rowData) {
        initialName = rowData.name;
        initialColor = rowData.color;
        initialNotes = rowData.notes;
        initialIsFinish = rowData.isFinish;
        initialId = rowData._id;
    }

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Установка начальных значений полей "Наименование", "Цвет" и "Примечание", и если вкладка редактируется
    // Также устанавливаем текущий цвет в стейт
    useEffect(() => {
        if (rowData) {
            setColor(initialColor);
            form.setFieldsValue({
                name: initialName,
                color: initialColor,
                notes: initialNotes,
                isFinish: initialIsFinish,
                _id: initialId
            });
        } else {
            return null;
        }
    }, [form, initialName, initialColor, initialNotes, initialIsFinish, initialId, rowData]);

    let title = specKey === 'newTask' ? 'Создание записи о состоянии заявки' : 'Редактирование записи о состоянии заявки';

    // Функция сохранения записи
    const onSave = async (values) => {
        try {
            setLoadingSave(true);

            let method = !rowData ? 'POST' : 'PUT';

            const data = await request('/api/directory/taskStatus', method, values);

            if (data) {
                setLoadingSave(false);

                message.success(data.message);

                // Удаление текущей вкладки
                onRemove(specKey, 'remove');

                // Если это редактирование записи, то происходит изменение записи в хранилище redux,
                // иначе происходит запись новой записи в хранилище redux
                !rowData ?
                    dispatch(ActionCreator.createTask(data.task)) :
                    tasks.forEach((task, index) => {
                        if (task._id === data.task._id) {
                            dispatch(ActionCreator.editTask(index, data.task));
                        }
                    });
            }
        } catch (e) {
        }
    };

    // Функция удаления записи
    const deleteHandler = async () => {
        try {
            if (rowData) {
                const data = await request('/api/directory/taskStatus/' + rowData._id, 'DELETE', rowData);

                if (data) {
                    message.success(data.message);

                    // Удаление текущей вкладки
                    onRemove(specKey, 'remove');

                    // Удаляем запись из хранилища redux
                    tasks.forEach((task, index) => {
                        if (task._id === rowData._id) {
                            dispatch(ActionCreator.deleteTask(index));
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
        // Удаляем текущую вкладку
        onRemove(specKey, 'remove');
    }

    // Создание переменной для отображения выпадающего списка для колонок
    let component = <>
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
                                <Form style={{marginTop: '5%'}} form={form} labelCol={{span: 6}}
                                      name={rowData ? `control-ref-task-${rowData.name}` : "control-ref-task"}
                                      onFinish={onSave} onFinishFailed={onFinishFailed}>
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
                                            <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}}
                                                 xl={{span: 22}}>
                                                <Form.Item
                                                    name="color"
                                                    noStyle
                                                    initialValue={color}
                                                >
                                                    <Input maxLength={255} type="text" disabled/>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={{span: 4}} sm={{span: 4}} md={{span: 2}} lg={{span: 2}}
                                                 xl={{span: 2}}>
                                                <Dropdown
                                                    overlay={component}
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

                                    <Form.Item
                                        name="notes"
                                        label="Примечание"
                                        initialValue={!rowData ? '' : rowData.notes}
                                    >
                                        <Input maxLength={255} type="text" />
                                    </Form.Item>

                                    <Form.Item name="isFinish" valuePropName="checked" wrapperCol={{offset: 6}}>
                                        <Checkbox>Завершено</Checkbox>
                                    </Form.Item>

                                    <Form.Item
                                        name="_id"
                                        hidden={true}
                                    >
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item>
                                        <Row justify="end" style={{marginTop: 20}} xs={{gutter: [8, 8]}}>
                                            <Button className="button-style" type="primary" htmlType="submit"
                                                    loading={loadingSave}
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