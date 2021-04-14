// Компонент формы записи раздела "Состояние заявки"
import React, {useContext, useEffect, useState} from "react";
import {SketchPicker} from "react-color";
import {Card, Button, Checkbox, Col, Dropdown, Form, Input, Row} from "antd";
import {EditOutlined} from "@ant-design/icons";

import {onFailed, TabButtons} from "../tab.functions";
import {TaskStatusRoute} from "../../routes/route.taskStatus";
import {DeleteTabContext} from "../../context/deleteTab.context";

export const TaskStatusForm = ({item}) => {
    // Состояние для отображения выпадающего меню для колонок, спиннера загрузки при изменении записи, поля "Цвет"
    const [visible, setVisible] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [color, setColor] = useState(item.color);

    // Инициализация хука от Form antd
    const [form] = Form.useForm();

    // Получаем функцию удаления вкладки onRemove из контекста
    const onRemove = useContext(DeleteTabContext);

    // При обновлении item устанавливаем форме начальные значения и текущий цвет кнопки
    useEffect(() => {
        setColor(item.color);

        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            name: item.name.trim(),
            notes: item.notes.trim(),
            color: item.color,
            isFinish: item.isFinish,
        });
    }, [item, form]);

    // Инициализация заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание записи о состоянии заявки" : "Редактирование записи о состоянии заявки";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => await TaskStatusRoute.save(values, setLoadingSave, onRemove);

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await TaskStatusRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove);
    };

    const cancelHandler = () => TaskStatusRoute.cancel(onRemove);

    // Создание компонента цветового пикера
    const colorPickerComponent = <SketchPicker
        color={color}
        disableAlpha={true}
        onChange={newColor => {
            // Обновляем значение инпута цвета с помощью хука useForm
            form.setFieldsValue({color: newColor.hex.toUpperCase()});
            // Обновляем стейт цвета
            setColor(newColor.hex.toUpperCase());
        }}
    />;

    // Функция для изменения стейта отображения цветового пикера
    const handleVisibleChange = isVisible => setVisible(isVisible);

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    className="form-styles"
                    labelCol={{span: 6}}
                    name="taskStatus-item"
                    onFinish={saveHandler}
                    onFinishFailed={onFailed}
                >
                    <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                    <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>

                    <Form.Item label="Наименование" name="name" rules={[{
                        required: true,
                        transform: value => value.trim(),
                        message: "Введите наименование"
                    }]}>
                        <Input onChange={(e) => form.setFieldsValue({name: e.target.value})} maxLength={255} type="text"/>
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
                                    trigger={["click"]}
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
                        <Input onChange={(e) => form.setFieldsValue({notes: e.target.value})} maxLength={255} type="text"/>
                    </Form.Item>

                    <Form.Item name="isFinish" valuePropName="checked" wrapperCol={{offset: 6}}>
                        <Checkbox onChange={e => form.setFieldsValue({isFinish: e.target.checked})}>
                            Завершено
                        </Checkbox>
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
    )
}