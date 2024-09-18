import express from 'express'
import cors from 'cors'
import gameRoute from './routes/gameRoute'

const PORT: number = 8000
const app = express()
app.use(cors())

app.use('/menu', gameRoute)

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})