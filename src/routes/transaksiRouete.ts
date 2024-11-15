import express from "express"
import { getAllOrders, createOrder, updateStatusOrder, deleteOrder } from "../controllers/transaksi"
import { verifyAddOrder, verifyEditStatus } from "../middleware/transactionValidation"
import { verifyRole, verifyToken } from "../middleware/authorization"


const app = express()
app.use(express.json())
app.get(`/`, [verifyToken, verifyRole(["Admin","Pelanggan"])], getAllOrders)
app.post(`/`, [verifyToken, verifyRole(["Admin", "Pelanggan"]), verifyAddOrder], createOrder)
app.put(`/:id`, [verifyToken, verifyRole(["Admin"]), verifyEditStatus], updateStatusOrder)
app.delete(`/:id`, [verifyToken, verifyRole(["Admin"])], deleteOrder)


export default app