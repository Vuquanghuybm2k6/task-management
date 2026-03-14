const md5 = require("md5")
const User = require("../models/user.model")

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