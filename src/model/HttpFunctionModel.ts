interface HttpFunctionModel {
    id?: number; // 对应 private Integer id;
    httpFunctionName?: string; // 对应 private String httpFunctionName;
    httpType?: string; // 对应 private String httpType;
    httpFunctionDesc?: string; // 对应 private String httpFunctionDesc;
    httpFunctionParamObject?: any; // 对应 private JSONObject httpFunctionParamObject;
    httpFunctionResultObject?: any; // 对应 private JSONObject httpFunctionResultObject;
    httpFunctionParamClass?: string[]; // 对应 private List<String> httpFunctionParamClass;
    httpFunctionResultClass?: string[]; // 对应 private List<String> httpFunctionResultClass;
    httpHeader?: object[]; // 对应 private Map<String,Object> httpHeader;
    httpFunctionPath?: string;
    functionUrl: string
}