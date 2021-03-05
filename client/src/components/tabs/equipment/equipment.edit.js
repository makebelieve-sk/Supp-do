// Раздел "Оборудование"
import React, {useState} from 'react';
import {Button, Card, Form, Input, Row, Col, Select, Skeleton, Tabs} from 'antd';
import {CheckOutlined, StopOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";

import {Equipment} from "../../../model/equipment";

import {ActionCreator} from "../../../redux/combineActions";
import {RowMapHelper} from "../../helpers/table.helpers/tableMap.helper";
import {CheckTypeTab, getOptions, onFailed} from "../../helpers/tab.helpers/tab.functions";

import {CharacteristicComponent} from "../../contentComponent/tab.components/characteristic.component";
import {UploadComponent} from "../../contentComponent/tab.components/uploadComponent";

const {Meta} = Card;
const {TabPane} = Tabs;

export const EquipmentTab = ({specKey, onRemove}) => {
    // Получение списка подразделений и загрузки записи
    const {equipment, item, loadingSkeleton, equipmentProperties, files} = useSelector((state) => ({
        equipment: state.reducerEquipment.equipment,
        item: state.reducerEquipment.rowDataEquipment,
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        equipmentProperties: state.reducerEquipmentProperty.equipmentProperties,
        files: state.reducerEquipment.files
    }));

    // Инициализация стейта для показа спиннера загрузки при сохранении/удалении записи, обновлении выпадающих списков
    // и списка файлов
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingSelectEquipment, setLoadingSelectEquipment] = useState(false);
    const [loadingSelectCharacteristics, setLoadingSelectCharacteristics] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);

    // Создание стейта для значений в выпадающих списках
    const [options, setOptions] = useState(getOptions(equipment));
    const [equipmentPropertyToOptions, setEquipmentPropertyToOptions] = useState(getOptions(equipmentProperties));

    let initialOptions = {_id: null};
    let characteristicArr = [];

    // Начальное значение выбранного элемента в выпадающем списке Подразделения
    if (equipment && equipment.length && item && item.parent) {
        initialOptions = equipment.find(eq => eq._id === item.parent._id);
    }

    // Начальное значение выбранного элемента в выпадающих списках на вкладке Характеристики
    if (item && item.properties && item.properties.length) {
        item.properties.forEach(property => {
            let obj = {
                equipmentProperty: property.equipmentProperty ? property.equipmentProperty.name : "Не выбрано",
                value: property ? property.value : ""
            };

            characteristicArr.push(obj);
        });
    }

    // Создание заголовка раздела и имени формы
    const title = !item || item.isCreated ? "Создание оборудования" : "Редактирование оборудования";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        // Устанавливаем спиннер загрузки
        setLoadingSave(true);

        // Обновляем список подразделений
        await Equipment.getAll();

        // Проверяем, есть ли выбранный элемент в списке подразделений
        const foundEquipment = equipment.find(eq => {
            return eq._id === values.parent;
        });

        values.parent = foundEquipment ? foundEquipment : null;
        // Проверяем, выбраны ли значения в выпадающих списках на вкладке Характеристики
        if (values.properties) {
            values.properties = values.properties.filter(select => {
                return select.equipmentProperty !== "Не выбрано" && select.equipmentProperty;
            });
        } else if (!values.properties && item.properties && item.properties.length) {
            values.properties = item.properties;
        } else {
            values.properties = [];
        }

        values.files = files;

        await Equipment.save(values, setLoadingSave, onRemove, specKey);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await Equipment.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove, specKey);
    };

    const cancelHandler = () => Equipment.cancel(onRemove, specKey, setLoadingCancel);

    // Обновление выпадающего списка "Подразделения"
    const dropDownRenderHandler = async (open, setLoadingSelect, model, setOptions, dataStore) => {
        try {
            if (open) {
                setLoadingSelect(true);

                await model.getAll();

                setOptions(getOptions(dataStore));

                setLoadingSelect(false);
            }
        } catch (e) {
            setLoadingSelect(false);
        }
    }

    // Настройка компонента CharacteristicComponent (вкладка "Характеристики")
    const characteristicProps = {
        equipmentPropertyToOptions,
        dropDownRenderHandler,
        loadingSelectCharacteristics,
        setLoadingSelectCharacteristics,
        equipmentProperties,
        setEquipmentPropertyToOptions
    }

    // Настройка компонента UploadComponent (вкладка "Файлы")
    const uploadProps = {
        files,
        model: "equipment",
        item,
        actionCreatorAdd: ActionCreator.ActionCreatorEquipment.addFile,
        actionCreatorDelete: ActionCreator.ActionCreatorEquipment.deleteFile
    }

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 24}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <>
                                    <Form
                                        className="form-styles"
                                        name="equipment-item"
                                        layout="vertical"
                                        onFinish={saveHandler}
                                        onFinishFailed={onFailed}
                                        initialValues={{
                                            _id: !item ? null : item._id,
                                            isCreated: !item ? null : item.isCreated,
                                            name: !item ? null : item.name,
                                            notes: !item ? null : item.notes,
                                            parent: item && initialOptions ? initialOptions._id : null,
                                            properties: item && item.properties && item.properties.length ? characteristicArr : [{equipmentProperty: "Не выбрано", value: null}]
                                        }}
                                    >
                                        <Tabs defaultActiveKey="name">
                                            <TabPane tab="Наименование" key="name" className="tabPane-styles">
                                                <Form.Item name="_id" hidden={true}>
                                                    <Input/>
                                                </Form.Item>
                                                <Form.Item name="isCreated" hidden={true}>
                                                    <Input/>
                                                </Form.Item>

                                                <Form.Item name="parent" label="Принадлежит">
                                                    <Select
                                                        options={options}
                                                        onDropdownVisibleChange={async open => {
                                                            await dropDownRenderHandler(open, setLoadingSelectEquipment, Equipment, setOptions, equipment);
                                                        }}
                                                        loading={loadingSelectEquipment}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Наименование"
                                                    name="name"
                                                    rules={[{
                                                        required: true,
                                                        message: "Введите название подразделения!"
                                                    }]}
                                                >
                                                    <Input maxLength={255} type="text"/>
                                                </Form.Item>

                                                <Form.Item label="Примечание" name="notes">
                                                    <Input maxLength={255} type="text"/>
                                                </Form.Item>
                                            </TabPane>

                                            <TabPane tab="Характеристики" key="characteristics" className="tabPane-styles">
                                                <Row className="button-add-equipmentProperty" justify="end">
                                                    <Button
                                                        type="primary"
                                                        onClick={() => RowMapHelper("equipmentProperties", null)}
                                                    >Добавить характеристику</Button>
                                                </Row>

                                                <CharacteristicComponent {...characteristicProps} />
                                            </TabPane>

                                            <TabPane tab="Дополнительно" key="files" className="tabPane-styles">
                                                <Form.Item name="files" wrapperCol={{span: 24}}>
                                                    <UploadComponent {...uploadProps}/>
                                                </Form.Item>
                                            </TabPane>
                                        </Tabs>

                                        <Row justify="end" style={{marginTop: 20}} xs={{gutter: [8, 8]}}>
                                            <Button
                                                className="button-style"
                                                type="primary"
                                                htmlType="submit"
                                                loading={loadingSave}
                                                icon={<CheckOutlined/>}
                                            >
                                                Сохранить
                                            </Button>

                                            {CheckTypeTab(item, deleteHandler)}

                                            <Button
                                                className="button-style"
                                                type="secondary"
                                                onClick={cancelHandler}
                                                loading={loadingCancel}
                                                icon={<StopOutlined/>}
                                            >
                                                Отмена
                                            </Button>
                                        </Row>
                                    </Form>
                                </>
                            }
                        />
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}