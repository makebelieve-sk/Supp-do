// Маршруты для авторизации
const {Router} = require("express");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");

const User = require("../schemes/User");

const router = Router();



module.exports = router;