import { Request, Response, Router } from "express";
import AppDataSource from "../orm/data-source";
import { Point } from "../orm/entities/Point";


const router = Router()

router.get("/",async (request: Request, response: Response) => {
    const typerelation =  Boolean(Number(request.query.ptype))
    const connectionsrelation =  Boolean(Number(request.query.connections))  
    const points = await AppDataSource.getRepository(Point).find({
        relations: {ptype: typerelation,
        pointConnections: !connectionsrelation ? connectionsrelation: {point2: connectionsrelation}}
    })
    response.json(points)    
})

router.get("/one/:id", async (request: Request, response: Response) => {
    const id = Number.parseInt(request.params.id)
    const connectionsrelation =  Boolean(Number(request.query.connections))
    const typerelation =  Boolean(Number(request.query.ptype))
    const point = await AppDataSource.getRepository(Point).findOne({
        where: {id: id},
        relations: {
            ptype: typerelation,
            pointConnections: !connectionsrelation ? connectionsrelation: {point2: connectionsrelation}
        }
    })
    response.json(point)
})


module.exports = router;