import React from 'react';
import {Tree, Row} from 'antd';

const { DirectoryTree } = Tree;

export const TreeComponent = ({dataStore}) => {
    // Сортируем массив по полю "parent"
    dataStore.sort((a, b) => a.parent && b.parent && a.parent.name > b.parent.name ? 1 : -1);

    // Находим записи, у которых указано, какому подразделению они принадлежат
    let notNullParentData = dataStore.filter(obj => {
        return obj.parent;
    })

    // Находим записи, у которых нет указанного подразделения (такие записи будут на самом верху)
    let nullParentData = dataStore.filter(obj => {
        return !obj.parent;
    })

    // Создаем массив
    let treeData = [];

    // Пушим в массив самые верхние записи
    if (nullParentData && nullParentData.length > 0) {
        nullParentData.forEach(nullParent => {
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
    const createTree = (childrenArr, firstRun) => {
        if (firstRun) {
            childrenArr.forEach(nullParent => {
                notNullParentData.forEach(notNullParent => {
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
                createTree(obj);
            })
        } else {
            childrenArr.children.forEach(childObj => {
                notNullParentData.forEach(notNullParent => {
                    if (notNullParent.parent.name === childObj.title) {
                        childObj.children.push({
                            title: notNullParent.name,
                            key: notNullParent._id,
                            children: []
                        })

                        createTree(childObj);
                    }
                })
            })
        }
    }

    // Вызов функции рекурсии с начальными параметрами
    if (treeData && treeData.length > 0) {
        createTree(treeData, true);
    }

    return (
        <Row className="tree-wrapper">
            <DirectoryTree
                treeData={treeData}
            />
        </Row>
    );
}