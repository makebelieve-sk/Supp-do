// Маршруты для раздела "Роли"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");

const User = require("../schemes/User");
const Log = require("../schemes/Log");
const Role = require("../schemes/Role");
const {getUser} = require("./helper");
const {permissions} = require("./helper");

const router = Router();

// Валидация полей раздела "Роли"
const checkMiddleware = [
    check("name", "Поле 'Наименование' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
    check("notes", "Поле 'Описание' не должно превышать 255 символов")
        .isString()
        .isLength({max: 255})
];

/**
 * Функция логирования действий пользователея
 * @param req - объект req запроса
 * @param res - объект res запроса
 * @param action - действие пользователя
 * @param body - удаляемая запись
 * @returns {Promise<*>} - возвращаем промис (сохранение записи в бд)
 */
const logUserActions = async (req, res, action, body = null) => {
    if (!req.cookies) return res.status(500).json({message: "Ошибка чтения файлов cookies"});

    let {name, notes} = req.body;

    if (body) {
        name = body.name;
        notes = body.notes;
    }

    const username = await getUser(req.cookies.token);

    const log = new Log({
        date: Date.now(),
        action,
        username,
        content: `Раздел: Роли, Наименование: ${name}, Примечание: ${notes}`
    });

    await log.save();   // Сохраняем запись в Журнал действий пользователя
}

// Возвращает запись по коду
router.get("/roles/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

        let item, isNewItem = true;

        if (_id === "-1") {
            item = new Role({name: "", notes: "", permissions});    // Создание новой записи
        } else {
            item = await Role.findById({_id});  // Получение существующей записи
            isNewItem = false;

            // Проверка на равенство разрешений записи и исходного массива разрешений
            if (item && item.permissions && item.permissions.length) {
                let keysPermissions = [], keysItemPermissions = [];

                // Создаем массив ключей из исходного массива разрешений
                permissions.forEach(perm => keysPermissions.push(perm.key));

                // Создаем массив ключей из массива разрешений записи
                item.permissions.forEach(perm => keysItemPermissions.push(perm.key));

                // Если массив ключей из исходного массива разрешений не содержит ключ из массива ключей
                // из массива permissions записи, то добавляем разрешение
                keysPermissions.forEach((key, index) => {
                    if (!keysItemPermissions.includes(key)) {
                        const permission = permissions.find(perm => perm.key === key);

                        if (permission) item.permissions.splice(index, 0, permission);
                    }
                });

                // Если массив ключей из массива разрешений записи не содержит ключ из массива ключей
                // из исходного массива permissions, то добавляем разрешение
                keysItemPermissions.forEach(key => {
                    if (!keysPermissions.includes(key)) {
                        const foundPerm = item.permissions.find(permission => permission.key === key);
                        const indexPerm = item.permissions.indexOf(foundPerm);

                        if (foundPerm && indexPerm >= 0) {
                            item.permissions.splice(indexPerm, 1);
                        }
                    }
                });
            }

            // Обновляем данную роль у пользователей
            const usersWithThisRole = await User
                .find()
                .all("roles", [item])
                .populate("roles")
                .populate("person")
                .select("-password");

            if (usersWithThisRole && usersWithThisRole.length) {
                usersWithThisRole.forEach(user => {
                    user.roles.forEach((role, index) => {
                        if (role._id === item._id) {
                            user.roles[index] = item;
                        }
                    });
                });
            }
        }

        if (!item) return res.status(404).json({message: `Запись с кодом ${_id} не существует`});

        res.status(200).json({isNewItem, role: item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}: ${err}`});
    }
});

// Возвращает все записи
router.get("/roles", async (req, res) => {
    try {
        const items = await Role.find({});  // Получаем все записи раздела "Роли"

        res.status(200).json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записей: " + err});
    }
});

// Сохраняет новую запись
router.post("/roles", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({message: "Некоректные данные при создании записи"});

        const {name, notes, permissions} = req.body;    // Получаем объект записи с фронтенда

        let item = await Role.findOne({name});  // Ищем запись в базе данных по наименованию

        // Проверяем на существование записи с указанным именем
        if (item)
            return res.status(400).json({message: `Запись с наименованием ${name} уже существует`});

        item = new Role({name, notes, permissions});    // Создаем новый экземпляр записи

        await item.save();  // Сохраняем запись в базе данных

        await logUserActions(req, res, "Сохранение");   // Логируем действие пользвателя

        res.status(201).json({message: "Запись сохранена", item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/roles", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({message: "Некоректные данные при изменении записи"});

        const {_id, name, notes, permissions} = req.body;   // Получаем объект записи с фронтенда

        const item = await Role.findById({_id});    // Ищем запись в базе данных по уникальному идентификатору

        if (!item) return res.status(400).json({message: `Роль с именем ${name} (${_id}) не найдена`});

        // Ищем все подразделения
        const roles = await Role.find({});

        if (roles && roles.length) {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === name && roles[i]._id.toString() !== _id.toString()) {
                    return res.status(400).json({message: "Роль с таким именем уже существует"});
                }
            }
        }

        item.name = name;
        item.notes = notes;
        item.permissions = permissions;

        await item.save();  // Сохраняем запись в базу данных

        await logUserActions(req, res, "Редактирование");   // Логируем действие пользвателя

        res.status(201).json({message: "Запись сохранена", item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при обновлении записи: " + err});
    }
});

// Удаляет запись
router.delete("/roles/:id", async (req, res) => {
    const _id = req.params.id;  // Получаем _id записи

    try {
        const item = await Role.findById({_id});  // Ищем текущую запись

        await logUserActions(req, res, "Удаление", item);   // Логируем действие пользвателя

        if (item) {
            await Role.deleteOne({_id});    // Удаление записи из базы данных по id записи
            return res.status(200).json({message: "Запись успешно удалена"});
        } else {
            return res.status(404).json({message: "Данная запись уже была удалена"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}: ${err}`});
    }
});

module.exports = router;