import ipfsClient from 'ipfs-http-client'

export const uploadFile = async (file) => {
    const ipfs = ipfsClient({
        host: "ipfs.infura.io",
        port: "5001",
        protocol: "https",
    })
    /* const formData = new FormData()
    formData.append('file', file)
    axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
    axios.defaults.headers['x-requested-with'] = 'localhost:8080'
    return axios.post('http://nearfolio-uploader.herokuapp.com/upload', formData,
        {
            headers: {
                'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            }
        }) */
    try {
        const added = await ipfs.add(
            file,
            {
                progress: (prog) => console.log(`uploading... ${prog}`)
            }
        )
        console.log(added)
        return added
    } catch (err) {
        console.error(err)
    }

}

export default uploadFile
