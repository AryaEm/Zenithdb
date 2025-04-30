import { NextFunction, Request, Response } from "express";
import Joi from 'joi'

const authschema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).alphanum().required()
})

export const verifyAuthtentication = (req: Request, res: Response, next: NextFunction) => {
    const { error } = authschema.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(200).json({
            status: false,
            message: error.details.map((it) => it.message).join()
        })
    }
    return next()
}