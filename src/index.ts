import express from 'express'
import cors from 'cors'
import gameRoute from './routes/gameRoute'
import userRoute from './routes/userRoute'
import transaksi from './routes/transaksiRouete'

const PORT: number = 3000
const app = express()
app.use(cors())

app.use('/game', gameRoute)
app.use('/user', userRoute)
app.use('/transaksi', transaksi)

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})