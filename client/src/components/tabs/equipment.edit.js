// Раздел "Оборудование"
import React, {useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {Card, Form, Input, Row, Col, Select, Skeleton, Tabs} from "antd";

import {EquipmentRoute} from "../../routes/route.Equipment";
import {ActionCreator} from "../../redux/combineActions";
import {dropdownRender, getOptions, onFailed, TabButtons} from "./tab.functions/tab.functions";
import {CharacteristicComponent} from "../contentComponent/tab.components/characteristic.component";
import {UploadComponent} from "../contentComponent/tab.components/uploadComponent";
import getParents from "../helpers/getRowParents.helper";

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

    // Добавляем поле nameWithParent новым записям
    useMemo(() => {
        // Устанавливаем доп. поле: полное наименование
        if (equipment && equipment.length) {
            equipment.forEach(item => {
                if (item.parent) {
                    item.nameWithParent = getParents(item, equipment) + item.name;
                }
            })
        }
    }, [equipment]);

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
    const title = !item || item.isNewItem ? "Создание оборудования" : "Редактирование оборудования";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        // Устанавливаем спиннер загрузки
        setLoadingSave(true);

        // Обновляем список подразделений
        await EquipmentRoute.getAll();

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

        await EquipmentRoute.save(values, setLoadingSave, onRemove, specKey);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await EquipmentRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove, specKey);
    };

    const cancelHandler = () => EquipmentRoute.cancel(onRemove, specKey, setLoadingCancel);

    // Настройка компонента CharacteristicComponent (вкладка "Характеристики")
    const characteristicProps = {
        equipmentPropertyToOptions,
        dropdownRender,
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
                                            isNewItem: !item ? null : item.isNewItem,
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
                                                <Form.Item name="isNewItem" hidden={true}>
                                                    <Input/>
                                                </Form.Item>

                                                <Form.Item name="parent" label="Принадлежит">
                                                    <Select
                                                        options={options}
                                                        onDropdownVisibleChange={async open => {
                                                            await dropdownRender(open, setLoadingSelectEquipment, EquipmentRoute, setOptions, equipment);
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
                                                <CharacteristicComponent {...characteristicProps} />
                                            </TabPane>

                                            <TabPane tab="Дополнительно" key="files" className="tabPane-styles">
                                                <Form.Item name="files" wrapperCol={{span: 24}}>
                                                    <UploadComponent {...uploadProps}/>
                                                </Form.Item>
                                            </TabPane>
                                        </Tabs>

                                        <TabButtons
                                            loadingSave={loadingSave}
                                            item={item}
                                            deleteHandler={deleteHandler}
                                            cancelHandler={cancelHandler}
                                            loadingCancel={loadingCancel}
                                        />
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