// Компонент формы записи раздела "Оборудование"
import React, {useEffect, useState} from "react";
import {Card, Form, Input, Select, Tabs} from "antd";

import store from "../../redux/store";
import {ActionCreator} from "../../redux/combineActions";
import {EquipmentRoute} from "../../routes/route.Equipment";
import {CharacteristicComponent} from "../../components/tab.components/characteristic";
import {UploadComponent} from "../../components/tab.components/upload";
import {getOptions, onFailed, TabButtons} from "../tab.functions";

export const EquipmentForm = ({item}) => {
    // Инициализация стейта для показа спиннера загрузки при сохранении/удалении записи и списка файлов
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);

    // Получаем объект пользователя
    const user = store.getState().reducerAuth.user;

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // Создание заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание оборудования" : "Редактирование оборудования";

    // Установка значений формы
    useEffect(() => {
        let properties = [];

        // Начальное значение выбранного элемента в выпадающих списках на вкладке Характеристики
        if (item.properties && item.properties.length) {
            item.properties.forEach(property => {
                properties.push({
                    equipmentProperty: property && property.equipmentProperty ? property.equipmentProperty._id : null,
                    value: property && property.value ? property.value.trim() : ""
                });
            });
        }

        // Добавляем строку характеристик с пустыми значениями
        properties.push({equipmentProperty: null, value: ""});

        // Установка значений формы
        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            name: item.name.trim(),
            notes: item.notes.trim(),
            parent: item.parent ? item.parent._id : null,
            properties
        });
    }, [form, item]);

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        // Устанавливаем спиннер загрузки
        setLoadingSave(true);

        // Получаем массив записей оборудования, массив записей характеристик оборудования и массив файлов
        const equipment = store.getState().reducerEquipment.equipment;
        const equipmentProperties = store.getState().reducerEquipmentProperty.equipmentProperties;
        const files = store.getState().reducerEquipment.files;

        // Устанавливаем в поле parent объект оборудования
        values.parent = equipment.find(eq => eq._id === values.parent);

        // Установка поля "Характеристики"
        if (values.properties && values.properties.length) {
            // Отсеиваем пустые выпадающие списки из вкладки "Характеристики"
            const filterProperties = values.properties.filter(select => select.equipmentProperty);

            // Для каждой записи в поле equipmentProperty устанавливаем объект характеристики оборудования
            if (filterProperties && filterProperties.length) {
                filterProperties.forEach(filterProperty => {
                    filterProperty.equipmentProperty = equipmentProperties.find(equipmentProperty =>
                        equipmentProperty._id === filterProperty.equipmentProperty);
                });

                values.properties = filterProperties;
            } else {
                values.properties = null;
            }
        } else if (!values.properties && item.properties && item.properties.length) {
            // Если пользователь сохранил запись не переходя во вкладку "Характеристики"
            values.properties = item.properties;
        } else {
            values.properties = null;
        }

        values.files = files;

        await EquipmentRoute.save(values, setLoadingSave, equipment);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) =>
        await EquipmentRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm);

    const cancelHandler = () => EquipmentRoute.cancel(setLoadingCancel);

    // Настройка компонента CharacteristicComponent (вкладка "Характеристики")
    const characteristicProps = {form, user};

    // Настройка компонента UploadComponent (вкладка "Файлы")
    const uploadProps = {
        model: "equipment",
        item,
        actionCreatorAdd: ActionCreator.ActionCreatorEquipment.addFile,
        actionCreatorDelete: ActionCreator.ActionCreatorEquipment.deleteFile
    };

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    className="form-styles"
                    name="equipment-item"
                    layout="vertical"
                    onFinish={saveHandler}
                    onFinishFailed={onFailed}
                >
                    <Tabs defaultActiveKey="name">
                        <Tabs.TabPane tab="Наименование" key="name" className="tabPane-styles">
                            <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                            <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>

                            <Form.Item name="parent" label="Принадлежит">
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={getOptions(store.getState().reducerEquipment.equipment)}
                                    onChange={(value) => {
                                        const equipment = store.getState().reducerEquipment.equipment;

                                        const foundEquipment = equipment.find(eq => eq._id === value);

                                        form.setFieldsValue({parent: foundEquipment ? foundEquipment._id : null});
                                    }}
                                />
                            </Form.Item>

                            <Form.Item label="Наименование" name="name" rules={[{
                                required: true,
                                transform: value => value.trim(),
                                message: "Введите название подразделения!"
                            }]}
                            >
                                <Input onChange={e => form.setFieldsValue({name: e.target.value})} maxLength={255} type="text"/>
                            </Form.Item>

                            <Form.Item label="Примечание" name="notes">
                                <Input onChange={e => form.setFieldsValue({notes: e.target.value})} maxLength={255} type="text"/>
                            </Form.Item>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Характеристики" key="characteristics" className="tabPane-styles">
                            <CharacteristicComponent {...characteristicProps} />
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Дополнительно" key="files" className="tabPane-styles">
                            <Form.Item name="files" wrapperCol={{span: 24}}>
                                <UploadComponent {...uploadProps}/>
                            </Form.Item>
                        </Tabs.TabPane>
                    </Tabs>

                    <TabButtons
                        loadingSave={loadingSave}
                        item={item}
                        deleteHandler={deleteHandler}
                        cancelHandler={cancelHandler}
                        loadingCancel={loadingCancel}
                        specKey="equipmentItem"
                    />
                </Form>
            }
        />
    )
}