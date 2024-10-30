import { Request, Response } from "express"; //untuk mengimport express
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../global"
import fs  from 'fs'

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllGames = async (req: Request, res: Response) => {
    try {
        const { search } = req.query //input
        const allGames = await prisma.game.findMany({
            where: { name: { contains: search?.toString() || "" } },
            select: {
                id: true,
                uuid: true,
                name: true,
                gambar: true,
                video: true,
                developer: true,
                harga: true,
                deskripsi: true,
                genre: true,
                tahun_rilis: true,
                createdAt: true,
                updateAt: true,
            }
        })
        return res.json({ //output                
            status: 'gacorr',
            data: allGames,
            massege: 'Berhasil menampilkan game'
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

export const createGame = async (req: Request, res: Response) => {
    try {
        //mengambil data
        const { name, developer, harga, genre, deskripsi, download_link } = req.body
        const uuid = uuidv4()

        //proses save data
        const newGame = await prisma.game.create({
            data: { uuid, name, developer, harga: Number(harga), genre, deskripsi, download_link }
        })

        return res.json({
            status: 'Alhamdulillah ga error',
            data: newGame,
            message: 'New Game has created'
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


export const editGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params //Memilih id dari menu yang ingin di edit melalui parameter
        const { name, developer, harga, genre, deskripsi, download_link } = req.body

        const findGame = await prisma.game.findFirst({ where: { id: Number(id) } })
        if (!findGame) return res
            .status(200)
            .json({
                status: false,
                message: "Menu tidak ada"
            })

        const editedGame = await prisma.game.update({
            data: {
                name: name || findGame.name,
                developer: developer || findGame.developer,
                harga: harga ? Number(harga) : findGame.harga,
                genre: genre || findGame.genre,
                deskripsi: deskripsi || findGame.deskripsi,
                download_link: download_link || findGame.download_link
            },
            where: { id: Number(id) }
        })

        return res.json({
            status: 'alhamdulillah ga error',
            data: editedGame,
            message: 'Game sudah diupdate'
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


export const changePicture = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const findGame = await prisma.game.findFirst({ where: { id: Number(id) } })
        if (!findGame) return res
            .status(200)
            .json({
                message: 'Game tidak ada',
            })

        // DEFAULT VALUE FILENAME OF SAVED DATA
        let filename = findGame.gambar
        if (req.file) {
            filename = req.file.filename // UPDATE NAMA FILE SESUAI GAMBAR YANG DIUPLOAD

            let path = `${BASE_URL}/../public/menuPicture/${findGame.gambar}` // CEK FOTO LAMA PADA FOLDER
            let exist = fs.existsSync(path)

            if (exist && findGame.gambar !== ``) fs.unlinkSync(path) //MENGHAPUS FOTO LAMA JIKA ADA
        }

        const updatePicture = await prisma.game.update({
            data: { gambar: filename },
            where: { id: Number(id) }
        })
        return res.json({
            status: 'tru',
            data: updatePicture,
            message: 'Picture telah diganti'
        })

    } catch (error) {
        return res.json({
            status: 'fals',
            error: `${error}`
        }).status(400)
    }
}

export const deleteGeme = async (req: Request, res: Response) => {
    try {
        const { id } = req.params //Memilih id dari menu yang ingin di hapus melalui parameter

        // Mencari menu berdasarkan id
        const findGame = await prisma.game.findFirst({ where: { id: Number(id) } });
        if (!findGame) {
            return res.status(404).json({
                status: 'error lee',
                message: "Game tidak ditemukan"
            });
        }

        // Menghapus menu
        await prisma.game.delete({
            where: { id: Number(id) }
        });

        return res.json({
            status: 'Alhamdulillah ga error',
            message: 'Game telah dihapus'
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: `Error saat menghapus Game ${error}`
            })
            .status(400);
    }
}

export const getTotalGames = async (req: Request, res: Response) => {
    try {
        const total = await prisma.game.count();
        return res.json({
            total: `Gamenya ada ${total} kakk`,
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: `duh error ${error}`
            })
            .status(400);
    }
}

export const getGameById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const menu = await prisma.game.findFirst({ 
            where: { id: Number(id) },
            select: {
                id: true,
                uuid: true,
                name: true,
                gambar: true,
                video: true,
                developer: true,
                harga: true,
                deskripsi: true,
                genre: true,
                tahun_rilis: true,
                createdAt: true,
                updateAt: true,
            }
        });
        
        if (!menu)
            return res.status(404).json({
                status: false,
                message: "Game tidak ditemukan"
            });

        return res.json({
            status: 'Nih Game',
            data: menu,
            message: 'Detail Game berhasil diambil'
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

export const getMostPurchasedGames = async (req: Request, res: Response) => {
    try {
        const { limit } = req.query; // Input untuk membatasi jumlah game yang ditampilkan

        const mostPurchasedGames = await prisma.game.findMany({
            select: {
                id: true,
                uuid: true,
                name: true,
                gambar: true,
                developer: true,
                harga: true,
                deskripsi: true,
                genre: true,
                tahun_rilis: true,
                createdAt: true,
                updateAt: true,
                _count: {
                    select: {
                        Detail_Transaksi: true, // Menghitung jumlah transaksi untuk setiap game
                    },
                },
            },
            orderBy: {
                Detail_Transaksi: { _count: "desc" }, // Mengurutkan berdasarkan jumlah transaksi
            },
            take: Number(limit) || 10, // Mengambil 10 game teratas 
        });

        return res.status(200).json({
            status: 'success',
            data: mostPurchasedGames,
            message: 'Berhasil menampilkan game yang paling banyak dibeli',
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: `Error bang ${error}`,
        });
    }
};
