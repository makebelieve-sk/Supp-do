// Компонент формы записи раздела "Помощь"
import React, {useContext, useEffect, useState} from "react";
import {Card, Form, Input, Select} from "antd";

import {HelpRoute} from "../../routes/route.Help";
import {onFailed, TabButtons} from "../tab.functions";
import {DeleteTabContext} from "../../context/deleteTab.context";
import {sections} from "../../options/global.options/global.options";
import RichTextComponent from "../../components/tab.components/richText/richText.component";

export const HelpForm = ({item}) => {
    // Инициализация состояния для показа спиннера загрузки при сохранении и удалении записи, для значения richText
    const [loadingSave, setLoadingSave] = useState(false);
    const [richTextValue, setRichTextValue] = useState();

    // Инициализация заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание раздела помощи" : "Редактирование раздела помощи";

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // Получаем функцию удаления вкладки onRemove из контекста
    const onRemove = useContext(DeleteTabContext);

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        setRichTextValue(item && item.text ? item.text : "");

        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            date: item.date,
            name: item.name ? item.name.value : null
        });
    }, [item, form]);

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        // При сохранении записи устанавливаем объект Наименования раздела
        values.name = sections.find(section => section.value === values.name);
        values.text = richTextValue;

        await HelpRoute.save(values, setLoadingSave, onRemove);
    }

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await HelpRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove);
    };

    const cancelHandler = () => HelpRoute.cancel(onRemove);

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    className="form-styles"
                    name="help-item"
                    labelCol={{span: 6}} wrapperCol={{span: 18}}
                    onFinishFailed={onFailed}
                    onFinish={saveHandler}
                >
                    <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                    <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>
                    <Form.Item name="date" hidden={true}><Input/></Form.Item>

                    <Form.Item label="Название раздела" name="name" rules={[{required: true, message: "Выберите название раздела!"}]}>
                        <Select
                            showSearch
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            options={sections}
                            onChange={value => {
                                // Находим выбранный раздел
                                const foundSection = sections.find(section => section.value === value);
                                // Устанавливаем в форму значение раздела
                                form.setFieldsValue({department: foundSection ? foundSection.value : null});
                            }}
                        />
                    </Form.Item>

                    <RichTextComponent value={item.text.trim()} onChange={setRichTextValue} />

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