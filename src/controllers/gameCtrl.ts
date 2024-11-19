import { Request, Response } from "express"; //untuk mengimport express
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../global"
import fs from 'fs'

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
                total_dibeli: true,
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

        let filename = ""
        if (req.file) filename = req.file.filename

        //proses save data
        const newGame = await prisma.game.create({
            data: { uuid, name, developer, harga: Number(harga), genre, deskripsi, download_link, gambar: filename }
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

        let filename = findGame.gambar
        if (req.file) {
            filename = req.file.filename // UPDATE NAMA FILE SESUAI GAMBAR YANG DIUPLOAD

            let path = `${BASE_URL}/../public/gamePicture/${findGame.gambar}` // CEK FOTO LAMA PADA FOLDER
            let exist = fs.existsSync(path)

            if (exist && findGame.gambar !== ``) fs.unlinkSync(path) //MENGHAPUS FOTO LAMA JIKA ADA
        }

        const editedGame = await prisma.game.update({
            data: {
                name: name || findGame.name,
                developer: developer || findGame.developer,
                harga: harga ? Number(harga) : findGame.harga,
                genre: genre || findGame.genre,
                deskripsi: deskripsi || findGame.deskripsi,
                download_link: download_link || findGame.download_link,
                gambar: filename
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


// export const changePicture = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params

//         const findGame = await prisma.game.findFirst({ where: { id: Number(id) } })
//         if (!findGame) return res
//             .status(200)
//             .json({
//                 message: 'Game tidak ada',
//             })

//         // DEFAULT VALUE FILENAME OF SAVED DATA
//         let filename = findGame.gambar
//         if (req.file) {
//             filename = req.file.filename // UPDATE NAMA FILE SESUAI GAMBAR YANG DIUPLOAD

//             let path = `${BASE_URL}/../public/menuPicture/${findGame.gambar}` // CEK FOTO LAMA PADA FOLDER
//             let exist = fs.existsSync(path)

//             if (exist && findGame.gambar !== ``) fs.unlinkSync(path) //MENGHAPUS FOTO LAMA JIKA ADA
//         }

//         const updatePicture = await prisma.game.update({
//             data: { gambar: filename },
//             where: { id: Number(id) }
//         })
//         return res.json({
//             status: 'tru',
//             data: updatePicture,
//             message: 'Picture telah diganti'
//         })

//     } catch (error) {
//         return res.json({
//             status: 'fals',
//             error: `${error}`
//         }).status(400)
//     }
// }

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
        // Ambil id dari parameter dan konversi ke angka
        const id = parseInt(req.params.id);

        // Validasi apakah id adalah angka yang valid
        if (isNaN(id)) {
            return res.status(400).json({
                status: false,
                message: "Invalid ID format"
            });
        }

        // Cari game berdasarkan id
        const game = await prisma.game.findFirst({
            where: { id }, // Prisma mengenali `id` sebagai integer sekarang
            select: {
                id: true,
                uuid: true,
                name: true,
                gambar: true,
                video: true,
                developer: true,
                harga: true,
                deskripsi: true,
                total_dibeli: true,
                genre: true,
                tahun_rilis: true,
                createdAt: true,
                updateAt: true
            }
        });

        // Jika game tidak ditemukan, kirim response dengan status 404
        if (!game) {
            return res.status(404).json({
                status: false,
                message: `Game with id ${id} not found`
            });
        }

        // Jika game ditemukan, kirim response dengan data game
        return res.status(200).json({
            status: true,
            data: game,
            message: `Game with id ${id} retrieved successfully`
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error retrieving game: ${error}`
        });
    }
};

export const getMostPurchasedGame = async (req: Request, res: Response) => {
    try {
        // Ambil game yang diurutkan berdasarkan total_dibeli (desc), dan limit hasilnya sesuai kebutuhan
        const mostPurchasedGames = await prisma.game.findMany({
            orderBy: {
                total_dibeli: 'desc' // Urutkan berdasarkan total_dibeli tertinggi
            },
            take: 10 // Ambil 10 game teratas atau sesuai kebutuhan
        });

        // Cek apakah ada game yang ditemukan
        if (mostPurchasedGames.length === 0) {
            return res.status(200).json({
                status: true,
                message: 'No games found',
                data: []
            });
        }

        // Return response sukses dengan data game yang diurutkan
        return res.status(200).json({
            status: true,
            message: 'Most purchased games retrieved successfully',
            data: mostPurchasedGames
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error retrieving most purchased games: ${error}`
        });
    }
};

export const getPurchasedGame = async (req: Request, res: Response) => {
    try {
        const userPurchases = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                Transaksi: {
                    select: {
                        id: true,
                        Detail_Transaksi: {
                            select: {
                                game: {
                                    select: {
                                        id: true,
                                        name: true,
                                        developer: true,
                                        harga: true,
                                        genre: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        const result = userPurchases.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            purchasedGames: user.Transaksi.flatMap(transaksi =>
                transaksi.Detail_Transaksi.map(detail => detail.game)
            )
        }))

        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: `${error}`
        })
    }
}