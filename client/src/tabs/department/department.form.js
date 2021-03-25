// Компонент формы записи раздела "Подразделения"
import React, {useContext, useEffect, useMemo, useState} from "react";
import {Card, Form, Input, Select} from "antd";
import {dropdownRender, onFailed, TabButtons} from "../tab.functions";

import {DepartmentRoute} from "../../routes/route.Department";
import {DeleteTabContext} from "../../context/deleteTab.context";
import store from "../../redux/store";
import {getParents} from "../../helpers/functions/general.functions/replaceField";

export const DepartmentForm = ({item}) => {
    // Пустое значение выпадающего списка
    const emptyDropdown = useMemo(() => [{label: "Не выбрано", value: null}], []);

    const departments = store.getState().reducerDepartment.departments;

    // Создание состояния для значений в выпадающем списке "Принадлежит"
    const [departmentsOptions, setDepartments] = useState(item.parent ? [{label: getParents(item.parent, departments) + item.parent.name, value: item.parent._id}] : emptyDropdown);

    // Инициализация состояния для показа индикатора загрузки при изменении записи и обновлении выпадающего списка
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingSelect, setLoadingSelect] = useState(false);

    // Создание заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание подразделения" : "Редактирование подразделения";

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // Получаем функцию удаления вкладки onRemove из контекста
    const onRemove = useContext(DeleteTabContext);

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        const departments = store.getState().reducerDepartment.departments;

        setDepartments(item.parent ? [{label: getParents(item.parent, departments) + item.parent.name, value: item.parent._id}] : emptyDropdown);

        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            name: item.name,
            notes: item.notes,
            parent: item.parent ? item.parent._id : null,
        });
    }, [item, form, emptyDropdown]);

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        const departments = store.getState().reducerDepartment.departments;

        // Проверяем, есть ли выбранный элемент в списке
        values.parent = departments.find(department => department._id === values.parent);

        await DepartmentRoute.save(values, setLoadingSave, onRemove, departments);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await DepartmentRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove);
    };

    const cancelHandler = () => DepartmentRoute.cancel(onRemove);

    console.log("Обновление вкладки Departments")

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
                            options={departmentsOptions}
                            onDropdownVisibleChange={open => dropdownRender(open, setLoadingSelect, setDepartments, "departments")}
                            loading={loadingSelect}
                            onChange={value => {
                                const departments = store.getState().reducerDepartment.departments;

                                const foundDepartment = departments.find(department => department._id === value);

                                form.setFieldsValue({department: foundDepartment ? foundDepartment._id : null});
                            }}
                        />
                    </Form.Item>

                    <Form.Item label="Наименование" name="name" rules={[{required: true, message: "Введите название подразделения!"}]}>
                        <Input onChange={e => form.setFieldsValue({name: e.target.value})} maxLength={255} type="text"/>
                    </Form.Item>

                    <Form.Item label="Примечание" name="notes">
                        <Input onChange={e => form.setFieldsValue({notes: e.target.value})} maxLength={255} type="text"/>
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