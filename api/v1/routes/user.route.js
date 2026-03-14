  const express = require("express")
  const router = express.Router()
  const controller = require("../controllers/user.controller")
  const validate = require("../validates/user.validate")
  const   authMiddleware = require("../middlewares/auth.middleware")
  router.post("/register", validate.registerPost, controller.register)

  router.post("/login", validate.loginPost, controller.login)

  router.post("/password/forgot", validate.forgotPasswordPost, controller.forgotPassword)

  router.post("/password/otp", validate.otpPasswordPost, controller.otpPassword)

  router.post("/password/reset", validate.resetPasswordPost, controller.resetPassword)

  router.get("/detail", authMiddleware.requireAuth, controller.detail)

  module.exports = router