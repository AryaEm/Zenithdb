import express from 'express'
import { authentication, changeImage, createUser, deleteUser, editUser, getAllUsers, getTotalUser, getUserById } from '../controllers/userCtrl'
import uploadFile from '../middleware/userPicture'
import { verifyAddUser, verifyEditUser } from '../middleware/verifyUser'
import { verifyAuthtentication } from '../middleware/userValidation'


const app = express()
app.use(express.json())

app.get('/', getAllUsers )
app.get('/total', getTotalUser)
app.get('/:id', getUserById)
app.put('/:id', [verifyEditUser], editUser)
app.put('/pic/:id', [uploadFile.single("Image")], changeImage)
app.post('/', [verifyAddUser], createUser)
app.post('/login', [verifyAuthtentication], authentication)
app.delete('/:id', deleteUser)


export default app