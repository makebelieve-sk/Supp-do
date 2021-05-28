// Функция построения древовидной структуры данных
export const createTreeData = (dataStore) => {
    if (!dataStore || !dataStore.length) {
        return [];
    }

    // Находим записи, у которых указано, какому подразделению они принадлежат
    const notNullParentData = dataStore.filter(obj => obj.parent);

    // Находим записи, у которых нет указанного подразделения (такие записи будут на самом верху)
    const nullParentData = dataStore.filter(obj => !obj.parent);

    // Создаем массив
    let treeData = [];

    // Пушим в массив самые верхние записи
    if (nullParentData && nullParentData.length) {
        nullParentData.forEach(nullParent => {
            treeData.push({
                _id: nullParent._id,
                key: nullParent._id,
                children: [],
                parent: "",
                name: nullParent.name,
                notes: nullParent.notes
            });
        });
    }

    // Функция рекурсии для построения древовидной структуры данных
    const createTree = (childrenArr, firstRun = false) => {
        if (firstRun) {
            childrenArr.forEach(nullParent => {
                notNullParentData.forEach(notNullParent => {
                    if (notNullParent.parent._id === nullParent._id) {
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
                });
            });

            childrenArr.forEach(obj => {
                if (obj.children && obj.children.length === 0) {
                    obj.children = null;
                }

                createTree(obj);
            });
        } else {
            if (!childrenArr.children) {
                return null;
            }

            childrenArr.children.forEach(childObj => {
                notNullParentData.forEach(notNullParent => {
                    if (notNullParent.parent._id === childObj._id) {
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
                    }
                })
            });

            childrenArr.children.forEach(obj => {
                if (obj.children && obj.children.length === 0) {
                    obj.children = null;
                }

                createTree(obj);
            });
        }
    }

    // Вызов функции рекурсии с начальными параметрами
    if (treeData && treeData.length) {
        createTree(treeData, true);
    }

    return treeData;
}