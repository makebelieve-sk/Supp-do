// Вкладка раздела "Характеристики оборудования"
import React, {useState} from "react";
import {Card, Form, Input, Row, Col, Skeleton} from "antd";
import {useSelector} from "react-redux";

import {EquipmentPropertyRoute} from "../../routes/route.EquipmentProperty";
import {onFailed, TabButtons} from "./tab.functions/tab.functions";

const {Meta} = Card;

export const EquipmentPropertyTab = ({specKey, onRemove}) => {
    // Получение списка характеристик оборудования и загрузки записи
    const {item, loadingSkeleton} = useSelector((state) => ({
        item: state.reducerEquipmentProperty.rowDataEquipmentProperty,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    // Инициализация состояния для показа спиннера загрузки при сохранении/удалении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Создание заголовка раздела и имени формы
    const title = !item || item.isNewItem ? "Создание характеристики оборудования" : "Редактирование характеристики оборудования";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        // Устанавливаем спиннер загрузки
        setLoadingSave(true);

        await EquipmentPropertyRoute.save(values, setLoadingSave, onRemove, specKey);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await EquipmentPropertyRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove, specKey);
    };

    const cancelHandler = () => EquipmentPropertyRoute.cancel(onRemove, specKey);

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form
                                    style={{marginTop: '5%'}} labelCol={{span: 6}}
                                    name="equipmentProperty-item"
                                    onFinish={saveHandler}
                                    onFinishFailed={onFailed}
                                    initialValues={{
                                        _id: !item ? null : item._id,
                                        isNewItem: !item ? null : item.isNewItem,
                                        name: !item ? null : item.name,
                                        notes: !item ? null : item.notes,
                                    }}
                                >
                                    <Form.Item name="_id" hidden={true}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="isNewItem" hidden={true}>
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Наименование"
                                        name="name"
                                        rules={[{required: true, message: "Введите наименование!"}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item name="notes" label="Примечание">
                                        <Input maxLength={255} type="text"/>
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
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}
