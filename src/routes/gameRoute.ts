import express from 'express'
import { getAllGames } from '../controllers/gameCtrl';

const app = express()
app.use(express.json())

app.get('/', getAllGames)

export default app