
import axios from 'axios'


const api = axios.create({
    baseURL: 'http://191.234.168.25:3000'
})

export default api;
