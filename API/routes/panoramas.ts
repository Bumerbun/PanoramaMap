import {Request, Response, Router} from "express"
import AppDataSource from "../orm/data-source";
import { Panorama } from "../orm/entities/Panorama";
import { PointConnection } from "../orm/entities/PointConnection";
import { Equal, FindOneOptions, FindOptionsWhere } from "typeorm";

var router = Router();

/* GET users listing. */
router.get('/', async (_request: Request, response: Response) => {
  var panoramas = await AppDataSource.manager
    .getRepository(Panorama)
    .find({relations:{ptype:true}})
  response.json(panoramas)
});

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
module.exports = router;
  