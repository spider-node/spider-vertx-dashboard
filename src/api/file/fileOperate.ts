import api from '../method/method'

export default {
    upload(params: FormData) {
        return api.uploadFile('/upload/bpmn', params)
    },
}