
export class ObjectParser{
    public static fillFromJson(object: any, json: any){

        const properties = Object.getOwnPropertyNames(object)
        for (let i = 0; i < properties.length; i++){
            if (json.hasOwnProperty(properties[i])){
                object[`${properties[i]}`] = json[properties[i]]
            }
        }
    }
}