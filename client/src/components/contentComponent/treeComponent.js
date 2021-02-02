import React from 'react';
import {useSelector} from 'react-redux';
import {Tree, Row} from 'antd';

export const TreeComponent = () => {
    const departments = useSelector((state) => state.departments);

    // Сортируем массив по полю "Принадлежит"
    departments.sort((a, b) => a.parent && b.parent && a.parent.name > b.parent.name ? 1 : -1);

    // Находим записи, у которых указано, какому подразделению они принадлежат
    let notNullParentDep = departments.filter(obj => {
        return obj.parent;
    })

    // Находим записи, у которых нет указанного подразделения (такие записи будут на самом верху)
    let nullParentDep = departments.filter(obj => {
        return !obj.parent;
    })

    // Создаем массив
    let treeData = [];

    // Пушим в массив самые верхние записи
    if (nullParentDep && nullParentDep.length > 0) {
        nullParentDep.forEach(nullParent => {
            treeData.push({
                title: nullParent.name,
                key: nullParent._id,
                children: []
            })
        })
    }

    // Инициализация функции рекурсии, если флаг есть, значит это первый заход в функцию, проходим внутрь 1 раз
    // Если флага нет, значит заходим в рекурсию изнутри массива результатов, значит надо добавлять вложенности,
    // значит создаем цикл
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

    // Вызов функции рекурсии с начальными параметрами
    if (treeData && treeData.length > 0) {
        rek(treeData, true);
    }

    return (
        <Row className="tree-wrapper">
            <Tree treeData={treeData} />
        </Row>
    );
}