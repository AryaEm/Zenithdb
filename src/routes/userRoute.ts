import express from 'express'
import { changeImage, createUser, deleteUser, editUser, getAllUsers, getTotalUser, getUserById } from '../controllers/userCtrl'
import uploadFile from '../middleware/userPicture'
import { verifyAddUser, verifyEditUser } from '../middleware/verifyUser'


const app = express()
app.use(express.json())

app.get('/', getAllUsers )
app.get('/total', getTotalUser)
app.get('/:id', getUserById)
app.post('/', [verifyAddUser], createUser)
app.delete('/:id', deleteUser)
app.put('/:id', [verifyEditUser], editUser)
app.put('/pic/:id', [uploadFile.single("Image")], changeImage)


export default app