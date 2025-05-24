import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllOrders = async (request: Request, response: Response) => {
    try {
        const { search } = request.query

        const allOrders = await prisma.transaksi.findMany({
            where: {
                OR: [
                    { customer: { contains: search?.toString() || "" } }]
            },
            orderBy: { createdAt: "desc" },
            include: { Detail_Transaksi: true }
        })

        return response.json({
            status: true,
            data: allOrders,
            message: `Order list has retrieved`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { metode_pembayaran, status, detail_transaksi } = req.body;

        // User diambil dari middleware/auth, misal user sudah ada di req.user
        const user = (req as any).user;
        if (!user || !user.id) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }

        const uuid = uuidv4();
        let total_bayar = 0;

        // Ambil list gameId dari request
        const requestedGameIds = detail_transaksi.map((d: any) => d.gameId);

        // Cek game yang sudah dimiliki user lewat transaksi yang sudah ada
        // Cari detail transaksi dengan game yg sudah dibeli user
        const ownedDetails = await prisma.detail_Transaksi.findMany({
            where: {
                transaksi: {
                    userId: user.id,
                    status: "Lunas" // pastikan transaksi sudah lunas (optional, bisa disesuaikan)
                },
                idGame: { in: requestedGameIds }
            },
            select: { idGame: true }
        });

        const ownedGameIds = ownedDetails.map(d => d.idGame);

        // Kalau ada game yang sudah owned, return error
        const alreadyOwned = requestedGameIds.find((id: number) => ownedGameIds.includes(id));
        if (alreadyOwned) {
            return res.status(400).json({
                status: false,
                message: `User already owns the game with id ${alreadyOwned}`
            });
        }

        // Hitung total bayar dari harga tiap game
        for (const detail of detail_transaksi) {
            const game = await prisma.game.findUnique({ where: { id: detail.gameId } });
            if (!game) {
                return res.status(404).json({ status: false, message: `Game with id ${detail.gameId} not found` });
            }
            total_bayar += game.harga;
        }

        // Buat transaksi baru
        const newOrder = await prisma.transaksi.create({
            data: {
                uuid,
                customer: user.username || user.email || "Customer",
                total_bayar,
                metode_pembayaran,
                status, // bisa "Belum_Lunas" atau "Lunas"
                userId: user.id
            }
        });

        // Buat detail transaksi dan update owned game
        for (const detail of detail_transaksi) {
            await prisma.detail_Transaksi.create({
                data: {
                    uuid: uuidv4(),
                    idTransaksi: newOrder.id,
                    idGame: detail.gameId
                }
            });

            await prisma.game.update({
                where: { id: detail.gameId },
                data: {
                    Owned: "True",
                    userId: user.id,   // isi userId di game dengan pembeli
                }
            });
        }

        return res.status(200).json({
            status: true,
            data: newOrder,
            message: "Order successful"
        });

    } catch (error: any) {
        return res.status(400).json({
            status: false,
            message: `Error: ${error.message}`
        });
    }
};

export const getOwnedGames = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    const transactions = await prisma.transaksi.findMany({
      where: {
        userId: Number(user.id),
        status: "Lunas",
      },
      include: {
        Detail_Transaksi: {
          include: {
            game: true,
          },
        },
      },
    });

    const ownedGames = transactions.flatMap((tx) =>
      tx.Detail_Transaksi.map((detail) => detail.game).filter((game) => !!game)
    );

    return res.status(200).json({
      status: true,
      data: ownedGames,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: `Failed to get owned games: ${error.message}`,
    });
  }
};



export const updateStatusOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const findOrder = await prisma.transaksi.findFirst({ where: { id: Number(id) } })
        if (!findOrder) return res
            .status(200)
            .json({
                status: false,
                message: "order tidak ada"
            })

        const editedUser = await prisma.transaksi.update({
            data: {
                status: status || findOrder.status
            },
            where: { id: Number(id) }
        })

        return res.json({
            status: 'alhamdulillah ga error',
            user: editedUser,
            message: 'order telah diupdate'
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

export const deleteOrder = async (request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findOrder = await prisma.transaksi.findFirst({ where: { id: Number(id) } })
        if (!findOrder) return response
            .status(200)
            .json({ status: false, message: `Order is not found` })

        let deleteOrderList = await prisma.detail_Transaksi.deleteMany({ where: { idTransaksi: Number(id) } })
        let deleteOrder = await prisma.transaksi.delete({ where: { id: Number(id) } })


        return response.json({
            status: true,
            data: deleteOrder,
            message: `Order has deleted`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

