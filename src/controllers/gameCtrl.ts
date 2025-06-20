import { Request, Response } from "express"; //untuk mengimport express
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../global"
import fs from 'fs'

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getGames = async (req: Request, res: Response) => {
    try {
        const { search, latest } = req.query;

        const games = await prisma.game.findMany({
            where: search ? {
                name: {
                    contains: search.toString()
                }
            } : undefined,
            orderBy: latest === 'true' ? { createdAt: 'desc' } : undefined,
            take: latest === 'true' ? 3 : undefined,
            include: {
                _count: {
                    select: {
                        Detail_Transaksi: true
                    }
                }
            }
        });

        const formattedGames = games.map(game => ({
            ...game,
            total_dibeli: game._count.Detail_Transaksi
        }));

        return res.status(200).json({
            status: true,
            data: formattedGames,
            message: 'Berhasil menampilkan game'
        });
    } catch (error: any) {
        return res.status(400).json({
            status: false,
            message: `Error bang ${error.message}`
        });
    }
};





export const getAllGames = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        console.log("USER: ", user);

        // Handle jika user tidak ditemukan
        if (!user || !user.id) {
            return res.status(401).json({
                status: false,
                message: "User not authenticated"
            });
        }

        // Ambil semua transaksi yang sudah lunas milik user saat ini
        const userTransactions = await prisma.transaksi.findMany({
            where: {
                userId: Number(user.id),
                status: "Lunas"
            },
            include: {
                Detail_Transaksi: {
                    include: {
                        game: true
                    }
                }
            }
        });

        const ownedGameIds = userTransactions.flatMap((transaction) =>
            transaction.Detail_Transaksi.map((detail) => detail.idGame)
        );

        console.log("Owned Game IDs: ", ownedGameIds);

        const allGames = await prisma.game.findMany();

        console.log("All Games: ", allGames.map(g => g.id));

        const gamesWithOwnership = allGames.map(({ Owned, ...game }) => ({
            ...game,
            isOwned: ownedGameIds.includes(game.id)
        }));

        return res.status(200).json({
            status: true,
            data: gamesWithOwnership
        });

    } catch (error) {
        console.error("Error fetching games:", error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan saat mengambil data game."
        });
    }
};




export const createGame = async (req: Request, res: Response) => {
    try {
        //mengambil data
        // console.log('File:', req.file); // debug apakah file berhasil terupload

        const { name, developer, harga, genre, deskripsi, download_link } = req.body
        const uuid = uuidv4()

        let filename = ""
        if (req.file) filename = req.file.filename

        //proses save data
        const newGame = await prisma.game.create({
            data: { uuid, name, developer, harga: Number(harga), genre, deskripsi, download_link, gambar: filename }
        })

        return res.status(200).json({
            status: true,
            data: newGame,
            message: 'New Game has created'
        })
    } catch (error) {
        return res.status(400)
            .json({
                status: false,
                message: `error bang ${error}`
            })
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
            status: true,
            data: editedGame,
            message: 'Game sudah diupdate'
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

export const deleteGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const gameId = Number(id);

        const findGame = await prisma.game.findUnique({ where: { id: gameId } });
        if (!findGame) {
            return res.status(404).json({
                status: false,
                message: "Game tidak ditemukan",
            });
        }

        // Hapus dulu semua detail transaksi yang terkait
        await prisma.detail_Transaksi.deleteMany({
            where: { idGame: gameId },
        });

        // Baru hapus game-nya
        await prisma.game.delete({
            where: { id: gameId },
        });

        return res.status(200).json({
            status: true,
            message: "Game telah dihapus",
        });
    } catch (error: any) {
        return res.status(400).json({
            status: false,
            message: `Error saat menghapus Game: ${error.message || error}`,
        });
    }
};


export const getTotalGames = async (req: Request, res: Response) => {
    try {
        const total = await prisma.game.count();
        return res.json({
            total: total,
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: `${error}`
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
        // Ambil semua game + hitung total pembeliannya (jumlah detail transaksi)
        const games = await prisma.game.findMany({
            include: {
                _count: {
                    select: {
                        Detail_Transaksi: true
                    }
                }
            }
        });

        // Masukkan total_dibeli dari hasil count
        const formattedGames = games.map(game => ({
            id: game.id,
            uuid: game.uuid,
            name: game.name,
            gambar: game.gambar,
            video: game.video,
            developer: game.developer,
            harga: game.harga,
            deskripsi: game.deskripsi,
            genre: game.genre,
            tahun_rilis: game.tahun_rilis,
            createdAt: game.createdAt,
            updateAt: game.updateAt,
            total_dibeli: game._count.Detail_Transaksi
        }));

        // Urutkan berdasarkan total_dibeli terbesar, ambil 10 teratas
        const sortedGames = formattedGames
            .sort((a, b) => b.total_dibeli - a.total_dibeli)
            .slice(0, 10);

        return res.status(200).json({
            status: true,
            message: 'Most purchased games retrieved successfully',
            data: sortedGames
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: `Error retrieving most purchased games: ${error.message}`
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
                                        genre: true,
                                        download_link: true
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

export const getQuickAccess = async (req: Request, res: Response) => {
    try {
        const { search } = req.query //input
        const Quickaccess = await prisma.game.findMany({
            where: { name: { contains: search?.toString() || "" } },
            take: 9,
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
        return res.status(200).json({
            status: true,
            data: Quickaccess,
            massege: 'Berhasil menampilkan game'
        })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message)
            res.status(500).json({
                error: `${error.message}`
            })
        }
    }
}

export const getMonthlyGameSalesStat = async (req: Request, res: Response) => {
    try {
        const now = new Date();

        // Bulan ini
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        // Bulan lalu
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        // Hitung total pembelian game bulan ini
        const totalThisMonth = await prisma.detail_Transaksi.count({
            where: {
                createdAt: {
                    gte: startOfThisMonth,
                    lte: endOfThisMonth
                }
            }
        });

        // Hitung total pembelian game bulan lalu
        const totalLastMonth = await prisma.detail_Transaksi.count({
            where: {
                createdAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth
                }
            }
        });

        // Hitung persentase perubahan
        let percentChange = 0;
        if (totalLastMonth === 0 && totalThisMonth > 0) {
            percentChange = 100;
        } else if (totalLastMonth === 0 && totalThisMonth === 0) {
            percentChange = 0;
        } else {
            percentChange = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;
        }

        return res.status(200).json({
            status: true,
            data: {
                totalThisMonth,
                totalLastMonth,
                percentChange: parseFloat(percentChange.toFixed(2)),
                message: percentChange >= 0 ? "Naik" : "Turun"
            }
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: `Error getting monthly stats: ${error.message}`
        });
    }
};
