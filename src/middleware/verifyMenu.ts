import { NextFunction, Request, Response } from "express";
import Joi, { required } from 'joi'

//Membuat schema sata menambah data menu
const addDataSchema = Joi.object({
    name: Joi.string().required(),
    harga: Joi.number().min(0).required(),
    developer: Joi.string().required(),
    deskripsi: Joi.string().required(),
    genre: Joi.string().required(),
    download_link: Joi.string().required(),
    gambar: Joi.allow().optional(),
    video: Joi.allow().optional(),
})

export const verifyAddGame = (req: Request, res: Response, next: NextFunction) => {
    //memvalidasi request body dan mengambil error 
    const { error } = addDataSchema.validate(req.body, { abortEarly: false })

    if (error) {
        //response jika ada error
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}





const editDataSchema = Joi.object({
    name: Joi.string().optional(),
    harga: Joi.number().min(0).optional(),
    developer: Joi.string().optional(),
    deskripsi: Joi.string().optional(),
    genre: Joi.string().optional(),
    download_link: Joi.string().optional(),
    gambar: Joi.allow().optional(),
    video: Joi.allow().optional(),
})

export const verifyeditGame = (req: Request, res: Response, next: NextFunction) => {
    //memvalidasi request body dan mengambil error 
    const { error } = editDataSchema.validate(req.body, { abortEarly: false })

    if (error) {
        //response jika ada error
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}