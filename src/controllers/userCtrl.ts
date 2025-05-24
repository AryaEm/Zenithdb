import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL, SECRET } from "../global"
import fs from 'fs'
import md5 from "md5";
import { sign } from "jsonwebtoken"

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const allUsers = await prisma.user.findMany({
            where: { username: { contains: search?.toString() || "" } }
        })
        return res.json({
            status: true,
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
        const { username, password, email, role, nomor_telp, jenis_kelamin } = req.body
        const uuid = uuidv4()

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(200).json({ status: false, message: 'Email already registered' });
        }

        // Berikan default jika tidak ada nomor_telp dan jenis_kelamin
        const nomorTelpValue = nomor_telp ?? ""
        const jenisKelaminValue = jenis_kelamin ?? null

        const newUser = await prisma.user.create({
            data: {
                uuid,
                username,
                password: md5(password),
                email,
                role,
                nomor_telp: nomorTelpValue,
                jenis_kelamin: jenisKelaminValue,
                profil_picture: "", // default kosong, bisa update nanti
            }
        })

        return res.status(200).json({
            status: true,
            data: newUser,
            message: 'New User has created'
        })
    } catch (error) {
        return res.status(200).json({
            status: false,
            message: `error bang ${error}`
        })
    }
}

export const editUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params //Memilih id dari menu yang ingin di edit melalui parameter
        const { username, email, password, role, nomor_telp, jenis_kelamin } = req.body

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } })
        if (!findUser) return res
            .status(200)
            .json({
                status: false,
                message: "User tidak ada"
            })

        const editedGame = await prisma.user.update({
            data: {
                username: username || findUser.username,
                email: email || findUser.email,
                password: password ? md5(password) : findUser.password,
                role: role || findUser.role,
                nomor_telp: nomor_telp || findUser.nomor_telp,
                jenis_kelamin: jenis_kelamin || findUser.jenis_kelamin,
            },
            where: { id: Number(id) }
        })

        return res.json({
            status: true,
            data: editedGame,
            message: 'User sudah diupdate'
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                message: `error lee ${error}`
            })
            .status(400)
    }
}

export const changeImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } })
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

        const updatePicture = await prisma.user.update({
            data: { profil_picture: filename },
            where: { id: Number(id) }
        })
        return res.json({
            status: true,
            data: updatePicture,
            message: 'Foto telah diganti'
        })

    } catch (error) {
        return res.json({
            status: false,
            error: `${error}`
        }).status(400)
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params //Memilih id dari menu yang ingin di hapus melalui parameter

        // Mencari menu berdasarkan id
        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser) {
            return res.status(404).json({
                status: false,
                message: "User tidak ditemukan"
            });
        }

        // Menghapus menu
        await prisma.user.delete({
            where: { id: Number(id) }
        });

        return res.json({
            status: true,
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
        const total = await prisma.user.count();
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
        const user = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!user)
            return res.status(404).json({
                status: false,
                message: "User tidak ditemukan"
            });

        return res.json({
            status: true,
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

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const uuid = uuidv4();

        // Cek apakah email sudah trdaftar
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(200).json({ status: false, message: 'Email already registered' });
        }

        const newUser = await prisma.user.create({
            data: {
                uuid,
                username,
                email,
                password: md5(password),
                nomor_telp: "", 
                jenis_kelamin: "Laki_laki",
                role: 'Pelanggan'
            }
        });

        const playload = JSON.stringify(newUser);
        const token = sign(playload, SECRET || "token");

        return res.status(200).json({
            status: true,
            data: newUser,
            token: token, // ✅ token dikirim langsung, sama kayak login
            message: 'User registered successfully'
        });
    } catch (error) {
        return res.status(200).json({
            status: false,
            message: `Error: ${error}`
        });
    }
};


export const authentication = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const findUSer = await prisma.user.findFirst({
            where: { email, password: md5(password) }
        })

        if (!findUSer)
            return res
                .status(200)
                .json({
                    status: false,
                    logged: false,
                    message: 'email or password is invalid'
                })

        let data = {
            id: findUSer.id,
            username: findUSer.username,
            email: findUSer.email,
            no_telp: findUSer.nomor_telp,
            role: findUSer.role
        }

        let playload = JSON.stringify(data) // MENYIAPKAN DATA YANG AKAN DIJADIKAN TOKEN

        let token = sign(playload, SECRET || "token") //UNTUK MENGGENERATE TOKEN (SIGN)

        return res
            .status(200)
            .json({
                status: true,
                logged: true,
                data: data,
                message: "Login Successfull",
                token
            })

    } catch (error) {
        return res
            .json({
                status: false,
                message: `error ${error}`
            })
            .status(400)
    }
}

