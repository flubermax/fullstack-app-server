const Router = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const Advert = require('../models/Advert')

const router = new Router()

router.post('/new', authMiddleware, async (req, res) => {
  try {
    const { name, about, price, image } = req.body
    const advert = new Advert({ name, about, price, image, phone: req.user.phone, user: req.user.id })
    await advert.save()
    return res.json({ advert })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'New advert error' })
  }
})

router.get('/', async (req, res) => {
  try {
    const adverts = await Advert.find()
    // console.log(adverts)
    return res.json(adverts)

  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: "Can not get adverts" })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const advert = await Advert.findById(req.params.id)
    res.json(advert)
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router