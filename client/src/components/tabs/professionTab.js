// Вкладка "Профессии"
import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {Card, Form, Input, Row, Col, Button, Skeleton} from 'antd';
import {CheckOutlined, StopOutlined} from '@ant-design/icons';

import {ActionCreator} from "../../redux/combineActions";
import {CheckTypeTab, onSave, onDelete, onFailed, onCancel} from "../helpers/rowTabs.helper";

const {Meta} = Card;

export const ProfessionTab = ({specKey, onRemove}) => {
    // Инициализация стейта для показа спиннера загрузки при сохранении и удалении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Получение списка профессий и загрузки записи из хранилища redux
    const {professions, rowData, loadingSkeleton} = useSelector((state) => ({
        professions: state.reducerProfession.professions,
        rowData: state.reducerProfession.rowDataProfession,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Инициализация заголовка раздела и имени формы
    const title = rowData ? 'Редактирование профессии' : 'Создание профессии';
    const name = rowData ? `control-ref-profession-${rowData.name}` : "control-ref-profession";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = (values) => onSave(
        "professions", values, setLoadingSave, ActionCreator.ActionCreatorProfession.editProfession,
        ActionCreator.ActionCreatorProfession.createProfession, professions, onRemove, specKey, rowData
    ).then(null);

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = (setLoadingDelete, setVisiblePopConfirm) => onDelete(
        "professions", setLoadingDelete, ActionCreator.ActionCreatorProfession.deleteProfession,
        professions, onRemove, specKey, rowData, setVisiblePopConfirm
    ).then(null);

    // Обработка нажатия на кнопку "Отмена"
    const cancelHandler = () => onCancel(onRemove, specKey);

    // Инициализация кнопок, появляющихся при редактировании записи
    const editButtonsComponent = CheckTypeTab(rowData, deleteHandler);

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
                                    form={form}
                                    name={name}
                                    onFinishFailed={onFailed}
                                    onFinish={saveHandler}
                                >
                                    <Form.Item
                                        label="Профессия"
                                        name="name"
                                        initialValue={!rowData ? '' : rowData.name}
                                        rules={[{required: true, message: 'Введите название профессии!'}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item name="notes" label="Примечание" initialValue={!rowData ? '' : rowData.notes}>
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item name="_id" hidden={true} initialValue={!rowData ? '' : rowData._id}>
                                        <Input/>
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

                                            {editButtonsComponent}

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