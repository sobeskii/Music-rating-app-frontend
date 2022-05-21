<template>
  <tr>
    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
      <p class="text-gray-900 whitespace-no-wrap">{{ data.name }}</p>
    </td>
    <td class="px-5 py-5 border-b border-gray-200 bg-white uppercase hidden md:table-cell text-sm">
      <pill :text="(data.active) ? 'Active' : 'Deactivated'" :color="(data.active) ? 'bg-green-500' : 'bg-red-500'" />
    </td>
    <td class="px-5 py-5 border-b border-gray-200 lg:text-lg text-sm bg-white">
      <jet-button @click="editRuleModalOpen = true"
                  btnClass="inline-flex w-28 md:w-32 items-center justify-center px-2 py-1 bg-blue-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-300 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-600 transition ease-in-out duration-150">
        <i class="fas fa-cog"></i>&nbsp;Settings
      </jet-button> &nbsp;&nbsp;
      <jet-button v-if="!this.data.active"
                  @click="activateRuleConfirm = true"
                  btnClass="inline-flex w-28 md:w-32 items-center justify-center px-2 py-1 bg-green-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-300 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-600 transition ease-in-out duration-150">
        <i class="fas fa-check"></i>&nbsp;Activate
      </jet-button>
      <jet-button v-else
                  @click="deactivateRuleConfirm = true"
                  btnClass="inline-flex w-28 md:w-32 items-center justify-center px-2 py-1 bg-yellow-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-300 focus:outline-none focus:border-yellow-700 focus:shadow-outline-yellow active:bg-yellow-600 transition ease-in-out duration-150">
        <i class="fas fa-triangle-exclamation"></i>&nbsp;Deactivate
      </jet-button>
    </td>
  </tr>
  <template v-if="data.strategy == 'regex'">
    <regex-rule-form-modal :data="data" :show="editRuleModalOpen" @close="close()">
      <template #title>
        <button
            type="button"
            class="btn-close mr-2 -mt-2"
            @click="editRuleModalOpen = false"
            aria-label="Close modal">
          x
        </button>
      </template>
    </regex-rule-form-modal>
  </template>
  <template v-else-if="data.strategy == 'classifier'">
    <classifier-rule-form-modal :data="data" :show="editRuleModalOpen" @close="close()">
      <template #title>
        <button
            type="button"
            class="btn-close mr-2 -mt-2"
            @click="editRuleModalOpen = false"
            aria-label="Close modal">
          x
        </button>
      </template>
    </classifier-rule-form-modal>
  </template>

  <!-- Activate Modal -->
  <jet-dialog-modal :show="activateRuleConfirm" @close="activateRuleConfirm">
    <template #title>
      Activate rule
    </template>

    <template #content>
      Do you want to activate this rule?
    </template>

    <template #footer>
      <jet-secondary-button @click="activateRuleConfirm = false">
        Cancel
      </jet-secondary-button>
      <jet-button btnClass="inline-flex items-center ml-2  justify-center px-4 py-2 bg-green-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gren-300 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-600 transition ease-in-out duration-150"
                  @click="handleActivate(this.data.id)">
        Activate rule
      </jet-button>
    </template>
  </jet-dialog-modal>

  <!-- Deactivate Modal -->
  <jet-dialog-modal :show="deactivateRuleConfirm" @close="deactivateRuleConfirm">
    <template #title>
      Deactivate rule
    </template>

    <template #content>
      Do you want to deactivate this rule?
    </template>

    <template #footer>
      <jet-secondary-button @click="deactivateRuleConfirm = false">
        Cancel
      </jet-secondary-button>
      <jet-button btnClass="inline-flex items-center ml-2  justify-center px-4 py-2 bg-yellow-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-300 focus:outline-none focus:border-yellow-700 focus:shadow-outline-yellow active:bg-yellow-600 transition ease-in-out duration-150"
                  @click="handleDeactivate(this.data.id)">
        Deactivate rule
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
import RegexRuleFormModal from "@/views/admin/RegexRuleFormModal";
import {mapActions} from "vuex";
import ClassifierRuleFormModal from "@/views/admin/ClassifierRuleFormModal";
export default {
  mounted() {

  },
  components: {
    ClassifierRuleFormModal,
    Pill,
    JetButton,
    JetDialogModal,
    JetDangerButton,
    JetSecondaryButton,
    RegexRuleFormModal,
  },
  data() {
    return {
      editRuleModalOpen: false,
      activateRuleConfirm: false,
      confirmingDeleteConfirm: false,
      deactivateRuleConfirm: false
    }
  },
  props:{
    data:Object
  },
  methods:{
    close(){
      this.editRuleModalOpen = false;
    },
    handleActivate(id){
      this.editRule({
        name: this.data.name,
        reason: this.data.reason,
        id: id,
        active: true
      });
      this.activateRuleConfirm = false
    },
    handleDeactivate(id){
      this.editRule({
        name: this.data.name,
        reason: this.data.reason,
        id: id,
        active: false
      });
      this.deactivateRuleConfirm = false
    },
    handleDelete(id){
      this.removeRule(id);
      this.confirmingDeleteConfirm = false
    },
    ...mapActions(['removeRule','removeFlaggedReview','editRule'])
  },
  computed:{

  }
}
</script>
<style scoped>
.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  background: transparent;
}
</style>