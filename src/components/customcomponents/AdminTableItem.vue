<template>
  <tr>
    <td class="px-5 py-5 border-b border-gray-200 hidden sm:table-cell bg-white text-sm">
      <p class="text-gray-900 whitespace-no-wrap">{{ data.id }}</p>

    </td>
    <td class="px-5 py-5 border-b border-gray-200 lg:text-lg text-sm bg-white ">
      <router-link :to="{ name: 'user_profile', params: { id: data.id }}" class="text-gray-900 whitespace-no-wrap">
        {{ data.name }}
      </router-link>
    </td>
    <td class="px-5 py-5 border-b border-gray-200 bg-white hidden sm:table-cell text-sm">
      <pill :text="(!this.data.muted) ? data.role.role.toUpperCase() : 'MUTED'" :color="pillColor"></pill>
    </td>
    <td class="px-5 py-5 border-b border-gray-200 bg-white hidden lg:table-cell text-sm">
      <p class="capitalize text-gray-900 whitespace-no-wrap">{{ formatDate }}</p>
    </td>
    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
      <template v-if="this.data.role.role != 'admin'">
        <jet-button v-if="!data.muted"
                    @click="confirmingUserMute = true"
                    btnClass="inline-flex items-center w-28 md:w-32  sm:my-1 justify-center px-2 py-1 bg-yellow-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-300 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-600 transition ease-in-out duration-150">
          <i class="fas fa-volume-mute"></i>&nbsp;Mute
        </jet-button>
        <jet-button v-else
                    @click="confirmingUserUnmute = true"
                    btnClass="inline-flex items-center w-28 md:w-32 sm:my-1 justify-center px-2 py-1 bg-yellow-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-300 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-600 transition ease-in-out duration-150">
          <i class="fas fa-volume-down"></i>&nbsp;Unmute
        </jet-button>
      </template>
      &nbsp
      <jet-button v-if="data.role.role == 'user'"
                  @click="confirmingUserBan = true"
                  btnClass="inline-flex items-center w-28 md:w-32 justify-center sm:my-1 px-2 py-1 bg-red-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-300 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-600 transition ease-in-out duration-150">
        <i class="fas fa-lock"></i>&nbsp;Ban
      </jet-button>
      <jet-button v-if="data.role.role == 'banned'"
                  @click="confirmingUserUnban = true"
                  btnClass="inline-flex items-center w-28 md:w-32 justify-center sm:my-1 px-2 sm:py-1 bg-green-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gren-300 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-600 transition ease-in-out duration-150">
        <i class="fas fa-lock-open"></i>&nbsp;Unban
      </jet-button>
    </td>
  </tr>
  <!-- Ban Account Confirmation Modal -->
  <jet-dialog-modal :show="confirmingUserBan" @close="confirmingUserBan">
    <template #title>
      Ban Account
    </template>

    <template #content>
      Are you sure you want to ban this user?
    </template>

    <template #footer>
      <jet-secondary-button @click="confirmingUserBan = false">
        Cancel
      </jet-secondary-button>
      <jet-danger-button class="ml-2" @click="handleBan(this.data.id)">
        Ban user
      </jet-danger-button>
    </template>
  </jet-dialog-modal>
  <!-- Unban Account Confirmation Modal -->
  <jet-dialog-modal :show="confirmingUserUnban" @close="confirmingUserUnban">
    <template #title>
      Unban Account
    </template>

    <template #content>
      Are you sure you want to unban this user?
    </template>

    <template #footer>
      <jet-secondary-button @click="confirmingUserUnban = false">
        Cancel
      </jet-secondary-button>
      <jet-button
          btnClass="inline-flex items-center  ml-2 justify-center px-4 py-2 bg-green-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gren-300 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-600 transition ease-in-out duration-150"
          @click="handleUnban(this.data.id)">
        Unban user
      </jet-button>
    </template>
  </jet-dialog-modal>
  <!-- Mute Account Confirmation Modal -->
  <jet-dialog-modal v-if="this.data.role.role != 'admin'" :show="confirmingUserMute" @close="confirmingUserMute">
    <template #title>
      Mute User
    </template>
    <template #content>
      <label for="time">Select mute duration:</label>
      <select
          v-model.number="this.muteTime"
          id="time"
          class="appearance-none mt-1 h-full rounded-l border block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
        <option value="30">30 minutes</option>
        <option value="60">1 hour</option>
        <option value="1440">1 day</option>
        <option value="10080">1 week</option>
        <option value="-1"> Forever</option>
      </select>
      <label for="reason">Mute reason: </label>
      <textarea placeholder="Write your mute reason here" v-model="reason" required rows="5" class='w-full' id="reason" name="reason">
      </textarea>
    </template>
    <template #footer>
      <jet-secondary-button @click="confirmingUserMute = false">
        Cancel
      </jet-secondary-button>
      <jet-button
          :disabled="(this.reason == null || this.reason == '')? true : false"
          btnClass="disabled:opacity-25 inline-flex items-center ml-2 justify-center px-4 py-2 bg-yellow-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gren-300 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-600 transition ease-in-out duration-150"
          @click="handleMuteUser(this.data.id)">
        Mute user
      </jet-button>
    </template>
  </jet-dialog-modal>
  <!-- Unmute Account Confirmation Modal -->
  <jet-dialog-modal :show="confirmingUserUnmute" @close="confirmingUserUnmute">
    <template #title>
      Mute User
    </template>
    <template #content>
      Are you want to unmute this user?
    </template>
    <template #footer>
      <jet-secondary-button @click="confirmingUserUnmute = false">
        Cancel
      </jet-secondary-button>
      <jet-button
          btnClass="inline-flex items-center ml-2 justify-center px-4 py-2 bg-yellow-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gren-300 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-600 transition ease-in-out duration-150"
          @click="handleUnmuteUser(this.data.id)">
        Unmute user
      </jet-button>
    </template>
  </jet-dialog-modal>
</template>
<script>
import JetButton from './Button'
import JetDialogModal from './DialogModal'
import JetDangerButton from './DangerButton'
import JetSecondaryButton from './SecondaryButton'
import Pill from "@/components/customcomponents/Pill";
import {mapActions} from "vuex";

export default {
  components: {
    JetButton,
    JetDialogModal,
    JetDangerButton,
    JetSecondaryButton,
    Pill
  },
  data() {
    return {
      confirmingUserBan: false,
      confirmingUserUnban: false,
      confirmingUserUnmute: false,
      confirmingUserMute: false,
      muteTime: 30,
      reason: null,
    }
  },
  props: {
    data: Object
  },
  methods: {
    ...mapActions(['banUser', 'unbanUser', 'muteUser', 'unmuteUser']),
    handleMuteUser(id) {
      this.muteUser({id: id, time: this.muteTime,mute_reason:this.reason})
      this.confirmingUserMute = false
    },
    handleUnmuteUser(id) {
      this.unmuteUser({id: id, time: this.muteTime})
      this.confirmingUserUnmute = false
    },
    handleBan(id) {
      this.banUser(id)
      this.confirmingUserBan = false
    },
    handleUnban(id) {
      this.unbanUser(id)
      this.confirmingUserUnban = false
    },

  },
  computed: {
    formatDate() {
      return new Date(this.data.created_at).toJSON().slice(0, 19).replace('T', ' ')
    },
    pillColor() {
      if(!this.data.muted) {
        switch (this.data.role.role) {
          case "banned":
            return "bg-red-600"
            break;
          case "admin":
            return "bg-blue-600"
            break;
          default:
            return "bg-green-600"
        }
      } else{
        return "bg-yellow-600"
      }
    }
  }
}
</script>
