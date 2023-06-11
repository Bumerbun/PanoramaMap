import {Request, Response, Router} from "express"
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

router.get('/:id', async  (request: Request, response: Response) => {
  const id = Number.parseInt(request.params.id)
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

// router.get('/column/:columnName' async (request: Request, response: Response) => {
//   const columnName = request.params.columnName
//   AppDataSource.getRepository(Panorama)
// })
module.exports = router;
  