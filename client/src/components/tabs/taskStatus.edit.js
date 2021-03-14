// Вкладка "Состояние заявок"
import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {SketchPicker} from 'react-color';
import {Card, Form, Input, Row, Col, Button, Skeleton, Checkbox, Dropdown} from 'antd';
import {EditOutlined} from '@ant-design/icons';

import {TaskStatusRoute} from "../../routes/route.taskStatus";
import {onFailed, TabButtons} from "./tab.functions/tab.functions";

const {Meta} = Card;

export const TaskTab = ({specKey, onRemove}) => {
    // Получение списка состояний заявок и загрузки записи
    const {item, loadingSkeleton} = useSelector((state) => ({
        item: state.reducerTask.rowDataTask,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    // Установка цвета
    const initialColor = item ? item.color : "#FFFFFF";

    // Состояние для отображения выпадающего меню для колонок, спиннера загрузки при изменении записи, поля "Цвет"
    const [visible, setVisible] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [color, setColor] = useState(initialColor);

    // Инициализация хука от Form antd
    const [form] = Form.useForm();

    // Устанавливаем текущий цвет кнопке
    useEffect(() => {
        setColor(initialColor);
    }, [initialColor]);

    // Инициализация заголовка раздела и имени формы
    const title = !item || item.isNewItem ? "Создание записи о состоянии заявки" : "Редактирование записи о состоянии заявки";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        await TaskStatusRoute.save(values, setLoadingSave, onRemove, specKey);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await TaskStatusRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove, specKey);
    };

    const cancelHandler = () => TaskStatusRoute.cancel(onRemove, specKey);

    // Создание компонента цветового пикера
    const colorPickerComponent = <>
        <SketchPicker
            color={color}
            onChangeComplete={(newColor, event) => {
                if (event.type === "mousedown") {
                    // Обновляем значение инпута цвета с помощью хука useForm
                    form.setFieldsValue({color: newColor.hex.toUpperCase()});
                    // Обновляем стейт цвета
                    setColor(newColor.hex.toUpperCase());
                }
            }}
        />
    </>;

    // Функция для изменения стейта отображения цветового пикера
    const handleVisibleChange = isVisible => setVisible(isVisible);

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
                                    labelCol={{span: 6}}
                                    form={form}
                                    name="taskStatus-item"
                                    onFinish={saveHandler}
                                    onFinishFailed={onFailed}
                                    initialValues={{
                                        _id: !item ? null : item._id,
                                        isNewItem: !item ? null : item.isNewItem,
                                        name: !item ? null : item.name,
                                        color: !item ? "#FFFFFF" : item.color,
                                        notes: !item ? null : item.notes,
                                        isFinish: !item ? false : item.isFinish
                                    }}
                                >
                                    <Form.Item name="_id" hidden={true}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="isNewItem" hidden={true}>
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Наименование"
                                        name="name"
                                        rules={[{required: true, message: "Введите наименование записи!"}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item label="Цвет">
                                        <Row gutter={8}>
                                            <Col xs={{span: 20}} sm={{span: 20}} md={{span: 22}} lg={{span: 22}} xl={{span: 22}}>
                                                <Form.Item name="color" noStyle>
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
                                                        style={{width: "100%", backgroundColor: color}}
                                                        icon={<EditOutlined/>}
                                                        size="middle"
                                                    />
                                                </Dropdown>
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item name="notes" label="Примечание">
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item name="isFinish" valuePropName="checked" wrapperCol={{offset: 6}}>
                                        <Checkbox>Завершено</Checkbox>
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