import express from 'express'
import cors from 'cors'
import authRouter from './routes/Auth.js'
import noteRouter from './routes/note.js'
import connectToMongoDB from './mongo/db.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/note', noteRouter)
app.listen(5000, () => {
    connectToMongoDB()
    console.log("Server is Running")
})