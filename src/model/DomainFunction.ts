class DomainFunction {
    public id: string;
    public name: string;
    public desc: string;
    public taskComponent: string;
    public taskService: string;
    public taskMethod: string;
    public workerId: string;
    public workerType: string;
    public status: string;
    public areaId: string;
    public areaName: string;
    /**
     * 子领域id
     */
    public sonDomainInfo: object
    // 设置构造函数,入参未json
}