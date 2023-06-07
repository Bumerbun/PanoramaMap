import "reflect-metadata"
import { DataSource } from "typeorm"
import { Panorama } from "./entities/Panorama"
import { Point } from "./entities/Point"
import { PointConnection } from "./entities/PointConnection"
import { PointType } from "./entities/PointType"

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "main",
    database: "PanoramaMap",
    entities: [Panorama, Point, PointConnection, PointType],
    synchronize: true
})
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
    
export default AppDataSource