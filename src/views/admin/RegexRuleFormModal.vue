<template>
  <jet-modal :show="show" :closeable="closeable" @close="close">
    <slot name="title">
    </slot>

    <div class="p-5">
      <h1 class="font-semibold text-xl text-gray-800 leading-tight mb-3">
         Edit regex rule
      </h1>
      <form @submit.prevent="edit" v-if="data != null">
        <div>
          <jet-label for="name" value="Rule name:" />
          <jet-input id="name" type="text" class="mt-1 block w-full" placeholder="Enter rule name" v-model="this.name" required autofocus />
        </div>

        <div>
          <jet-label for="reason" value="Reason text" />
          <jet-input id="reason" type="text" class="mt-1 block w-full" placeholder="Enter reason" v-model="this.reason" required autofocus />
        </div>

        <div class="form-check">
          <input class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                 type="checkbox" value="" id="flexCheckChecked" v-model="checked">
          <label class="form-check-label inline-block text-gray-800" for="flexCheckChecked">
            Mutes user
          </label>
        </div>

        <div v-if="checked">
          <div>
            <jet-label for="time" value="Select mute duration:" />
            <select
                v-model.number="this.muteTime"
                id="time"
                class="appearance-none mt-1 h-full rounded-l border block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
              <option value="5">5 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="1440">1 day</option>
              <option value="10080">1 week</option>
              <option value="-1"> Forever </option>
            </select>
          </div>
          <div>
            <jet-label for="time" value="Trigger mute after rule count:" />
            <input
                class=" form-control
                        block
                        px-3
                        py-1.5
                        text-base
                        font-normal
                        text-gray-700
                        bg-white bg-clip-padding
                        border border-solid border-gray-300
                        rounded
                        transition
                        ease-in-out
                        m-0
                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                type="number" v-model.number="this.matches" name="matches" min="1" max="50">
          </div>
        </div>


        <div class="flex items-center justify-end mt-4">
          <jet-button class="ml-4" >
            Edit
          </jet-button>
        </div>
      </form>
    </div>
  </jet-modal>
</template>

<script>
import JetButton from '../../components/customcomponents/Button'
import JetInput from '../../components/customcomponents/Input'
import JetLabel from '../../components/customcomponents/Label'
import JetModal from '../../components/customcomponents/Modal.vue'
import {mapActions} from "vuex";

export default {
  emits: ['close'],
  updated() {
    if(this.data != null ){
      if(this.data.length != 0){
        this.name = this.data.name;
        this.reason = this.data.reason;
        if(this.data.detect_after_count != null){
          this.checked = true;
          this.muteTime = this.data.mute_minutes;
          this.matches = this.data.detect_after_count;
        }
        else {
          this.checked = false
        }
      }
    }
  },
  components: {
    JetButton,
    JetInput,
    JetLabel,
    JetModal,
  },
  props: {
    show: {
      default: false
    },
    closeable: {
      default: true
    },
    data:{
      type:Object,
      default: [],
    }
  },
  data() {
    return {
      name: null,
      reason: null,
      muteTime: 30,
      checked: false,
      matches: 1,
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    edit(){
      this.editRule(
          {
            name: this.name,
            reason: this.reason,
            id: this.data.id,
            detect_after_count: (this.checked) ? this.matches  : null,
            mute_minutes: (this.checked) ? this.muteTime : null,
          }
      );
      this.close();
    },
    ...mapActions(['editRule']),
  }
}
</script>
