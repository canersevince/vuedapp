import axios from "axios";
export const uploadFile = (file) => {
    const formData = new FormData()
    formData.append('file', file)
    axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
    axios.defaults.headers['x-requested-with'] = 'localhost:8080'
    return axios.post('http://nearfolio-uploader.herokuapp.com/upload', formData,
        {
            headers: {
                'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            }
        })
}

export default uploadFile
