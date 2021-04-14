// Функция построения древовидной структуры данных
export const createTreeData = (dataStore) => {
    if (!dataStore || !dataStore.length) {
        return [];
    }

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
                _id: nullParent._id,
                key: nullParent._id,
                children: [],
                parent: "",
                name: nullParent.name,
                notes: nullParent.notes
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
                    if (notNullParent.parent._id === nullParent.key) {
                        if (nullParent.children.includes({
                            _id: notNullParent._id,
                            key: notNullParent._id,
                            children: [],
                            parent: notNullParent.parent,
                            name: notNullParent.name,
                            notes: notNullParent.notes
                        })) {
                            return null;
                        } else {
                            nullParent.children.push({
                                _id: notNullParent._id,
                                key: notNullParent._id,
                                children: [],
                                parent: notNullParent.parent,
                                name: notNullParent.name,
                                notes: notNullParent.notes
                            });
                        }
                    }
                })

                if (nullParent.children && nullParent.children.length === 0) {
                    nullParent.children = null;
                }
            });

            childrenArr.forEach(obj => createTree(obj));
        } else {
            if (!childrenArr.children) {
                return null;
            }

            childrenArr.children.forEach(childObj => {
                notNullParentData.forEach(notNullParent => {
                    if (notNullParent.parent._id === childObj.key) {
                        if (childObj.children.includes({
                            _id: notNullParent._id,
                            key: notNullParent._id,
                            children: [],
                            parent: notNullParent.parent,
                            name: notNullParent.name,
                            notes: notNullParent.notes
                        })) {
                            return null;
                        } else {
                            childObj.children.push({
                                _id: notNullParent._id,
                                key: notNullParent._id,
                                children: [],
                                parent: notNullParent.parent,
                                name: notNullParent.name,
                                notes: notNullParent.notes
                            })
                        }

                        createTree(childObj);
                    }
                })

                if (childObj.children && childObj.children.length === 0) {
                    childObj.children = null;
                }
            })
        }
    }

    // Вызов функции рекурсии с начальными параметрами
    if (treeData && treeData.length > 0) {
        createTree(treeData, true);
    }

    return treeData;
}