<template>
    <main>
        <form class="container" @submit.prevent="handleSubmit" >

            <div class="icon">
                <Silverware fillColor="#F26153" :size="48" />
            </div>
                

            <p> Faça login para realizar sua reserva</p>

            <Input label="E-mail" name="email" type="email" v-model.trim="email" @input="$event => email = $event.target.value" />

            <Input label="Senha" name="password" type="password" v-model.trim="password" @input="$event => password = $event.target.value" />


            <button type="submit"> ENTRAR</button>


            <p>Não tem uma conta?  <a href="signup"> Cadastre-se </a></p>

        </form>
    </main>
</template>


<script>
    import Input from "@/components/form/input.vue"
    import Silverware  from 'vue-material-design-icons/Silverware.vue';
    import {useAuthStore} from "../stores/AuthStore"


    const auth = useAuthStore();


    export default{
        name: "SignIn",
        components: {
            Input ,
            Silverware 
        },
        data: () => {
            return{
                email: "",
                password: "",
            }
        },
        methods:{
           async handleSubmit(e){
        
            await auth.login({
                email: this.email,
                password: this.password
            })

            const user = JSON.parse([localStorage.getItem("restaurant-challenge.user")]);

            if (user.isAdmin === true) {
                return this.$router.push("/dashboard");
            }

                this.$router.push("/reservation/new");
            }
        }
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

    @media screen and (max-width: 975px) {
        .container{
            padding: 2rem 2rem;
        }
    }

</style>