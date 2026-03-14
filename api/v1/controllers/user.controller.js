const md5 = require("md5")
const User = require("../models/user.model")
const generateHelper = require("../../../helpers/generate")
const ForgotPassword = require("../models/forgot-password.model")
const sendMailHelper = require("../../../helpers/sendMail")
// [POST]: /api/v1/users/register
module.exports.register = async (req, res) => {
  try {
    req.body.password = md5(req.body.password)
    const existEmail = await User.findOne({
      email: req.body.email,
      deleted: false
    })
    if (existEmail) {
      return res.json({
        code: 400,
        message: "Email này đã tồn tại"
      })
    } else {
      const user = new User(req.body)
      await user.save()
      const token = user.token
      res.cookie("token", token)
      return res.json({
        code: 200,
        message: "Đăng kí thành công",
        token: token
      })
    }
  } catch (error) {
    return res.json({
      code: 400
    })
  }
}

// [POST]: /api/v1/users/login
module.exports.login = async (req, res) => {
  console.log(req.body)
  try {
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({
      email: email,
      deleted: false
    })
    if (!user) {
      return res.json({
        code: 400,
        message: "Không tồn tại email này"
      })
    } 
    if(md5(password) !== user.password ){
      return res.json({
        code: 400,
        message: "Sai mật khẩu"
      })
    }
    res.cookie("token", user.token)
    return res.json({
      code: 200,
      message: "Đăng nhập thành công",
      token: token
    })
  } catch (error) {
    return res.json({
      code: 500,
      message: "Server error",
    })
  }
}

// [POST]: /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email
    const user = await User.findOne({
      email: email,
      deleted: false
    })
    if (!user) {
      return res.json({
        code: 400,
        message: "Không tồn tại email này"
      })
    } 
    const otp = generateHelper.generateRandomNumber(6)
    const timeExpire = 5
    const objectForgotPassword = {
      email: email,
      otp: otp,
      expireAt: Date.now() + timeExpire*60
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()
    // Gửi otp qua mail người dùng
    const subject = "Mã OTP xác minh lấy lại mật khẩu"
    const html = `
    Mã OTP để lấy lại mật khẩu là  <b>${otp}</b>. Sử dụng trong ${timeExpire} phút
    `
    sendMailHelper.sendMail(email,subject, html)
    return res.json({
      code: 200,
        message: "Đã gửi mã OTP qua email"
    })
}