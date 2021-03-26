// Маршруты для подразделений
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const Department = require("../schemes/Department");
const router = Router();

// Валидация полей раздела "Подразделения"
const checkMiddleware = [
    check("name", "Некорректное наименование подразделения").isString().notEmpty().isLength({ max: 255 }),
    check("notes", "Максимальная длина поля 'Примечание' составляет 255 символов").isString().isLength({ max: 255 })
];

// Возвращает запись по коду
router.get("/departments/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            // Создание новой записи
            item = new Department({name: "", notes: "", parent: null});
        } else {
            // Редактирование существующей записи
            item = await Department.findById({_id}).populate("parent");
            isNewItem = false;
        }

        if (!item) {
            return res.status(400).json({message: `Подразделение с кодом ${req.params.id} не существует`});
        }

        res.status(201).json({isNewItem, department: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${req.params.id}`})
    }
});

// Возвращает все записи
router.get("/departments", async (req, res) => {
    try {
        const items = await Department.find({}).populate("parent");

        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении записей о подразделениях"})
    }
});

// Сохраняет новую запись
router.post("/departments", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});
        }

        const {name, notes, parent} = req.body;
        const item = await Department.findOne({name});

        if (item) {
            return res.status(400).json({message: `Подразделение с именем ${name} уже существует`});
        }

        if (name === "" || !name) {
            return res.status(400).json({message: "Поле 'Наименование' должно быть заполнено"});
        }

        if (parent) {
            if (name === parent.name) {
                return res.status(400).json({message: "Отдел не может принадлежать сам себе"});
            }
        }

        const newItem = new Department({name, notes, parent});
        await newItem.save();

        let currentDepartment;

        if (!parent) {
            currentDepartment = await Department.findOne({name});
        } else {
            currentDepartment = await Department.findOne({name}).populate("parent");
        }

        res.status(201).json({message: "Подразделение сохранено", item: currentDepartment});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put("/departments", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});
        }

        const {_id, name, notes, parent} = req.body;
        const item = await Department.findById({_id}).populate("parent");
        const departments = await Department.find({}).populate("parent");

        if (!item) {
            return res.status(400).json({message: `Подразделение с кодом ${_id} не найдено`});
        }

        if (!name) {
            return res.status(400).json({message: "Поле 'Наименование' должно быть заполнено"});
        }

        if (parent) {
            if (name === parent.name) {
                return res.status(400).json({message: "Отдел не может принадлежать сам себе"});
            }
        }

        item.parent = parent;

        if (parent) {
            const checkCycl = (parent) => {
                if (parent && parent.parent) {
                    if (parent.parent._id.toString() === _id.toString()) {
                        item.parent = null;
                        return res.status(400).json({message: "Отдел не может принадлежать сам себе (циклическая ссылка)"});
                    } else {
                        const parentItem = departments.find(department => department._id.toString() === parent.parent._id.toString());

                        // Вызов рекурсии с найденным родителем
                        checkCycl(parentItem ? parentItem : null);
                    }
                }
            }

            // Объект, установленный в качестве родителя
            const departmentWithParent = departments.find(department => department._id.toString() === parent._id.toString());

            // Вызов рекурсии с объектом, установленным в качестве родителя
            checkCycl(departmentWithParent);
        }

        item.name = name;
        item.notes = notes;

        await item.save();

        const savedItem = await Department.findById({_id}).populate("parent");

        res.status(201).json({message: "Подразделение сохранено", item: savedItem});
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "Ошибка при обновлении подразделения"})
    }
});

// Удаляет запись
router.delete("/departments/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const departments = await Department.find({}).populate("parent");

        if (departments && departments.length) {
            for (let i = 0; i < departments.length; i++) {
                if (departments[i].parent && departments[i].parent._id.toString() === _id.toString()) {
                    return res.status(400).json({message: "Невозможно удалить оборудование, т.к. у него есть дочернее оборудование"});
                }
            }
        }

        await Department.deleteOne({_id});

        res.status(201).json({message: "Подразделение успешно удалено"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении подразделения с кодом ${_id}`});
    }
});

module.exports = router;