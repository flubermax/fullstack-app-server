const Router = require('express')
const config = require('config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const authMiddleware = require('../middleware/auth.middleware')

const router = new Router()

router.post('/registration', [
  check('email', 'Uncorrect email').isEmail(),
  check('phone', 'Phone is required').isLength({ min: 11 }),
  check('password', 'Password must be longer than 3 and shorter than 12').isLength({ min: 3, max: 12 })
], async (req, res) => {
  try {
    console.log(req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Uncorrect request', errors })
    }
    const { email, phone, password } = req.body
    const candidate = await User.findOne({ email })

    if (candidate) {
      return res.status(400).json({ message: `User with email ${email} already exist` })
    }

    const hashPassword = await bcrypt.hash(password, 8)
    const user = new User({ email, phone, password: hashPassword })
    await user.save()
    // await advertService.createDir(new Advert({ user: user.id, name: '' }))
    return res.json({ message: "User was created" })
  } catch (e) {
    console.log(e)
    res.send({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const isPassValid = bcrypt.compareSync(password, user.password)
    if (!isPassValid) {
      return res.status(400).json({ message: 'Invalid password' })
    }
    const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' })
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
      }
    })
  } catch (e) {
    console.log(e)
    res.send({ message: 'Server error' })
  }
})

router.get('/auth', authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.id })
      const token = jwt.sign({ id: user.id }, config.get("secretKey"), { expiresIn: "1h" })
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          avatar: user.avatar
        }
      })
    } catch (e) {
      console.log(e)
      res.send({ message: "Server error" })
    }
  })

module.exports = router