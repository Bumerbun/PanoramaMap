import {Request, Response, Router} from "express"
import AppDataSource from "../orm/data-source";
import { Panorama } from "../orm/entities/Panorama";

var router = Router();

/* GET users listing. */
router.get('/', async (_request: Request, response: Response) => {
    var panoramas = await AppDataSource.manager
      .getRepository(Panorama)
      .find({relations:{ptype:true}})
    response.json(panoramas)
  });
  
module.exports = router;
  