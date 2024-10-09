import { Request, Response } from "express"; //untuk mengimport express
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL, SECRET } from "../global"
import fs from 'fs'
import md5 from "md5";
import { sign } from "jsonwebtoken"

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { search } = req.query //input
        const allUsers = await prisma.pelanggan.findMany({
            where: { username: { contains: search?.toString() || "" } }    // Main
        })
        return res.json({ //output                
            status: 'gacorr',
            data: allUsers,
            massege: 'Berhasil menampilkan semua user'
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                message: `Error bang ${error}`
            })
            .status(400)
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        //mengambil data
        const { username, password, email, nomor_telp, jenis_kelamin } = req.body
        const uuid = uuidv4()

        //proses save data
        const newUser = await prisma.pelanggan.create({
            data: { uuid, username, password: md5(password), email, nomor_telp, jenis_kelamin }
        })

        return res.json({
            status: 'Alhamdulillah ga error',
            data: newUser,
            message: 'New User has created'
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                message: `error bang ${error}`
            })
            .status(400)
    }
}


export const editUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params //Memilih id dari menu yang ingin di edit melalui parameter
        const { username, email, password, nomor_telp, jenis_kelamin } = req.body

        const findUser = await prisma.pelanggan.findFirst({ where: { id: Number(id) } })
        if (!findUser) return res
            .status(200)
            .json({
                status: false,
                message: "User tidak ada"
            })

        const editedGame = await prisma.pelanggan.update({
            data: {
                username: username || findUser.username,
                email: email || findUser.email,
                password: password ? md5(password) : findUser.password,
                nomor_telp: nomor_telp || findUser.nomor_telp,
                jenis_kelamin: jenis_kelamin || findUser.jenis_kelamin,
            },
            where: { id: Number(id) }
        })

        return res.json({
            status: 'alhamdulillah ga error',
            data: editedGame,
            message: 'User sudah diupdate'
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: 'yek error',
                message: `error lee ${error}`
            })
            .status(400)
    }
}


export const changeImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const findUser = await prisma.pelanggan.findFirst({ where: { id: Number(id) } })
        if (!findUser) return res
            .status(200)
            .json({
                message: 'User tidak ada',
            })

        // DEFAULT VALUE FILENAME OF SAVED DATA
        let filename = findUser.profil_picture
        if (req.file) {
            filename = req.file.filename // UPDATE NAMA FILE SESUAI GAMBAR YANG DIUPLOAD

            let path = `${BASE_URL}/../public/userPicture/${findUser.profil_picture}` // CEK FOTO LAMA PADA FOLDER
            let exist = fs.existsSync(path)

            if (exist && findUser.profil_picture !== ``) fs.unlinkSync(path) //MENGHAPUS FOTO LAMA JIKA ADA
        }

        const updatePicture = await prisma.pelanggan.update({
            data: { profil_picture: filename },
            where: { id: Number(id) }
        })
        return res.json({
            status: 'tru',
            data: updatePicture,
            message: 'Foto telah diganti'
        })

    } catch (error) {
        return res.json({
            status: 'fals',
            error: `${error}`
        }).status(400)
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params //Memilih id dari menu yang ingin di hapus melalui parameter

        // Mencari menu berdasarkan id
        const findUser = await prisma.pelanggan.findFirst({ where: { id: Number(id) } });
        if (!findUser) {
            return res.status(404).json({
                status: 'error lee',
                message: "User tidak ditemukan"
            });
        }

        // Menghapus menu
        await prisma.pelanggan.delete({
            where: { id: Number(id) }
        });

        return res.json({
            status: 'Alhamdulillah ga error',
            message: 'User telah dihapus'
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: `Error saat menghapus User ${error}`
            })
            .status(400);
    }
}

export const getTotalUser = async (req: Request, res: Response) => {
    try {
        const total = await prisma.pelanggan.count();
        return res.json({
            'Jumlah User': `${total}`,
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: `error leee ${error}`
            })
            .status(400);
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.pelanggan.findFirst({ where: { id: Number(id) } });
        if (!user)
            return res.status(404).json({
                status: false,
                message: "User tidak ditemukan"
            });

        return res.json({
            status: 'Nih',
            data: user,
            message: 'Detail User berhasil diambil'
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: `Error: ${error}`
            })
            .status(400);
    }
}



export const authentication = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const findUSer = await prisma.pelanggan.findFirst({
            where: { email, password: md5(password) }
        })

        if (!findUSer)
            return res
                .status(200)
                .json({
                    status: 'gagal',
                    logged: false,
                    message: 'email or password is invalid'
                })

        let data = {
            id: findUSer.id,
            username: findUSer.username,
            email: findUSer.email,
            no_telp: findUSer.nomor_telp
        }

        let playload = JSON.stringify(data) // MENYIAPKAN DATA YANG AKAN DIJADIKAN TOKEN

        let token = sign(playload, SECRET || "token") //UNTUK MENGGENERATE TOKEN (SIGN)

        return res
            .status(200)
            .json({
                status: 'tru',
                logged: 'tru',
                message: "Login Succes",
                token
            })

    } catch (error) {
        return res
            .json({
                status: 'fals',
                message: `error ${error}`
            })
            .status(400)
    }
}

