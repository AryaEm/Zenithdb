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

export const createOrder = async (request: Request, response: Response) => {
    try {
        const { customer, metode_pembayaran, status, detail_transaksi } = request.body;
        const user = request.body.user;

        // console.log(user)
        const uuid = uuidv4();

        let total_bayar = 0;

        for (let index = 0; index < detail_transaksi.length; index++) {
            const { gameId, quantity = 1 } = detail_transaksi[index]; // Default quantity = 1 jika tidak ada

            // Cari game berdasarkan gameId
            const detailGame = await prisma.game.findFirst({
                where: {
                    id: gameId
                }
            });
            if (!detailGame) {
                return response.status(200).json({
                    status: false,
                    message: `Game with id ${gameId} is not found`
                });
            }

            // Tambahkan harga * quantity ke total_bayar
            total_bayar += detailGame.harga * quantity;
        }

        // Buat data order baru di tabel transaksi
        const newOrder = await prisma.transaksi.create({
            data: { uuid, customer, total_bayar, metode_pembayaran, status, userId: user.id }
        });

        // Buat detail transaksi dan update total_dibeli untuk setiap game
        for (let index = 0; index < detail_transaksi.length; index++) {
            const { gameId, quantity = 1 } = detail_transaksi[index];

            // Buat detail transaksi
            await prisma.detail_Transaksi.create({
                data: {
                    uuid: uuidv4(),
                    idTransaski: newOrder.id,
                    idGame: Number(gameId)
                }
            });

            // Update total_dibeli untuk setiap game
            await prisma.game.update({
                where: {
                    id: gameId
                },
                data: {
                    total_dibeli: { increment: quantity } // Menambah total_dibeli sesuai quantity
                }
            });
        }

        // Response sukses
        return response.status(200).json({
            status: true,
            data: newOrder,
            message: `New Order has been created`
        });
    } catch (error) {
        return response.status(400).json({
            status: false,
            message: `There is an error. ${error}`
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

        let deleteOrderList = await prisma.detail_Transaksi.deleteMany({ where: { idTransaski: Number(id) } })
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

