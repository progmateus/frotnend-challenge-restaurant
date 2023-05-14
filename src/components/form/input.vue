<template>
            <div>
                <label> {{ label }}</label>
                <input :type="type" :id="name" :name="name" v-bind="$attrs" />
                <!-- <button @click="create"> Blalalal</button> -->

                <!-- <div class="error-message" v-if="v$.name.$error"> Min 3 caracteres.</div> -->

                <!-- <div class="error-message" v-bind="$attrs"> Min 3 caracteres.</div> -->

            </div>
</template>


<script>

    export default{
        name: "Input",
        props:{
            name:  String,
            type: String,
            label: String,
        },
    }
</script>

<style scoped>

    div{
        display: flex;
        flex-direction: column;
        margin: 0.5rem 0

    }

    label{
        font-size: 14px;
    }


    input{
        width: 15rem;
        height: 2rem;

        border-radius: 5px;
        border: 1px solid #CED0D4;
        background-color: #E4E6EA;
        padding: 0 5px;

    }

    input:focus{
        border: 1px solid #96A0B6;
        outline: none;
    }


    input.error{
        border-color: red;
    }

    

</style>