import {Request, Response, Router} from "express"
import AppDataSource from "../orm/data-source";

const router = Router();

router.get("/:columnName", (request: Request, response: Response) => {
    const columnName = request.params.columnName
    AppDataSource.createQueryBuilder()
        .select(columnName)
})