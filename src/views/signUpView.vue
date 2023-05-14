<template>
    <main>
        <form class="container" @submit.prevent="handleSubmit">

            <div class="icon">
                <Silverware fillColor="#F26153" :size="48" />
            </div>
                

            <p> Cadastre-se para realizar sua reserva</p>

            <Input name="name" label="Nome" type="text" v-model.trim="v$.name.$model" :class="{error: v$.name.$error}" @input="v$.name.$model = $event.target.value" />
            <div class="error-message" v-if="v$.name.$error"> Min 3 caracteres.</div>



            <Input type="email" name="email" label="E-mail" v-model.trim="v$.email.$model" :class="{error: v$.email.$error}"  @input="v$.email.$model = $event.target.value" />
            <div class="error-message" v-if="v$.email.$error"> Formato inválido.</div>

            <div class="error-message" v-if="emailApiError"> Este email ja está sendo utlizado.</div>


            <Input type="password" label="Senha" name="password" v-model.trim="v$.password.$model" :class="{error: v$.password.$error}"  @input="v$.password.$model = $event.target.value" />
            <div class="error-message" v-if="v$.password.$error"> Senha inválida.</div>



            <Input type="password" label="Confirmar senha" name="confirmation_password" v-model.trim="v$.confirmation_password.$model" :class="{error: v$.confirmation_password.$error}" @input="v$.confirmation_password.$model = $event.target.value" />
            <div class="error-message" v-if="v$.confirmation_password.$error"> As senhas devem ser iguais.</div>

            <div class="is_admin">

                <label for="admin"> Administrador? </label><br>

                <input type="radio" v-model.trim="v$.admin.$model"  id="yes" name="admin" :value="true" >

                <label for="admin"  class="radio_text"> Sim </label><br>

                <input type="radio" v-model.trim="v$.admin.$model" id="no" name="admin" :value="false" >

                <label for="admin" class="radio_text"> Não </label><br>

            </div>

            <button type="submit"> CADASTRAR </button>

            <div class="error-message" v-if="unexpectedApiError"> Ocorreu um erro.</div>




            <p> Tem uma conta?  <a href="/"> Conecte-se </a></p>

        </form>
    </main>
</template>


<script>
    import { useVuelidate } from '@vuelidate/core'
    import { required, email, minLength, sameAs  } from '@vuelidate/validators'
    import Silverware  from 'vue-material-design-icons/Silverware.vue';
    import axios from "axios"
    import Input from "@/components/form/input.vue"
    import { ref } from 'vue';
    import { api } from '../services/apiClient';
    import {useAuthStore} from "../stores/AuthStore"


    const auth = useAuthStore();

    const newPassword = ref("");
    const isSuccess = ref(false)

    export default{
        name: "SignIn",
        components: {
            Input ,
            Silverware 
        },
        setup:  () =>{
            return { v$: useVuelidate() }
        },
        data: () => {
            return {
                name: "",
                email: "",
                password: "",
                confirmation_password: "",
                admin: false,
                emailApiError: false,
                unexpectedApiError: false
            }
        },
        validations: () => {
            return {
                name: { required, minLength: minLength(3) },
                email: { required, email },
                password: { required, minLength: minLength(6) },
                confirmation_password: { required,  sameAs : sameAs(newPassword)},
                admin: {required}
            }
        },
        methods:{
            async handleSubmit(){
                this.v$.$touch()

                if (!this.v$.$invalid) {


                    await api.post("/users", {
                        name: this.name,
                        email: this.email,
                        password: this.password, 
                        confirmation_password: this.confirmation_password,
                        isAdmin: this.admin
                    }).
                    then(async (response) => {
                        isSuccess.value = true

                        await auth.login({
                            email: this.email,
                            password: this.password
                        });

                        this.$router.push("/reservation/new");

                    })
                    .catch((error) => {
                        console.log("Error: ", error)

                        if(error.response.status === 409){
                           this.emailApiError = true
                        }
                        else {
                            this.unexpectedApiError.value = true
                        }

                    })
                }
            }
        },
        watch: {
            password (newValue, oldValue){
                newPassword.value = newValue
            },
            email (newValue, oldValue){
                this.emailApiError = false
            },
        },
    }
</script>

<!-- lang="sass" -->

<style  scoped>

    .container{
        /* background-color: blue; */
        padding: 2rem 4rem;
        border-radius: 7px;
        border: 1px solid #CED0D4;

    }

    .icon{
        text-align: center;
    }

    main{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    svg{
        font-size: 72px;
    }

    p{
        text-align: center;
        opacity:0.9;
        margin: 1rem 0;
    }

    button{
        width: 15rem;
        height: 2rem;
        margin: 1rem 0;
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

    a{
        color: #D03D3C;
        font-weight: 700;
    }

    a:hover{
        cursor: pointer;
    }

    .error-message {
        color: red;
        font-size: 14px;
    }
    .is_admin {
        display: flex;
        align-items: center;
    }

    .is_admin > input {
        margin-left: 1rem;
    }

    .radio_text{
        font-size: 14px;
        margin-left: 3px;
    }

    @media screen and (max-width: 975px) {
        .container{
            padding: 2rem 2rem;
        }
    }

</style>