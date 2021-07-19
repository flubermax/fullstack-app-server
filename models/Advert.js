const { model, Schema, Types } = require('mongoose')


const Advert = new Schema({
  name: { type: String, required: true },
  about: { type: String, default: '' },
  price: { type: String, default: '' },
  image: { type: String, default: '' },
  path: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  user: { type: Types.ObjectId, ref: 'User' },
  phone: { type: String, ref: 'User' }
})

module.exports = model('Advert', Advert)