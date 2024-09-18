import { Request, Response } from "express"; //untuk mengimport express
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllGames = async (req: Request, res: Response) => {
    try {
        const { search } = req.query //input
        const allGames = await prisma.game.findMany({                
            where: { name: { contains: search?.toString() || "" } }    // Main
        })                                                                
        return res.json({ //output                
            status: true,
            data: allGames,
            massege: 'Games has retrieved'
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
