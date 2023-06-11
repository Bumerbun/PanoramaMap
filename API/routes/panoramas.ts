import {NextFunction, Request, Response, Router} from "express"
import AppDataSource from "../orm/data-source";
import { Panorama } from "../orm/entities/Panorama";
import { PointConnection } from "../orm/entities/PointConnection";
import { Equal, FindOneOptions, FindOptionsWhere } from "typeorm";

var router = Router();

router.get('/', async (_request: Request, response: Response) => {
  var panoramas = await AppDataSource.manager
    .getRepository(Panorama)
    .find({relations:{ptype:true}})
  response.json(panoramas)
});

router.get('/one/:id', async  (request: Request, response: Response, next: NextFunction) => {
  
  const id = Number.parseInt(request.params.id)
  if (!id){
    return next("invalid request")
  }
  const point = await AppDataSource.manager.getRepository(Panorama).findOneBy({id: id})
  console.log(point)
  response.json(point)
})

router.get('/connections/:id', async (request: Request, response: Response) => {
  const id = Number.parseInt(request.params.id)
  const findOptions: FindOneOptions<PointConnection> = {
    where: [
      {point1: id},
      {point2: id}] as FindOptionsWhere<PointConnection>,
  };
  console.log(id)
  console.log(findOptions)
  console.log(await AppDataSource.manager.getRepository(PointConnection))
  const connections = await AppDataSource.manager.getRepository(PointConnection)
  .find(findOptions)
  console.log(connections)
  response.json(connections)
})

// "/columns?columnname=123&columnname=124"
router.get('/columns', async (request: Request, response: Response, next: NextFunction) => {
  console.log(request.query.columnname)
  const columnNames = request.query.columnname
  var querycolumns: string[] = []
  if (typeof columnNames == "string"){
    querycolumns.push(`panorama.${columnNames}`)
  } else if ((columnNames instanceof Array) && typeof columnNames?.at(0) == "string"){
    querycolumns = columnNames.map((item) => `panorama.${item}`)
  } else {
    return
  }
  try{
    const result = await AppDataSource.manager.getRepository(Panorama).createQueryBuilder("panorama")
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
  