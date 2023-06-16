import {Request, Response, Router} from "express"
import AppDataSource from "../orm/data-source";
import { PointConnection } from "../orm/entities/PointConnection";

var router = Router();
/* GET home page. */
router.get('/', async (_request: Request, response: Response) => {
  response.send("ApiIndex");
});

module.exports = router;
