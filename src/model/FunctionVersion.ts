interface FunctionVersion {
    id: string;
    functionId: string;
    version: string;
    functionName: string;
    status: string;
    bpmnUrl: string;
    startEventId: string;
    bpmnName: string;
    desc: string;
    bpmnStatus: string;
    rule: string
    runMapping: object
    resultMapping: object
    dataFlowId: number
    dataFlowName: string
    runObjectConfig: object
    resultObjectConfig: object
    runClass: string
    resultClass: string
    bpmnXml: string
    nodeParamInfo: object
    inputParamJavaClass: object
}