import React from 'react';
import {useSelector} from 'react-redux';
import {Tree, Row} from 'antd';

export const TreeComponent = () => {
    const departments = useSelector((state) => state.departments);

    // ��������� ������ �� ���� "�����������"
    departments.sort((a, b) => a.parent && b.parent && a.parent.name > b.parent.name ? 1 : -1);

    // ������� ������, � ������� �������, ������ ������������� ��� �����������
    let notNullParentDep = departments.filter(obj => {
        return obj.parent;
    })

    // ������� ������, � ������� ��� ���������� ������������� (����� ������ ����� �� ����� �����)
    let nullParentDep = departments.filter(obj => {
        return !obj.parent;
    })

    // ������� ������
    let treeData = [];

    // ����� � ������ ����� ������� ������
    if (nullParentDep && nullParentDep.length > 0) {
        nullParentDep.forEach(nullParent => {
            treeData.push({
                title: nullParent.name,
                key: nullParent._id,
                children: []
            })
        })
    }

    // ������������� ������� ��������, ���� ���� ����, ������ ��� ������ ����� � �������, �������� ������ 1 ���
    // ���� ����� ���, ������ ������� � �������� ������� ������� �����������, ������ ���� ��������� �����������,
    // ������ ������� ����
    const rek = (childrenArr, flag) => {
        if (flag) {
            childrenArr.forEach(nullParent => {
                notNullParentDep.forEach(notNullParent => {
                    if (notNullParent.parent.name === nullParent.title) {
                        nullParent.children.push({
                            title: notNullParent.name,
                            key: notNullParent._id,
                            children: []
                        });
                    }
                })
            })
            childrenArr.forEach(obj => {
                rek(obj);
            })
        } else {
            childrenArr.children.forEach(childObj => {
                notNullParentDep.forEach(notNullParent => {
                    if (notNullParent.parent.name === childObj.title) {
                        childObj.children.push({
                            title: notNullParent.name,
                            key: notNullParent._id,
                            children: []
                        })

                        rek(childObj);
                    }
                })
            })
        }
    }

    // ����� ������� �������� � ���������� �����������
    if (treeData && treeData.length > 0) {
        rek(treeData, true);
    }

    return (
        <Row className="tree-wrapper">
            <Tree treeData={treeData} />
        </Row>
    );
}