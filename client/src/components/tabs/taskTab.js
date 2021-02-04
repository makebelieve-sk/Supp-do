import React, {useEffect, useState} from 'react';
import {Card, Form, Input, Row, Col, Button, message, Skeleton, Checkbox} from 'antd';
import {useSelector, useDispatch} from "react-redux";
import {CheckOutlined, DeleteOutlined, PrinterOutlined, StopOutlined} from '@ant-design/icons';

import {useHttp} from "../../hooks/http.hook";
import ActionCreator from "../../redux/actionCreators";

const {Meta} = Card;

export const TaskTab = ({add, specKey, onRemove, loadingData, tabData}) => {
    // ��������� �������� �������� ��� ���������� ������
    const [loadingSave, setLoadingSave] = useState(false);

    // ��������� ������� �������� �������� �� ������, ��������� ��������/�������� ��� �������� �������� � ������,
    // �������� ������
    const {request, loadingDelete, error, clearError} = useHttp();

    // ��������� ������ ��������� ������ � �������� ������ �� ��������� redux
    const {tasks, loadingSkeleton} = useSelector((state) => ({
        tasks: state.tasks,
        loadingSkeleton: state.loadingSkeleton
    }));
    const dispatch = useDispatch();

    // ����������� ��������� �������� ��� ����� "������������" � "����������"
    let initialName, initialColor, initialNotes, initialIsFinish;

    // ���� ������� ��������������, �� ������������� ��������� �������� ��� ����� "������������", "����" � "����������"
    if (tabData) {
        initialName = tabData.name;
        initialColor = tabData.color;
        initialNotes = tabData.notes;
        initialIsFinish = tabData.isFinish;
    }

    // ������������� ���� useForm() �� Form antd
    const [form] = Form.useForm();

    // ��������� ��������� �������� ����� "������������", "����" � "����������", � ���� ������� �������������
    useEffect(() => {
        if (tabData) {
            form.setFieldsValue({name: initialName, color: initialColor, notes: initialNotes, isFinish: initialIsFinish});
        } else {
            return null;
        }
    }, [form, initialName, initialColor, initialNotes, initialIsFinish, tabData]);

    // ��� ��������� ������, �������������� ���� ������ ���� ������
    useEffect(() => {
        if (error) {
            message.error(error);
        }

        clearError();
    }, [dispatch, error, request, clearError]);

    let title = specKey === 'newTask' ? '�������� ������ � ��������� ������' : '�������������� ������ � ��������� ������';

    // ������� ���������� ������
    const onSave = async (values) => {
        try {
            setLoadingSave(true);

            let method = !tabData ? 'POST' : 'PUT';
            let body = !tabData ? values : {tabData, values};

            const data = await request('/api/directory/taskStatus', method, body);

            if (data) {
                setLoadingSave(false);

                message.success(data.message);

                // �������� ������� �������
                onRemove(specKey, 'remove');

                // ���� ��� �������������� ������, �� ���������� ��������� ������ � ��������� redux,
                // ����� ���������� ������ ����� ������ � ��������� redux
                !tabData ?
                    dispatch(ActionCreator.createTask(data.task)) :
                    tasks.forEach((task, index) => {
                        if (task._id === data.task._id) {
                            dispatch(ActionCreator.editTask(index, data.task));
                        }
                    });
            }
        } catch (e) {
        }
    };

    // ������� �������� ������
    const deleteHandler = async () => {
        try {
            if (tabData) {
                const data = await request('/api/directory/taskStatus', 'DELETE', tabData);

                if (data) {
                    message.success(data.message);

                    // �������� ������� �������
                    onRemove(specKey, 'remove');

                    // ������� ������ �� ��������� redux
                    tasks.forEach((task, index) => {
                        if (task._id === tabData._id) {
                            dispatch(ActionCreator.deleteTask(index));
                        }
                    });
                }
            }
        } catch (e) {
        }
    };

    // ����� ��������� ��������� �����
    const onFinishFailed = () => {
        message.error('��������� ������������ ����');
    };

    // ������� ������� �� ������ "������"
    const cancelHandler = () => {
        // ������� ������� �������
        onRemove(specKey, 'remove');
    }

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form style={{marginTop: '5%'}} form={form}
                                      name={tabData ? `control-ref-task-${tabData.name}` : "control-ref-task"}
                                      onFinish={onSave} onFinishFailed={onFinishFailed}>
                                    <Form.Item
                                        label="������������"
                                        name="name"
                                        initialValue={!tabData ? '' : tabData.name}
                                        rules={[{required: true, message: '������� ������������ ������!'}]}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item
                                        name="color"
                                        label="����"
                                        initialValue={!tabData ? '' : tabData.color}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item
                                        name="notes"
                                        label="����������"
                                        initialValue={!tabData ? '' : tabData.notes}
                                    >
                                        <Input maxLength={255} type="text"/>
                                    </Form.Item>

                                    <Form.Item name="isFinish" valuePropName="checked">
                                        <Checkbox>���������</Checkbox>
                                    </Form.Item>

                                    <Form.Item>
                                        <Row justify="end" style={{marginTop: 20}}>
                                            <Button className="button-style" type="primary" htmlType="submit"
                                                    loading={loadingSave}
                                                    icon={<CheckOutlined/>}>
                                                ���������
                                            </Button>
                                            {!tabData ? null :
                                                <>
                                                    <Button className="button-style" type="danger" onClick={deleteHandler}
                                                            loading={loadingDelete} icon={<DeleteOutlined/>}>
                                                        �������
                                                    </Button>
                                                    <Button className="button-style" type="secondary"
                                                            onClick={() => alert(1)}
                                                            icon={<PrinterOutlined/>}>
                                                        ������
                                                    </Button>
                                                </>
                                            }
                                            <Button className="button-style" type="secondary" onClick={cancelHandler}
                                                    icon={<StopOutlined/>}>
                                                ������
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