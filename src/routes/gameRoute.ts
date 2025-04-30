import express from 'express'
import { getAllGames, createGame, editGame, deleteGeme, getTotalGames, getMostPurchasedGame, getGameById, getPurchasedGame, getQuickAccess } from '../controllers/gameCtrl';
import { verifyAddGame, verifyeditGame } from '../middleware/verifyGame';
import uploadFile from '../middleware/GamePicture';
import { verifyRole, verifyToken } from '../middleware/authorization';

const app = express()
app.use(express.json())

app.get('/', getAllGames )
app.get('/total', [verifyToken, verifyRole(['Admin'])], getTotalGames)
app.get('/mostpurchased', getMostPurchasedGame);
app.get('/purchased-game', [verifyToken, verifyRole(['Admin', 'Pelanggan'])], getPurchasedGame)
app.get('/quick-access', getQuickAccess)
app.get('/:id', [verifyToken, verifyRole(['Admin', 'Pelanggan'])], getGameById)
app.post('/', [verifyToken, verifyRole(['Admin']), uploadFile.single('picture'), verifyAddGame], createGame)
app.put('/:id', [verifyToken, verifyRole(['Admin']), uploadFile.single('picture'), verifyeditGame], editGame)
app.delete('/:id', [verifyToken, verifyRole(['Admin'])], deleteGeme)
// app.put('/pic/:id', [verifyToken, verifyRole(['Admin']), uploadFile.single("Image")], changePicture)


export default app