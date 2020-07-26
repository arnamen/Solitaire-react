import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://solitaire-db.firebaseio.com/'
})

export default instance;