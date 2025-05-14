class SonDomainVersion {
    // 领域service名称
    domainObjectServiceName: string
    // 领域实体的名称
    domainObjectEntityName: string
    // 版本
    version: string
    groupId: string
    artifactId: string
    domainObject: object
    // 声明 domainFieldInfos为数组
    domainFieldInfos: Array<DomainFieldInfo>
    sonAreaName: string
    sonAreaId: string
    areaName: string
    id: string
}