const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const fileUpload = require('express-fileupload')
const authRouter = require('./routes/auth.routes')
const advertRouter = require('./routes/advert.routes')
const corsMiddleware = require('./middleware/cors.middleware')

const app = express()
const PORT = config.get('serverPort')

app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(express.json({ extended: true }))
app.use(express.static('static'))
app.use('/api/auth', authRouter)
app.use('/api/adverts', advertRouter)

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const start = async () => {
  try {
    await mongoose.connect(config.get('dbUrl'), {
      useUnifiedTopology: true
    })

    app.listen(PORT, () => {
      console.log('Server started  on port', PORT)
    })
  } catch (e) {
    console.log(e)
  }
}

start()