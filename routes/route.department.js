// Маршруты для раздела "Подразделения"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");

const Department = require("../schemes/Department");

const router = Router();

// Валидация полей раздела "Подразделения"
const checkMiddleware = [
    check("name", "Поле 'Наименование' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
    check("notes", "Поле 'Примечание' не должно превышать 255 символов")
        .isString()
        .isLength({max: 255})
];

// Возвращает запись по коду
router.get("/departments/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            item = new Department({name: "", notes: "", parent: null});     // Создание нового экземпляра записи
        } else {
            item = await Department.findById({_id}).populate("parent"); // Получение существующей записи
            isNewItem = false;
        }

        if (!item)
            return res.status(404).json({message: `Подразделение с кодом ${req.params.id} не существует`});

        res.status(200).json({isNewItem, department: item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${req.params.id}: ${err}`})
    }
});

// Возвращает все записи
router.get("/departments", async (req, res) => {
    try {
        // Получаем все записи раздела "Подразделения"
        const items = await Department.find({}).populate("parent");

        res.status(200).json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записей о подразделениях: " + err});
    }
});

// Сохраняет новую запись
router.post("/departments", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {name, notes, parent} = req.body; // Получаем объект записи с фронтенда

        const item = await Department.findOne({name});  // Ищем запись в базе данных по наименованию

        // Проверяем на существование характеристики с указанным именем
        if (item)
            return res.status(400).json({message: `Подразделение с именем ${name} уже существует`});

        // Проверяем на принадлежность отдела
        if (parent && name === parent.name)
            return res.status(500).json({message: "Отдел не может принадлежать сам себе"});

        const newItem = new Department({name, notes, parent});  // Создаем новый экземпляр записи

        await newItem.save();   // Сохраняем запись в базе данных

        const currentDepartment = !parent
            ? await Department.findOne({name})
            : await Department.findOne({name}).populate("parent");

        res.status(201).json({message: "Подразделение сохранено", item: currentDepartment});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/departments", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {_id, name, notes, parent} = req.body;    // Получаем объект записи с фронтенда

        // Ищем запись в базе данных по уникальному идентификатору
        const item = await Department.findById({_id}).populate("parent");

        // Ищем все подразделения
        const departments = await Department.find({}).populate("parent");

        // Проверяем на существование записи с уникальным идентификатором
        if (!item)
            return res.status(404).json({message: `Подразделение с кодом ${_id} не найдено`});

        // Проверяем на принадлежность отдела
        if (parent && name === parent.name)
            return res.status(500).json({message: "Отдел не может принадлежать сам себе"});

        item.parent = parent;

        // Проверка на при надлежность отдела (циклические ссылки)
        if (parent) {
            const checkCycl = (parent) => {
                if (parent && parent.parent) {
                    if (parent.parent._id.toString() === _id.toString()) {
                        item.parent = null;
                        return res.status(500).json({message: "Отдел не может принадлежать сам себе (циклическая ссылка)"});
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

        await item.save();  // Сохраняем запись в базу данных

        const savedItem = await Department.findById({_id}).populate("parent");

        res.status(201).json({message: "Подразделение сохранено", item: savedItem});
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Ошибка при обновлении подразделения: " + err});
    }
});

// Удаляет запись
router.delete("/departments/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        // Получение всех записей подразделений
        const departments = await Department.find({}).populate("parent");

        // Проверка на дочерные отделы
        if (departments && departments.length) {
            for (let i = 0; i < departments.length; i++) {
                if (departments[i].parent && departments[i].parent._id.toString() === _id.toString()) {
                    return res.status(500).json({message: "Невозможно удалить оборудование, т.к. у него есть дочернее оборудование"});
                }
            }
        }

        await Department.deleteOne({_id});  // Удаление записи из базы данных по id записи

        res.status(200).json({message: "Подразделение успешно удалено"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при удалении подразделения с кодом ${_id}: ${err}`});
    }
});

module.exports = router;