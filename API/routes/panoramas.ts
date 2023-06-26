import {NextFunction, Request, Response, Router} from "express"
import AppDataSource from "../orm/data-source";
import { PanoramaPoint } from "../orm/entities/PanoramaPoint";

var router = Router();

router.get('/', async (request: Request, response: Response) => {
  const pointrelation =  Boolean(Number(request.query.point))
  const connectionsrelation =  Boolean(Number(request.query.connections))  
  
  const panoramas = await AppDataSource.manager
    .getRepository(PanoramaPoint)
    .find({relations:{
      point: !pointrelation ? pointrelation : {pointConnections: !connectionsrelation ? connectionsrelation : {point2: connectionsrelation}}}})
  response.json(panoramas)
});

router.get('/one/:id', async  (request: Request, response: Response, next: NextFunction) => {
  const id = Number.parseInt(request.params.id)
  console.log(id)
  if (!id){
    return next("invalid request")
  }id
  const pointrelation =  Boolean(Number(request.query.point))
  const connectionsrelation =  Boolean(Number(request.query.connections))  
  const point = await AppDataSource.manager.getRepository(PanoramaPoint)
    .findOne({
      where: {id: id},
      relations: {
        point: !pointrelation ? pointrelation : {pointConnections: !connectionsrelation ? connectionsrelation : {point2: connectionsrelation}}
  }})
  console.log(point)
  response.json(point)
})

router.get('/connections/:id', async (request: Request, response: Response) => {
  const pointrelation =  Boolean(Number(request.query.point))
  const id = Number.parseInt(request.params.id)
  var panoramapoints = await AppDataSource.manager.getRepository(PanoramaPoint)
  .find({
    where:{id: id}, 
    relations: {point: {pointConnections: {point2: pointrelation} }}
  })
  var connections = panoramapoints.map(x => x.point.pointConnections.map(x => x.point2))
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
    const result = await AppDataSource.manager.getRepository(PanoramaPoint).createQueryBuilder("panorama")
      .select(querycolumns)
      .getRawMany()
    response.json(result)
  } 
  catch (err){
    console.log(err)
    next(err)
  }
})

router.get('/point/:id', async (request: Request, response: Response, next: NextFunction) => {
  const id = Number.parseInt(request.params.id)
  const connectionsrelation =  Boolean(Number(request.query.connections))  
  var panoramapoint = await AppDataSource.manager.getRepository(PanoramaPoint)
  .find({
    where:{point: {id: id}}, 
    relations: {point: {pointConnections: !connectionsrelation ? connectionsrelation : {point2:connectionsrelation}  }}
  })
  response.json(panoramapoint)
})
module.exports = router;
  