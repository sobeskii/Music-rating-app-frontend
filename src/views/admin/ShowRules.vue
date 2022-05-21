<template>
  <app-layout>
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Review moderation rules
      </h2>
    </template>
    <div class="max-w-7xl mx-auto flex m-2 px-3 justify-start my-2 flex-wrap md:gap-0 flex-row mt-2 md:mt-4">
      <div class="w-full md:w-1/5 flex-shrink">
        <div class="container mx-auto">
          <div class="flex">
            <div class="w-full mx-auto">
              <div class="mb-4 px-10">
              </div>
              <div class="mb-4">
                <div class="text-xl md:text-2xl text-center font-medium text-grey-darkest">
                </div>
              </div>
              <aside class="w-full ml-auto" aria-label="Sidebar">
                <div class="overflow-y-auto py-4 px-3 bg-white rounded dark:bg-gray-800">
                  <ul class="space-y-2">
                    <li>
                      <router-link :to="{name : 'admin'}" class=
                          "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="flex-shrink-0 lg:text-base text-xs text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-users"></i>
                        <span class="flex-1 ml-3 whitespace-nowrap lg:text-base text-xs">Users</span>
                      </router-link>
                    </li>
                    <li>
                      <router-link :to="{name : 'flagged'}" class=
                          "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="flex-shrink-0 lg:text-base text-xs text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-asterisk"></i>
                        <span class="flex-1 ml-3 whitespace-nowrap lg:text-base text-xs"> Flagged reviews</span>
                      </router-link>
                    </li>
                    <li>
                      <router-link :to="{name : 'rules'}" class="
                      flex items-center p-2
                              text-white bg-green-500
                              text-base font-normal rounded-lg">
                        <i class="flex-shrink-0 lg:text-base text-xs text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-scroll"></i>
                        <span class="flex-1 ml-3 whitespace-nowrap lg:text-base text-xs">Moderation rules</span>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-none w-full min-w-min my-2 md:w-9/12 justify-center">
      <custom-table   :hasRecords="(this.rules.data != null)  ? (this.rules.data.length > 0) ? true : false : false"
                      :isLoading="(this.rules == null)  ? true : false"
                      divClass="container mx-auto relative h-full"
                      :searchOptions="false"
                      errorText="There are no rules currently"
                      errorIcon="far fa-frown"
      >

        <template v-slot:head >
          <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase md:w-1/3 w-1/3">
            Rule name
          </th>
          <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase md:w-1/3 hidden sm:table-cell w-1/4">
            Active
          </th>
          <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase md:w-1/4 w-1/5">
            Action
          </th>
        </template>
        <template v-slot:selection>

        </template>
        <template v-slot:content>
          <template v-for="(rule,index) in (this.rules.data != null) ? this.rules.data : []" :key="rule.id" >
            <rule-table-item :data="rule" />
          </template>
        </template>
        <template v-if="(this.rules != null)  ? (this.rules.total > params.perPage) ? true : false : false" v-slot:pagination>
          <pagination :paginationNext="nextPage" :paginationPrevious="previousPage" >
            <template v-slot:entrycount>
            </template>
          </pagination>
        </template>
      </custom-table>
      </div>
    </div>
  </app-layout>
</template>
<script>

import HomeReleaseContent from '../../components/customcomponents/HomePageTableContent'
import AppLayout from '../../AppLayout'
import Pagination from '../../components/customcomponents/Pagination'
import CustomTable from '../../components/customcomponents/Table'
import NotFoundError from '../../components/customcomponents/NotFoundError'
import RuleTableItem from "@/components/customcomponents/RuleTableItem";
import JetButton from "@/components/customcomponents/Button";
import RegexRuleFormModal from "@/views/admin/RegexRuleFormModal";
import {mapActions, mapState} from "vuex";

export default {
  created() {
    this.params.perPage = 15;
    this.params.page = 1;
    this.retrieveRuleList(this.params);
  },
  data() {
    return {
      params: {
        perPage: null,
        page: null,
      },
      addRuleModalOpen: false,
    }
  },
  components:{
    Pagination,
    CustomTable,
    HomeReleaseContent,
    NotFoundError,
    AppLayout,
    RuleTableItem,
    JetButton,
    RegexRuleFormModal
  },
  methods:{
    ...mapActions(['retrieveRuleList']),
    changePerPage() {
      this.retrieveRuleList(this.params);
    },
    nextPage() {
      if(this.rules.current_page != this.rules.last_page){
        this.params.page = this.rules.current_page + 1;
        this.retrieveRuleList(this.params);
      }
    },
    previousPage() {
      if(this.rules.current_page != 1){
        this.params.page = this.rules.current_page - 1;
        this.retrieveRuleList(this.params);
      }
    },
    close(){
      this.addRuleModalOpen = false;
    }
  },
  computed:{
    ...mapState({
      rules: state => state.admin.rules,
    }),
  },
}
</script>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
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
