import axios from 'axios';

const HTTP = {
    POST: (url, params) => {
        return axios.post(url, params);
    },
    GET: (url, params) => {
        return axios.get(url, params);
    },
    PUT: (url, params) => {
        return axios.put(url, params);
    },
    DELETE: (url, params) => {
        return axios.delete(url, params);
    }
}