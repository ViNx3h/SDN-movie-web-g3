import axios from "axios";

export const domain = axios.create({
    baseURL: "http://localhost:5000/",
});

domain.interceptors.response.use(function (response) {
    return response;

});