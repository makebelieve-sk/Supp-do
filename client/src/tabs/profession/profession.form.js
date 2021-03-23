// Компонент формы записи раздела "Профессии"
import React, {useContext, useEffect, useState} from "react";
import {Card, Form, Input} from "antd";
import {onFailed, TabButtons} from "../tab.functions";
import {ProfessionRoute} from "../../routes/route.profession";
import {DeleteTabContext} from "../../context/deleteTab.context";

export const ProfessionForm = ({item}) => {
    // Инициализация состояния для показа спиннера загрузки при сохранении и удалении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Инициализация заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание профессии" : "Редактирование профессии";

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

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => await ProfessionRoute.save(values, setLoadingSave, onRemove);

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await ProfessionRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove);
    };

    const cancelHandler = () => ProfessionRoute.cancel(onRemove);

    console.log("Обновление вкладки Profession");

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    className="form-styles"
                    name="profession-item"
                    onFinishFailed={onFailed}
                    onFinish={saveHandler}
                >
                    <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                    <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>

                    <Form.Item label="Профессия" name="name" rules={[{required: true, message: "Введите название профессии!"}]}>
                        <Input onChange={(e) => form.setFieldsValue({name: e.target.value})} maxLength={255} type="text"/>
                    </Form.Item>

                    <Form.Item label="Примечание" name="notes">
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