import { NextFunction, Request, Response, Router} from "express";
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
    response.json(rooms)
})

router.get("/one/:id", async (request: Request, response: Response) => {
    const id = Number.parseInt(request.params.id)
    const roomPointsRelations =  Boolean(Number(request.query.points))  
    const connectionsRelation =  Boolean(Number(request.query.connections))
    const point = await AppDataSource.getRepository(Room).findOne({
        where: {id: id},
        relations: {
            roompoints: !roomPointsRelations ? roomPointsRelations : {point: {
                pointConnections: !connectionsRelation ? connectionsRelation : {point2 : connectionsRelation} 
            }}
        }
    })
    response.json(point)
})

router.get('/columns', async (request: Request, response: Response, next: NextFunction) => {
    console.log(request.query.columnname)
    const columnNames = request.query.columnname
    var querycolumns: string[] = []
    if (typeof columnNames == "string"){
      querycolumns.push(`room.${columnNames}`)
    } else if ((columnNames instanceof Array) && typeof columnNames?.at(0) == "string"){
      querycolumns = columnNames.map((item) => `room.${item}`)
    } else {
      return
    }
    try{
      const result = await AppDataSource.manager.getRepository(Room).createQueryBuilder("room")
        .select(querycolumns)
        .getRawMany()
      response.json(result)
    } 
    catch (err){
      console.log(err)
      next(err)
    }
  })

module.exports = router;