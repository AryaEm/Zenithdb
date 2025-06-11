import { NextFunction, Request, Response } from "express"
import Joi from "joi"

const orderListSchema = Joi.object({
    gameId: Joi.number().required(),
    quantity: Joi.number().default(1)
})

const addDataSchema = Joi.object({
    customer: Joi.string().optional(),
    metode_pembayaran: Joi.string().valid("GOPAY", "QRIS", "DANA").required(),
    status: Joi.string().valid("Belum_Lunas", "Lunas").required(),
    idUser: Joi.number().optional(),
    detail_transaksi: Joi.array().items(orderListSchema).min(1).required(),
    user: Joi.optional()
})

export const verifyAddOrder = (req: Request, res: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(req.body, { abortEarly: false })
    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

const editDataSchema = Joi.object({
    status: Joi.string().valid("Belum_Lunas", "Lunas").required(),
    user: Joi.optional()
})

export const verifyEditStatus = (req: Request, res: Response, next: NextFunction) => {
    const { error } = editDataSchema.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}
