class FunctionPreview {
    // 业务功能总数
    public businessFunctionTotal: number
    // 未完成功能数
    public businessFunctionUnfinished: number
    // 领域功能总数
    public domainFunctionTotal: number
    // 未完成领域功能总数
    public domainFunctionUnfinished: number
    // 领域数量
    public domainTotal: number
    // 数据源数量
    public dataSourceTotal: number
    // 子域数量
    public subDomainTotal: number
    constructor(businessFunctionTotal: number, businessFunctionUnfinished: number, domainFunctionTotal: number, domainFunctionUnfinished: number, domainTotal: number, dataSourceTotal: number, subDomainTotal: number) {
        this.businessFunctionTotal = businessFunctionTotal
        this.businessFunctionUnfinished = businessFunctionUnfinished
        this.domainFunctionTotal = domainFunctionTotal
        this.domainFunctionUnfinished = domainFunctionUnfinished
        this.domainTotal = domainTotal
        this.dataSourceTotal = dataSourceTotal
        this.subDomainTotal = subDomainTotal
    }
}