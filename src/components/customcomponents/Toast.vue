<template>
    <div class="flex w-full mt-4 mr-4 rounded shadow p-4"   :class="[(isError    ?   'bg-red-600' : 'bg-green-600'),
                                                                     cancelled   ?   'hidden' : '']">
        <div class="mr-2 text-white">
            <font-awesome-icon :icon="['fa',isError ? 'exclamation-triangle' : 'check']"> </font-awesome-icon>

        </div>
        <div class="flex-1 text-white">
          <template v-if="Array.isArray(message)">
            {{ message[0] }}
          </template>
          <template v-else>
            {{ message }}
          </template>
        </div>
        <div class="ml-2">
            <button @click="setInvisible()" class="align-top text-white hover:text-gray-700 focus:outline-none focus:text-gray-800">
                <font-awesome-icon :icon="['fa','times']"> </font-awesome-icon>
            </button>
        </div>
    </div>
</template>
<script>
    export default{
        props: {
            message: {
              default:''
            },
            isError:{
                type:Boolean,
                default:false,
            }
        },
        data(){
            return {
                cancelled:false,
            }
        },
        methods:{
            setInvisible(){
                this.cancelled = true;

                if(this.cancelled){
                    clearTimeout(this.cancelled);
                }
                this.cancelled = setTimeout(()=> this.cancelled = false, 1500);
            }
        }
    }
</script>

