
import axios from "axios"
import { AuthTokenError } from "../errors/authTokenError";

let failedRequestQueue = [];

export function setupAPIClient() {
    const api = axios.create({
        baseURL: "http://localhost:3333",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("restaurant-challenge.token")}`
        }
    })

    api.interceptors.response.use(response => {
        return response
    }, (error) => {

        if (error.response.status === 401) {
            if (error.response.data?.message == "Invalid Token") {

                const originalConfig = error.config;

                return new Promise((resolve, reject) => {
                    failedRequestQueue.push({
                        onSuccess: (token) => {
                            originalConfig.headers["Authorization"] = `Bearer ${token}`

                            resolve(api(originalConfig));
                        },
                        onFailure: (error) => {
                            reject(error);
                        }
                    })
                })
            } else {

                if (typeof window) {
                    localStorage.removeItem("restaurant-challenge.token")

                    localStorage.removeItem("restaurant-challenge.refreshToken")

                    localStorage.removeItem("restaurant-challenge.user.isAdmin")
                } else {
                    return Promise.reject(new AuthTokenError())
                }
            }
        }
        return Promise.reject(error);
    });

    return api
}