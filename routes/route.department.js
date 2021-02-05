// Маршруты для подразделений
const {Router} = require("express");
const Department = require("../models/Department");
const router = Router();

// Возвращает запись по коду
router.get('/departments/:id', async (req, res) => {
    try {
        const item = await Department.findById({_id: req.params.id}).populate('parent');

        if (!item) {
            return res.status(400).json({message: `Подразделение с кодом ${req.params.id} не существует`});
        }

        res.status(201).json({department: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${req.params.id}`})
    }
});

// Возвращает все записи
router.get('/departments', async (req, res) => {
    try {
        const items = await Department.find({}).populate('parent');
        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении записей о подразделениях"})
    }
});

// Сохраняет новую запись
router.post('/departments', async (req, res) => {
    try {
        const {name, notes, parent} = req.body;

        const item = await Department.findOne({name});

        if (item) {
            return res.status(400).json({message: `Подразделение с именем ${name} уже существует`});
        }

        if (parent) {
            if (name === parent.name) {
                return res.status(400).json({message: "Отдел не может принадлежать сам себе"});
            }
        }

        const newItem = new Department({parent, name, notes});

        await newItem.save();

        let currentDepartment;

        if (!parent) {
            currentDepartment = await Department.findOne({name});
        } else {
            currentDepartment = await Department.findOne({name}).populate('parent');
        }

        res.status(201).json({message: "Подразделение сохранено", department: currentDepartment});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put('/departments', async (req, res) => {
    try {
        const {_id, name, notes, parent} = req.body;
        const item = await Department.findById({_id}).populate('parent');

        if (!item) {
            return res.status(400).json({message: `Подразделение с кодом ${_id} не найдено`});
        }

        if (parent) {
            if (name === parent.name) {
                return res.status(400).json({message: "Отдел не может принадлежать сам себе"});
            }
        }

        item.parent = parent;
        item.name = name;
        item.notes = notes;

        await item.save();

        res.status(201).json({message: "Подразделение сохранено", department: item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении  подразделения"})
    }
});

// Удаляет запись
router.delete('/departments/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await Department.deleteOne({_id: id});

        res.status(201).json({message: "Подразделение успешно удалено"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении подразделения с кодом ${id}`})
    }
});

module.exports = router;