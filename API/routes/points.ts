import {Request, Response, Router} from "express"
import AppDataSource from "../orm/data-source";
import { Point } from "../orm/entities/Point";

var router = Router();

/* GET users listing. */
router.get('/', async (_request: Request, response: Response) => {
  var users = await AppDataSource.manager.find(Point)
  response.json(users)
});

module.exports = router;
