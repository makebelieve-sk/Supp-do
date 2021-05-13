// Компонент формы записи раздела "Подразделения"
import React, {useEffect, useState} from "react";
import {Card, Form, Input, Select} from "antd";
import {getOptions, onFailed, TabButtons} from "../tab.functions";

import {DepartmentRoute} from "../../routes/route.Department";
import store from "../../redux/store";
import {onRemove} from "../../components/content.components/content/content.component";

export const DepartmentForm = ({item}) => {
    // Инициализация состояния для показа индикатора загрузки при изменении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Создание заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание подразделения" : "Редактирование подразделения";

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            name: item.name.trim(),
            notes: item.notes.trim(),
            parent: item.parent ? item.parent._id : null,
        });
    }, [item, form]);

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        const departments = store.getState().reducerDepartment.departments;

        // Проверяем, есть ли выбранный элемент в списке
        values.parent = departments.find(department => department._id === values.parent);

        await DepartmentRoute.save(values, setLoadingSave, departments);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await DepartmentRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm);
    };

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    className="form-styles"
                    labelCol={{span: 6}} wrapperCol={{span: 18}}
                    name="department-item"
                    onFinish={saveHandler}
                    onFinishFailed={onFailed}
                >
                    <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                    <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>

                    <Form.Item name="parent" label="Принадлежит">
                        <Select
                            showSearch
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            options={getOptions(store.getState().reducerDepartment.departments)}
                            onChange={value => {
                                const departments = store.getState().reducerDepartment.departments;

                                const foundDepartment = departments.find(department => department._id === value);

                                form.setFieldsValue({department: foundDepartment ? foundDepartment._id : null});
                            }}
                        />
                    </Form.Item>

                    <Form.Item label="Наименование" name="name" rules={[{
                        required: true,
                        transform: value => value.trim(),
                        message: "Введите название подразделения!"
                    }]}>
                        <Input onChange={e => form.setFieldsValue({name: e.target.value})} maxLength={255} type="text"/>
                    </Form.Item>

                    <Form.Item label="Примечание" name="notes">
                        <Input onChange={e => form.setFieldsValue({notes: e.target.value})} maxLength={255} type="text"/>
                    </Form.Item>

                    <TabButtons
                        loadingSave={loadingSave}
                        item={item}
                        deleteHandler={deleteHandler}
                        cancelHandler={() => onRemove("departmentItem", "remove")}
                    />
                </Form>
            }
        />
    )
}