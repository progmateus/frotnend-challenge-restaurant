<template>
    <main>
        <form class="container" @submit.prevent="handleSubmit" >
            <h1> Faça sua reserva</h1>

            <div class="container-inputs">
                <div>
                    <div>
                        <label>Data</label>
                        <!-- onkeypress="return false" -->
                        <input id="input_date" type="date" v-model="date" />
                    </div>

                    <div>
                        <label htmlFor="select_time"> Horário</label>

                        <select  name="select_time" v-model="select_time" >
                            <option selected disabled="disabled">-- Selecione</option>    
                            <option v-for="hour in hours" v-bind:key="hour" :value="`${hour}:00`">
                                 {{ hour }}
                            </option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="table"> Mesa</label>

                    <select  name="table" v-model="select_table">
                        <option selected disabled="disabled">-- Selecione</option>    
                        <option v-for="table in tables" v-bind:key="table" :value="table">
                            {{ table }}
                        </option>
                    </select>
                </div>

            </div>

            <button type="submit" :disabled="isDisabled" > RESERVAR </button>

            <div class="icon" @click="handleLogout">
                <Logout fillColor="#F26153" :size="18" />

                <p>
                    Sair
                </p>
            </div>

            <div class="success" v-if="isSuccess" @click="handleLogout">
                <CheckCircle fillColor="#309413" :size="24" />

                <p>
                    Reserva realizada com sucesso
                </p>
            </div>
        </form>
    </main>
</template>

<script>
    import Input from "@/components/form/input.vue"
    import Logout  from 'vue-material-design-icons/Logout.vue';
    import CheckCircle  from 'vue-material-design-icons/CheckCircle.vue';
    import {useAuthStore} from "../stores/AuthStore"
    import { watch  } from 'vue';
    import { ref, reactive } from 'vue';
    import dayjs from "dayjs"
    import { api } from "../services/apiClient";



    const auth = useAuthStore();
    const selected_time = ref("");
    const selected_date = ref("");
    const isDisabled = ref(true)
    const isSuccess = ref(false);
    const tables = ref([]);



    export default{
        name: "Reservation",
        data(){
            return{
                select_time: "-- Selecione",
                isDisabled,
                select_table: "-- Selecione",
                tables,
                isSuccess,
                date: "",
                hours: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
            }
        },
        components: {
            Input ,
            Logout,
            CheckCircle
        },
        created(){
            api.defaults.headers['Authorization'] = `Bearer ${this.$cookies.get("restaurant-challenge.token")}`
        },
        methods:{

               handleLogout(){
                auth.signOut();
                this.$router.push("/")
            },

            async handleSubmit(){
                const dateFormatted = `${this.date} ${this.select_time}`;
                const isValidDate = dayjs(dateFormatted).isValid();

                if(isValidDate){

                    if(this.select_table !== "-- Selecione" &&
                       this.select_time !== "-- Selecione" &&
                       this.date !== "")
                    {     
                        await api.post("/reservations", {
                            date: dateFormatted,
                            table_spot: this.select_table
                        })
                        .then((response) => {
                            this.select_table = "-- Selecione"
                            this.select_time = "-- Selecione"
                            this.date = ""

                            isSuccess.value = true;

                        }).catch((error)=> {
                            console.log("Error: ", error)
                        })
                    }
                }
            }
        },

        watch: {
            select_time (newValue, oldValue){
                selected_time.value = newValue 
                this.select_table = "-- Selecione"


            },
            date (newValue, oldValue){

                selected_date.value = newValue
                this.select_table = "-- Selecione"


                let day = new Date(selected_date.value).getUTCDay();
                if([0].includes(day)){
                    alert("Não funcionamos no domingo!")
                    this.date = ""
                    return isDisabled.value = true
                }

            },
            select_table(newValue, oldValue){
                if(newValue = "-- Selecione"){
                    return isDisabled.value = false 
                }
            }
        },
        setup(){

            watch([selected_date, selected_time], async () => {
                tables.value = [];
                isDisabled.value = true


                if(selected_date.value !== "" &&
                    selected_time.value !== "" 
                    &&  selected_time.value !== "-- Selecione")
                    {

                    const dateFormatted = `${selected_date.value} ${selected_time.value}`;

                    await api.get("/reservations/tables/available", {
                        params:{
                            date: dateFormatted,
                        }
                    })
                    .then((response) => {
                        isSuccess.value = false;


                        for (let i in response.data){
                            tables.value.push(response.data[i])
                        }


                    }).catch((error)=> {
                        console.log("Error: ", error)
                    })

                }
                
            })
        },        
    }
</script>

<style  scoped>


    main{
            display: flex;
            justify-content: center;
            align-items: center;
        }


    .container{
        padding: 2rem 4rem;
        border-radius: 7px;
        border: 1px solid #CED0D4;
        text-align: center;
    }

    .container-inputs{
        display:flex;
        flex-direction: column;
        flex-wrap: wrap;
        text-align: left;

    }

    .container-inputs > div:first-child {
        display: flex;
        margin: 1rem 0;
    }

    .container-inputs > div:nth-child(2) {
        text-align: left;
    }

    .container-inputs > div > div:first-child{
        margin-right: 2rem;
    }

    h1{
        text-align: center;
        color: #AE2933;
        margin: 1rem 0;
    }

    label{
        display: block;
    }

    input, select{
        width: 10rem;
        height: 2rem;

        border-radius: 5px;
        border: 1px solid #CED0D4;
        background-color: #F0F2F5;
        padding: 0 5px;

    }

    input:focus{
        border: 1px solid #96A0B6;
        outline: none;
    }



    button{
        width: 15rem;
        height: 2rem;
        margin: 2rem 0;
        border-radius: 5px;
        background-color: #F26153;
        color: white;

        outline: none;
        border: none;
        font-weight: 700;
    }

    button:hover{
        cursor: pointer;
        background-color: #F7927D;
    }

    button:disabled{
        cursor: not-allowed;
        opacity: 0.5
    }


    .icon{
        margin: 0 auto;
        width: 5rem;
        font-size: 18px;
        display: flex;
        justify-content: center;
    }

    .icon:hover{
        cursor: pointer;
        opacity: 0.7
    }

    .icon > p {
        margin-top: -0.125rem;
        margin-left: 2px;
    }

    .success{
        display: flex;
        color: #309413;
        font-size: 24px;
        align-items: center;
        margin-top: 1rem;
    }

    .success > p {
        margin-top: -0.375rem;
        margin-left: 2px;
    }

    @media screen and (max-width: 975px) {
        .container{
            border: none;
        }

        .container-inputs > div > div:first-child{
            margin-right: 0.5rem;
        }

        input, select{
            width: 8.5rem;
        }
    }
    
</style>