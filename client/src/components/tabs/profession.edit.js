// Вкладка "Профессии"
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Card, Form, Input, Row, Col, Skeleton} from "antd";

import {ProfessionRoute} from "../../routes/route.profession";
import {onFailed, TabButtons} from "./tab.functions/tab.functions";

const {Meta} = Card;

export const ProfessionTab = ({specKey, onRemove}) => {
    // Получение списка профессий и загрузки записи из хранилища redux
    const {item, loadingSkeleton} = useSelector((state) => ({
        item: state.reducerProfession.rowDataProfession,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    // Инициализация состояния для показа спиннера загрузки при сохранении и удалении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Инициализация заголовка раздела и имени формы
    const title = !item || item.isNewItem ? "Создание профессии" : "Редактирование профессии";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        await ProfessionRoute.save(values, setLoadingSave, onRemove, specKey);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await ProfessionRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove, specKey);
    };

    const cancelHandler = () => ProfessionRoute.cancel(onRemove, specKey);

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form
                                    style={{marginTop: '5%'}}
                                    name="profession-item"
                                    onFinishFailed={onFailed}
                                    onFinish={saveHandler}
                                    initialValues={{
                                        _id: !item ? null : item._id,
                                        isNewItem: !item ? null : item.isNewItem,
                                        name: !item ? null : item.name,
                                        notes: !item ? null : item.notes
                                    }}
                                >
                                    <Form.Item name="_id" hidden={true}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="isNewItem" hidden={true}>
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Профессия"
                                        name="name"
                                        rules={[{required: true, message: "Введите название профессии!"}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item label="Примечание" name="notes">
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