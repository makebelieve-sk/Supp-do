// Компонент формы записи раздела "Характеристики оборудования"
import React, {useContext, useEffect, useState} from "react";
import {Card, Form, Input} from "antd";

import {onFailed, TabButtons} from "../tab.functions";
import {EquipmentPropertyRoute} from "../../routes/route.EquipmentProperty";
import {DeleteTabContext} from "../../context/deleteTab.context";

export const EquipmentPropertyForm = ({item}) => {
    // Инициализация состояния для показа спиннера загрузки при сохранении/удалении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // Получаем функцию удаления вкладки onRemove из контекста
    const onRemove = useContext(DeleteTabContext);

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            name: item.name,
            notes: item.notes,
        });
    }, [item, form]);

    // Создание заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание характеристики оборудования" : "Редактирование характеристики оборудования";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => await EquipmentPropertyRoute.save(values, setLoadingSave, onRemove);

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await EquipmentPropertyRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove);
    };

    const cancelHandler = () => EquipmentPropertyRoute.cancel(onRemove);

    console.log("Обновление вкладки EquipmentProperty");

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    className="form-styles"
                    labelCol={{span: 6}}
                    name="equipmentProperty-item"
                    onFinish={saveHandler}
                    onFinishFailed={onFailed}
                >
                    <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                    <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>

                    <Form.Item label="Наименование" name="name" rules={[{required: true, message: "Введите наименование!"}]}>
                        <Input onChange={(e) => form.setFieldsValue({name: e.target.value})} maxLength={255} type="text"/>
                    </Form.Item>

                    <Form.Item name="notes" label="Примечание">
                        <Input onChange={(e) => form.setFieldsValue({notes: e.target.value})} maxLength={255} type="text"/>
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