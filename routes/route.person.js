const {Router} = require("express");
const Person = require("../models/Person");
const router = Router();

router.get('/person', async (req, res) => {
    try {
        const people = await Person.find({}).populate('department').populate('profession');
        res.json(people);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении всех записей о сотрудниках, пожалуйста, попробуйте снова"})
    }
});

router.post('/person', async (req, res) => {
    try {
        const {name, notes, department, profession, tabNumber} = req.body;

        const person = await Person.findOne({name});

        if (person) {
            return res.status(400).json({message: "Такая запись о сотруднике уже существует"});
        }

        const newPerson = new Person({tabNumber, name, department, profession, notes});

        await newPerson.save();

        const currentPerson = await Person.findOne({name}).populate('department').populate('profession');

        if (!department || !profession) {
            return res.status(400).json({message: "Заполните обязательные поля"});
        }

        res.status(201).json({message: "Запись о сотруднике создана", person: currentPerson});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи о сотруднике, пожалуйста, попробуйте снова"})
    }
});

router.put('/person', async (req, res) => {
    try {
        const {name, notes, department, profession, tabNumber} = req.body.values;
        const {_id} = req.body.editTab;
        const person = await Person.findById({_id}).populate('department').populate('profession');

        if (!person) {
            return res.status(400).json({message: "Такая запись не найдена"});
        }

        person.tabNumber = tabNumber;
        person.name = name;
        person.department = department;
        person.profession = profession;
        person.notes = notes;

        await person.save();

        res.status(201).json({message: "Запись о сотруднике успешно изменена", person: person});
    } catch (e) {
        res.status(500).json({message: "Ошибка при редактировании записи о сотруднике, пожалуйста, попробуйте снова"})
    }
});

router.delete('/person', async (req, res) => {
    try {
        const {name} = req.body;
        const person = await Person.findOne({name});

        if (!person) {
            return res.status(400).json({message: "Такая запись не найдена"});
        }

        await person.delete();

        res.status(201).json({message: "Запись о сотруднике успешно удалена"});
    } catch (e) {
        res.status(500).json({message: "Ошибка при удалении записи о сотруднике, пожалуйста, попробуйте снова"})
    }
});

module.exports = router;