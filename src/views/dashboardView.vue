<template>
    <main>
        <div>
            <h1> Para onde deseja prosseguir? </h1>
            <a href="/reservation/new"> <Button class="reservation"> REALIZAR RESERVA </Button></a>
            <a href="/admin/painel"> <Button class="painel"> PAINEL ADMINISTRATIVO </Button></a>

        </div>
    </main>
</template>


<script>

    import {useAuthStore} from "../stores/AuthStore"
    const auth = useAuthStore();


    export default{
        name: "Dashboard",
        components: {
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
            this.$router.push("/reservation/new");
            }
        }
    }
</script>

<style  scoped>

    .container{
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

    div{
        display: block;
        text-align: center;
    }

    h1{
        font-size: 24px;
        text-align: center;
        margin: 1rem 0;
        color: #343A40;
    }

    button{
        width: 15rem;
        height: 3rem;
        margin: 1rem auto;
        font-size: 14px;
        border-radius: 50px;
        color: white;

        outline: none;
        border: none;
    }

    button.reservation{
        background-color: #F26153;

    }

    button.painel{
        background-color: #878787;
    }

    button:hover{
        cursor: pointer;
        opacity: 0.8;
    }    

    a{
        display: block;
        color: #D03D3C;
        font-weight: 700;
    }

    a:hover{
        cursor: pointer;
    }

</style>