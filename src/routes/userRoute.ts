import express from 'express'
import { authentication, changeImage, createUser, deleteUser, editUser, getAllUsers, getTotalUser, getUserById, registerUser } from '../controllers/userCtrl'
import uploadFile from '../middleware/userPicture'
import { verifyAddUser, verifyEditUser, verifyRegisterUser } from '../middleware/verifyUser'
import { verifyAuthtentication } from '../middleware/userValidation'
import { verifyRole, verifyToken } from '../middleware/authorization'


const app = express()
app.use(express.json())

//Login & Register
app.post('/login', [verifyAuthtentication], authentication)
app.post('/register', [verifyRegisterUser], registerUser)

app.get('/', [verifyToken, verifyRole(["Admin"])], getAllUsers)
app.get('/total', [verifyToken, verifyRole(["Admin"])], getTotalUser)
app.get('/:id', [verifyToken, verifyRole(["Admin"])], getUserById)
app.post('/', [verifyAddUser, verifyToken, verifyRole(["Admin"])], createUser)
app.put('/:id', [verifyToken, verifyRole(["Admin"]), verifyEditUser], editUser)
app.put('/pic/:id', [verifyToken, verifyRole(["Admin"]), uploadFile.single("Image")], changeImage)
app.delete('/:id', [verifyToken, verifyRole(["Admin"])], deleteUser)


export default app