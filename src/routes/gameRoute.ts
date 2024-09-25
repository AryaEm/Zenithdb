import express from 'express'
import { getAllGames, createGame, editGame } from '../controllers/gameCtrl';
import { verifyAddGame, verifyeditGame } from '../middleware/verifyMenu';

const app = express()
app.use(express.json())

app.get('/', getAllGames )
app.post('/', [verifyAddGame], createGame)
app.put('/:id', [verifyeditGame], editGame)


export default app