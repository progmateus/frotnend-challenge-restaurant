<template>
    <main>
        <div>

             <h1> Tabela de reservas</h1>
             <a href="/dashboard"> Voltar ao menu inicial </a>

            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Cliente</th>
                        <th>Mesa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="reservation in reservations" v-bind:key="reservation.reservation.id">
                        <td>{{
                            new Date(reservation.reservation.date).toLocaleDateString
                                    ("pt-br", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZone: "GMT"
                                        
                                    },)
                         }}
                         </td>

                        <td>{{ reservation.client.name }}</td>

                        <td>{{ reservation.reservation.table_spot }}</td>
                    </tr>
                </tbody>
            </table>

        </div>
    </main>
</template>


<script>
    import {useAuthStore} from "../stores/AuthStore"
    import { onMounted, ref } from 'vue';
    import { api } from "../services/apiClient";

    const reservations = ref([]);
    const auth = useAuthStore();

    export default{
        name: "PainelAdm",
        data: () => {
            return{
                reservations
            }
        },
        async created(){

                api.defaults.headers['Authorization'] = `Bearer ${this.$cookies.get("restaurant-challenge.token")}`

                await api.get("/reservations")
                .then((response) => {
                            reservations.value = response.data
                })
                .catch((error) => {
                    console.log(error);
                })
            }
    }
</script>

<style  scoped>

    main{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
    }

    div{
        width: 50%;
        display: block;
        text-align: center;
    }


    td{
        margin: 0 1rem;
    }

    th{
        background-color: #EEEEEE;
    }

    table, th, td{
        border: 1px solid #878787;
        border-collapse: collapse;
        padding: 5px 2px;
    }

    table{
        width: 100%;
        margin-top: 2rem;
    }

    tr:hover{
        background-color: #F5F5F5;
    }

    @media screen and (max-width: 975px) {
        main{
            padding: 2rem 1rem;
        }
        div{
            width: 100%
        }
    }


</style>