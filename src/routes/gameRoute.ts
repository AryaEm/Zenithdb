import express from 'express'
import { getAllGames, createGame, editGame, deleteGame, getTotalGames, getMostPurchasedGame, getGameById, getPurchasedGame, getQuickAccess, getGames, getMonthlyGameSalesStat } from '../controllers/gameCtrl';
import { verifyAddGame, verifyeditGame } from '../middleware/verifyGame';
import uploadFile from '../middleware/GamePicture';
import { verifyRole, verifyToken } from '../middleware/authorization';
import { getOwnedGames } from '../controllers/transaksi';

const app = express()
app.use(express.json())

app.get('/', getGames)
app.get('/games', [verifyToken, verifyRole(['Admin', 'Pelanggan'])], getAllGames)
app.get('/total', [verifyToken, verifyRole(['Admin'])], getTotalGames)
app.get('/mostpurchased', getMostPurchasedGame);
app.get('/purchased-game', [verifyToken, verifyRole(['Admin', 'Pelanggan'])], getOwnedGames)
app.get('/quick-access', getQuickAccess)
app.get('/monthly-purchase', [verifyToken, verifyRole(['Admin'])], getMonthlyGameSalesStat)
app.get('/:id', [verifyToken, verifyRole(['Admin', 'Pelanggan'])], getGameById)
app.post('/', [verifyToken, verifyRole(['Admin']), uploadFile.single('gambar'), verifyAddGame], createGame)
app.put('/:id', [verifyToken, verifyRole(['Admin']), uploadFile.single('gambar'), verifyeditGame], editGame)
app.delete('/:id', [verifyToken, verifyRole(['Admin'])], deleteGame)
// app.put('/pic/:id', [verifyToken, verifyRole(['Admin']), uploadFile.single("Image")], changePicture)


export default app