import express from 'express'
import cors from 'cors'
import gameRoute from './routes/gameRoute'

const PORT: number = 3000
const app = express()
app.use(cors())

app.use('/game', gameRoute)

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})