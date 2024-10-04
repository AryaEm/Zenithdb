import express from 'express'
import { getAllGames, createGame, editGame, deleteGeme, getTotalGames, getGameById, changePicture } from '../controllers/gameCtrl';
import { verifyAddGame, verifyeditGame } from '../middleware/verifyGame';
import uploadFile from '../middleware/GamePicture';

const app = express()
app.use(express.json())

app.get('/', getAllGames )
app.get('/total', getTotalGames)
app.get('/:id', getGameById)
app.post('/', [verifyAddGame], createGame)
app.delete('/:id', deleteGeme)
app.put('/:id', [verifyeditGame], editGame)
app.put('/pic/:id', [uploadFile.single("Image")], changePicture)


export default app