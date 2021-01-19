const {Router} = require("express");
const Department = require("../models/Department");
const router = Router();

router.get('/departments', async (req, res) => {
    try {
        const departments = await Department.find({});
        res.json(departments);
    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так, попробуйте снова"})
    }
});

router.post('/departments', async (req, res) => {
    try {
        const {name, notes} = req.body;

        const department = await Department.findOne({name});

        if (department) {
            return res.status(400).json({message: "Такое подразделение уже существует"});
        }

        const newDepartment = new Department({name: name, notes: notes})

        await newDepartment.save();

        const currentDepartment = await Department.findOne({ name });

        res.status(201).json({message: "Подразделение создано", department: currentDepartment});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании подразделения, пожалуйста, попробуйте снова"})
    }
});

router.put('/departments', async (req, res) => {
    try {
        const {name, notes} = req.body.values;
        const {_id} = req.body.editTab;
        const department = await Department.findById({_id});

        if (!department) {
            return res.status(400).json({message: "Такое подразделение не найдено"});
        }

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
        const {name, notes} = req.body;
        const department = await Department.findOne({name});

        if (!department) {
            return res.status(400).json({message: "Такое подразделение не найдено"});
        }

        await department.delete();

        res.status(201).json({message: "Подразделение успешно удалено"});
    } catch (e) {
        res.status(500).json({message: "Ошибка при редактировании подразделения, пожалуйста, попробуйте снова"})
    }
});

module.exports = router;