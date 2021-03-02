// Вкладка "Профессии"
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Card, Form, Input, Row, Col, Button, Skeleton} from "antd";
import {CheckOutlined, StopOutlined} from "@ant-design/icons";

import {Professions} from "../../../model/Profession";
import {CheckTypeTab, onFailed} from "../../helpers/tab.helpers/tab.functions";

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
    const title = !item || item.itemId === "-1" ? "Создание профессии" : "Редактирование профессии";
    const name = !item || item.itemId === "-1" ? "control-ref-profession" : `control-ref-profession-${item._id}`;

    console.log(name)
    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        await Professions.save(values, setLoadingSave, onRemove, specKey);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm, onRemove, specKey) => {
        await Professions.delete(item, setLoadingDelete, setVisiblePopConfirm, onRemove, specKey);
    };

    const cancelHandler = () => Professions.cancel(onRemove, specKey);

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
                                    name={name}
                                    onFinishFailed={onFailed}
                                    onFinish={saveHandler}
                                    initialValues={{
                                        _id: item ? item._id : "-1",
                                        itemId: item ? item.itemId : "-1",
                                        name: item ? item.name : "",
                                        notes: item ? item.notes : ""
                                    }}
                                >
                                    <Form.Item name="_id" hidden={true}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="itemId" hidden={true}>
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

                                    <Form.Item>
                                        <Row justify="end" style={{marginTop: 20}}>
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
                                                icon={<StopOutlined/>}
                                            >
                                                Отмена
                                            </Button>
                                        </Row>
                                    </Form.Item>
                                </Form>
                            }
                        />
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}