// Компонент формы записи раздела "Характеристики оборудования"
import React, {useEffect, useState} from "react";
import {Card, Form, Input} from "antd";

import {onFailed, TabButtons} from "../tab.functions";
import {EquipmentPropertyRoute} from "../../routes/route.EquipmentProperty";
import {onRemove} from "../../components/content.components/content/content.component";

export const EquipmentPropertyForm = ({item}) => {
    // Инициализация состояния для показа спиннера загрузки при сохранении/удалении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            name: item.name.trim(),
            notes: item.notes.trim(),
        });
    }, [item, form]);

    // Создание заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание характеристики оборудования" : "Редактирование характеристики оборудования";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => await EquipmentPropertyRoute.save(values, setLoadingSave);

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) =>
        await EquipmentPropertyRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm);

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

                    <Form.Item label="Наименование" name="name" rules={[{
                        required: true,
                        transform: value => value.trim(),
                        message: "Введите наименование!"
                    }]}>
                        <Input onChange={(e) => form.setFieldsValue({name: e.target.value})} maxLength={255} type="text"/>
                    </Form.Item>

                    <Form.Item name="notes" label="Примечание">
                        <Input onChange={(e) => form.setFieldsValue({notes: e.target.value})} maxLength={255} type="text"/>
                    </Form.Item>

                    <TabButtons
                        loadingSave={loadingSave}
                        item={item}
                        deleteHandler={deleteHandler}
                        cancelHandler={() => onRemove("equipmentPropertyItem", "remove")}
                    />
                </Form>
            }
        />
    )
}