// 根据所需类型进行转码并返回下载地址
export function setEncoded(type: string, filename: string, data: string) {
    const encodedData: string = encodeURIComponent(data)
    return {
        filename: `${filename}.${type.toLowerCase()}`,
        href: `data:application/${
            type === 'svg' ? 'text/xml' : 'bpmn20-xml'
        };charset=UTF-8,${encodedData}`,
        data: data
    }
}

// 文件下载方法
export function downloadFile(href: string, filename: string) {
    if (href && filename) {
        const a: HTMLAnchorElement = document.createElement('a')
        a.download = filename //指定下载的文件名
        a.href = href //  URL对象
        a.click() // 模拟点击
        URL.revokeObjectURL(a.href) // 释放URL 对象
    }
}

// 新增方法：获取文件流并调用Java提供的文件保存API
export async function fetchFileStream(href: string, filename: string) {
    try {
        const response = await fetch(href);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const blob = await response.blob();
        // 创建FormData对象并添加文件
        const formData = new FormData();
        formData.append('file', blob, filename);
        // 假设Java提供的文件保存API是一个POST请求，URL为/saveFile
        const saveResponse = await fetch('/saveFile', {
            method: 'POST',
            body: formData
        });
        if (!saveResponse.ok) {
            throw new Error(`Failed to save file: ${saveResponse.statusText}`);
        }
        console.log('File saved successfully');
    } catch (error) {
        console.error('Error fetching or saving file:', error);
    }
}