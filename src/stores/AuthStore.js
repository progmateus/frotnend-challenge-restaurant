import { defineStore } from "pinia"
import { api } from "../services/apiClient"
import { reactive } from "vue";
import VueCookies from 'vue-cookies'



export const useAuthStore = defineStore("auth", () => {

    const user = reactive({});

    const login = async ({ email, password }) => {

        const response = await api.post("/sessions", {
            email,
            password
        })

        if (response.status === 200) {
            const { user, token, refresh_token } = response.data

            localStorage.setItem("restaurant-challenge.user", JSON.stringify(user))

            VueCookies.set('restaurant-challenge.token', token, "30d")
            VueCookies.set('restaurant-challenge.refreshToken', refresh_token, "30d")
            api.defaults.headers['Authorization'] = `Bearer ${token}`
        }
    }

    const signOut = () => {

        localStorage.removeItem("restaurant-challenge.user")

        VueCookies.remove("restaurant-challenge.token")
        VueCookies.remove("restaurant-challenge.refreshToken")

    }

    const getProfileUser = async () => {
        const response = await api.post("/sessions", {
            email,
            password
        })

        this.user = response.data
    }


    return { user, login, signOut, getProfileUser }

})