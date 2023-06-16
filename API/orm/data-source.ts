import "reflect-metadata"
import { DataSource } from "typeorm"
import { PanoramaPoint } from "./entities/PanoramaPoint"
import { Point } from "./entities/Point"
import { PointConnection } from "./entities/PointConnection"
import { PointType } from "./entities/PointType"
import { Room } from "./entities/Room"
import { RoomPoint } from "./entities/RoomPoint"

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "main",
    database: "PanoramaMap",
    entities: [PanoramaPoint, Point, PointConnection, PointType, Room, RoomPoint],
    schema: "testing",
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