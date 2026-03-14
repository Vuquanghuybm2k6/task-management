const express = require("express")
const router = express.Router()
const controller = require("../controllers/user.controller")
const validate = require("../validates/user.validate")
router.post("/register", validate.registerPost, controller.register)

module.exports = router