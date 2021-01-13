const {Router} = require("express");
const Profession = require("../models/Profession");
const router = Router();

router.get('/professions', async (req, res) => {
    try {
        console.log('req', req);
        const professions = await Profession.find({});
        console.log(professions);
        res.json(professions);
    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так, попробуйте снова"})
    }
});

router.post('/professions', async (req, res) => {
    try {
        console.log('req', req);
        const {name, notes} = req.body;
        const profession = await Profession.findOne({name});

        if (profession) {
            console.log('profession', profession);
            return res.status(400).json({message: "Такая профессия уже существует"});
        }

        const newProfession = new Profession({name: name, password: notes})

        await newProfession.save();

        res.status(201).json({message: "Профессия создана"})
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