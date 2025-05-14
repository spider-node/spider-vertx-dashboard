class SonDomain {
    public id: number
    public areaId: string
    public areaName: string
    public sonAreaName: string
    public tableName: string
    public datasource: string
    public createTime: Date
    public sonAreaDesc: string

    // 使用json做构造函数
    constructor(json: any) {
        this.id = obj.id
        this.areaId = obj.areaId
        this.areaName = obj.areaName
        this.sonAreaName = obj.sonAreaName
        this.tableName = obj.tableName
        this.datasource = obj.datasource
        this.createTime = obj.createTime
        this.sonAreaDesc = obj.desc
    }
}