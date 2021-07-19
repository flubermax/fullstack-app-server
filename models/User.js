const { Schema, model, ObjectId } = require('mongoose')

const User = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  avatar: { type: String },
  adverts: [{ type: ObjectId, ref: 'Advert' }],
})

module.exports = model('User', User)