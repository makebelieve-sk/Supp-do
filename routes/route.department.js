const {Router} = require("express");
const Department = require("../models/Department");
const router = Router();

router.get('/departments/:id', async (req, res) => {
    try {
        const department = await Department.findById({_id: req.params.id}).populate('parent');

        if (!department) {
            return res.status(400).json({message: "Такое подразделение не существует"});
        }

        res.status(201).json({department: department});
    } catch (e) {
        res.status(500).json({message: "Ошибка при открытии записи, пожалуйста, попробуйте снова"})
    }
});

router.get('/departments', async (req, res) => {
    try {
        const departments = await Department.find({}).populate('parent');
        res.json(departments);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении всех записей о подразделениях, пожалуйста, попробуйте снова"})
    }
});

router.post('/departments', async (req, res) => {
    try {
        const {name, notes, parent} = req.body;

        const department = await Department.findOne({name});

        if (department) {
            return res.status(400).json({message: "Такое подразделение уже существует"});
        }

        if (parent) {
            if (name === parent.name) {
                return res.status(400).json({message: "Отдел не может принадлежать сам себе"});
            }
        }

        const newDepartment = new Department({parent, name, notes});

        await newDepartment.save();

        let currentDepartment;

        if (!parent) {
            currentDepartment = await Department.findOne({ name });
        } else {
            currentDepartment = await Department.findOne({name}).populate('parent');
        }

        res.status(201).json({message: "Подразделение создано", department: currentDepartment});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании подразделения, пожалуйста, попробуйте снова"})
    }
});

router.put('/departments', async (req, res) => {
    try {
        const {name, notes, parent} = req.body.values;
        const {_id} = req.body.tabData;
        const department = await Department.findById({_id}).populate('parent');

        if (!department) {
            return res.status(400).json({message: "Такое подразделение не найдено"});
        }

        if (parent) {
            if (name === parent.name) {
                return res.status(400).json({message: "Отдел не может принадлежать сам себе"});
            }
        }

        department.parent = parent;
        department.name = name;
        department.notes = notes;

        await department.save();

        res.status(201).json({message: "Подразделение изменено", department: department});
    } catch (e) {
        res.status(500).json({message: "Ошибка при редактировании подразделения, пожалуйста, попробуйте снова"})
    }
});

router.delete('/departments', async (req, res) => {
    try {
        const {name} = req.body;
        const department = await Department.findOne({name});

        if (!department) {
            return res.status(400).json({message: "Такое подразделение не найдено"});
        }

        await department.delete();

        res.status(201).json({message: "Подразделение успешно удалено"});
    } catch (e) {
        res.status(500).json({message: "Ошибка при удалении подразделения, пожалуйста, попробуйте снова"})
    }
});

module.exports = router;