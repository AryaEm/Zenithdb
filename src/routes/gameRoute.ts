import express from 'express'
import { getAllGames, createGame, editGame, deleteGeme, getTotalGames, getGameById } from '../controllers/gameCtrl';
import { verifyAddGame, verifyeditGame } from '../middleware/verifyGame';

const app = express()
app.use(express.json())

app.get('/', getAllGames )
app.post('/', [verifyAddGame], createGame)
app.put('/:id', [verifyeditGame], editGame)
app.delete('/:id', deleteGeme)
app.get('/total', getTotalGames)
app.get('/:id', getGameById)


export default app