class NodeInfo {

    domainFunctionDesc: string
    domainFunctionName: string
    domainFunctionVersion: string
    taskComponent: string
    taskService: string
    functionVersionId: string
    functionType: string
    id: string
    name: string
    constructor(json: any) {
        this.domainFunctionDesc = json.domainFunctionDesc
        this.domainFunctionName = json.domainFunctionName
        this.domainFunctionVersion = json.domainFunctionVersion
        this.taskComponent = json.taskComponent
        this.taskService = json.taskService
        this.functionVersionId = json.functionVersionId
        this.functionType = json.functionType
        this.id = json.id
        this.name = json.name
    }
}