class Datasource {
    id: number
    datasource: string
    url: string
    name: string
    password: string
    initialSize: number
    minIdle: number
    maxIdle: number
    driverClassName: string

    // 入参是json来构造
    constructor(json: any) {
        this.id = json.id
        this.datasource = json.datasource
        this.url = json.url
        this.name = json.name
        this.password = json.password
        this.initialSize = json.initialSize
        this.minIdle = json.minIdle
        this.maxIdle = json.maxIdle
        this.driverClassName = json.driverClassName
    }
}