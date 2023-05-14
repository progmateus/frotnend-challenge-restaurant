import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies';



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'signIn',
      component: () => import('../views/signInView.vue'),
      beforeEnter: (to, from, next) => {

        if (VueCookies.get("restaurant-challenge.token")) {
          return next({
            name: "Reservation"
          })
        }
        next();
      }
    },
    {
      path: '/signup',
      name: 'signUp',
      component: () => import('../views/signUpView.vue'),
      beforeEnter: (to, from, next) => {

        if (VueCookies.get("restaurant-challenge.token")) {
          return next({
            name: "Reservation"
          })
        }
        next();
      }
    },
    {
      path: '/reservation/new',
      name: 'Reservation',
      component: () => import('../views/reservationView.vue'),
      beforeEnter: (to, from, next) => {

        if (!VueCookies.get("restaurant-challenge.token")) {
          return next({
            name: "signIn"
          })
        }
        next();
      }
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboardView.vue'),
      beforeEnter: (to, from, next) => {

        if (!VueCookies.get("restaurant-challenge.token")) {
          return next({
            name: "signIn"
          })
        }

        const localstorage = localStorage.getItem("restaurant-challenge.user")

        if (!localstorage) {
          return next({
            name: "signIn"
          })
        }

        const user = JSON.parse([localStorage.getItem("restaurant-challenge.user")])

        if (user.isAdmin === false) {
          return next({
            name: "Reservation"
          })
        }


        next();
      }
    },

    {
      path: '/admin/painel',
      name: 'painel',
      component: () => import('../views/painelAdmView.vue'),
      beforeEnter: (to, from, next) => {

        if (!VueCookies.get("restaurant-challenge.token")) {
          return next({
            name: "signIn"
          })
        }

        const localstorage = localStorage.getItem("restaurant-challenge.user")

        if (!localstorage) {
          return next({
            name: "signIn"
          })
        }

        const user = JSON.parse([localStorage.getItem("restaurant-challenge.user")])

        if (user.isAdmin === false) {
          return next({
            name: "Reservation"
          })
        }

        next();
      }
    }
  ]
})

export default router
