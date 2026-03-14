const express = require("express")
const router = express.Router()
const controller = require("../controllers/user.controller")
const validate = require("../validates/user.validate")

router.post("/register", validate.registerPost, controller.register)

router.post("/login", validate.loginPost, controller.login)

module.exports = router