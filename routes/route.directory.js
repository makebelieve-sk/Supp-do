const {Router} = require("express");
const Profession = require("../models/Profession");
const router = Router();

router.get('/professions', async (req, res) => {
    try {
        const professions = await Profession.find({});
        res.json(professions);
    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так, попробуйте снова"})
    }
});

router.post('/professions', async (req, res) => {
    try {
        const {name, notes} = req.body;
        const profession = await Profession.findOne({name});

        if (profession) {
            return res.status(400).json({message: "Такая профессия уже существует"});
        }

        const newProfession = new Profession({name: name, notes: notes})

        await newProfession.save();

        const currentProfession = await Profession.findOne({ name });

        res.status(201).json({message: "Профессия создана", profession: currentProfession});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании профессии, пожалуйста, попробуйте снова"})
    }
});

// router.post('/department', async (req, res) => {
//
// });
//
// router.post('/person', async (req, res) => {
//
// });

module.exports = router;