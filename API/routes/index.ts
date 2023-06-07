import {Request, Response, Router} from "express"

var router = Router();

/* GET home page. */
router.get('/', (_request: Request, response: Response) => {
  response.send("ApiIndex");
});

module.exports = router;
