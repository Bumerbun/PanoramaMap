import { Request, Response, Router} from "express";
import AppDataSource from "../orm/data-source";
import { Room } from "../orm/entities/Room";

const router = Router()

router.get("/", async (request: Request, response: Response) => {
    const roomPointsRelations =  Boolean(Number(request.query.points))  
    const connectionsRelation =  Boolean(Number(request.query.connections))

    const rooms = await AppDataSource.getRepository(Room).find({
        relations: {
            roompoints: !roomPointsRelations ? roomPointsRelations : {point: {
                pointConnections: !connectionsRelation ? connectionsRelation : {point2 : connectionsRelation} 
            }}
        }
    })
    // const rooms = await AppDataSource.getRepository(Room).find({
    //     relations: {
    //         roompoints: roomPointsRelations
    //     }
    // })
    response.json(rooms)
})

module.exports = router;