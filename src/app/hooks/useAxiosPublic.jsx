import axios from "axios";
const axiosPublic = axios.create({
    baseURL: 'https://chatify-server-1-1a8e.onrender.com/'
})

const UseAxiosPublic = () => {
        return axiosPublic
};


export default UseAxiosPublic;