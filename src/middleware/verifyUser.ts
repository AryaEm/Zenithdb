import { NextFunction, Request, Response } from "express";
import Joi from 'joi'

//Membuat schema sata menambah data menu
const addDataUser = Joi.object({
    username        : Joi.string().required(),
    email           : Joi.string().email().required(),
    password        : Joi.string().min(8).required(),
    nomor_telp      : Joi.string().required(),
    jenis_kelamin   : Joi.string().valid('Laki_laki', 'Perempuan').required(),
    profile_picture : Joi.allow().optional
})

const editDataUser = Joi.object({
    username        : Joi.string().optional(),
    email           : Joi.string().email().optional(),
    password        : Joi.string().min(8).optional(),
    nomor_telp      : Joi.string().optional(),
    jenis_kelamin   : Joi.string().valid('Laki_laki', 'Perempuan').optional(),
    profile_picture : Joi.allow().optional
})

export const verifyAddUser = (req: Request, res: Response, next: NextFunction) => {
    //memvalidasi request body dan mengambil error 
    const { error } = addDataUser.validate(req.body, { abortEarly: false })

    if (error) {
        //response jika ada error
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditUser = (req: Request, res: Response, next: NextFunction) => {
    //memvalidasi request body dan mengambil error 
    const { error } = editDataUser.validate(req.body, { abortEarly: false })

    if (error) {
        //response jika ada error
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}