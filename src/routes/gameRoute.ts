import express from 'express'
import { getAllGames, createGame, editGame, deleteGeme, getTotalGames, getGameById, changePicture, getMostPurchasedGames } from '../controllers/gameCtrl';
import { verifyAddGame, verifyeditGame } from '../middleware/verifyGame';
import uploadFile from '../middleware/GamePicture';
import { verifyRole, verifyToken } from '../middleware/authorization';

const app = express()
app.use(express.json())

app.get('/', [verifyToken, verifyRole(['Admin', 'Pelanggan'])], getAllGames )
app.get('/total', [verifyToken, verifyRole(['Admin'])], getTotalGames)
app.get('/:id', [verifyToken, verifyRole(['Admin', 'Pelanggan'])], getGameById)
app.get('/mostpurchased', [verifyToken, verifyRole(['Admin'])], getMostPurchasedGames);
app.post('/', [verifyToken, verifyRole(['Admin']), verifyAddGame], createGame)
app.delete('/:id', [verifyToken, verifyRole(['Admin'])], deleteGeme)
app.put('/:id', [verifyToken, verifyRole(['Admin']), verifyeditGame], editGame)
app.put('/pic/:id', [verifyToken, verifyRole(['Admin']), uploadFile.single("Image")], changePicture)


export default app