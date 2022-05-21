<template>
  <app-layout :adminPanelActive="true">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Flagged reviews
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
                        <i class="lg:text-base text-xs flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-users"></i>
                        <span class="lg:text-base text-xs flex-1 ml-3 whitespace-nowrap">Users</span>
                      </router-link>
                    </li>
                    <li>
                      <router-link :to="{name : 'flagged'}" class="flex items-center p-2
                              text-white bg-green-500
                              text-base font-normal rounded-lg">
                        <i class="lg:text-base text-xs flex-shrink-0 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-asterisk"></i>
                        <span class="lg:text-base text-xs flex-1 ml-3 whitespace-nowrap"> Flagged reviews</span>
                      </router-link>
                    </li>
                    <li>
                      <router-link :to="{name : 'rules'}" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="lg:text-base text-xs flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-scroll"></i>
                        <span class="lg:text-base text-xs flex-1 ml-3 whitespace-nowrap">Moderation rules</span>
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
      <custom-table   :hasRecords="(this.reviews != null)  ? (reviews.data.length > 0) ? true : false : false"
                      :isLoading="(this.reviews == null)  ? true : false"
                      divClass="container mx-auto relative h-full"
                      :searchOptions="true"
                      errorText="There are no reviews"
                      errorIcon="far fa-frown"
      >
        <template v-slot:search_input>
                    <span class="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current text-gray-500">
                            <path
                                d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                            </path>
                        </svg>
                    </span>
          <input placeholder="Search"
                 class="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                 type="text"
                 v-model="params.term"
                 @keyup="search"
                 id="search"
          />
        </template>
        <template v-slot:selection>
          <select
              v-model.number="this.params.perPage"
              @change=changePerPage()
              class="appearance-none h-full rounded-l border block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
            <option>5</option>
            <option>10</option>
            <option>15</option>
            <option>20</option>
          </select>
        </template>
        <template v-slot:head >
          <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 hidden sm:table-cell uppercase md:w-2/12 w-1/6">
            Username
          </th>
          <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold hidden lg:table-cell text-gray-600  uppercase md:w-1/5 w-1/4">
            Flag time
          </th>
          <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 hidden sm:table-cell uppercase lg:w-1/6 w-1/4">
            Flag reason
          </th>
          <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 hidden sm:table-cell uppercase lg:w-1/6 w-1/4">
            Has been muted
          </th>
          <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase lg:w-1/4 w-1/5">
            Review
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase lg:w-1/5 w-1/3">
            Action
          </th>
        </template>
        <template v-slot:content>
          <template v-for="(review) in reviews.data" :key="review.id" >
            <flagged-review-item :data="review" />
          </template>
        </template>
        <template v-if="(this.reviews != null)  ? (reviews.total > params.perPage) ? true : false : false" v-slot:pagination>
          <pagination :paginationNext="nextPage" :paginationPrevious="previousPage" >
          </pagination>
        </template>
      </custom-table>
      </div>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '../../AppLayout'
import Pagination from '../../components/customcomponents/Pagination'
import CustomTable from '../../components/customcomponents/Table'
import AdminTableItem from '../../components/customcomponents/AdminTableItem'
import {mapActions, mapState} from "vuex";
import {throttle} from "@/helpers";
import FlaggedReviewItem from "@/components/customcomponents/FlaggedReviewItem";

export default {
  created() {
    this.params.term = "";
    this.params.perPage = 15;
    this.params.page = 1;
    this.retrieveFlaggedReviewList(this.params);
  },
  updated() {
    this.retrieveFlaggedReviewList(this.params);
  },
  data() {
    return {
      params: {
        term: null,
        perPage: null,
        page: null,
      }
    }
  },
  components: {
    FlaggedReviewItem,
    AppLayout,
    Pagination,
    CustomTable,
    AdminTableItem,
  },
  methods:{
    search() {
      this.params.offset = 0
      throttle(this.retrieveFlaggedReviewList(this.params), 200);
    },
    changePerPage() {
      this.retrieveFlaggedReviewList(this.params);
    },
    nextPage() {
      if(this.reviews.current_page != this.reviews.last_page){
        this.params.page = this.reviews.current_page + 1;
        this.retrieveFlaggedReviewList(this.params);
      }
    },
    previousPage() {
      if(this.reviews.current_page != 1){
        this.params.page = this.reviews.current_page - 1;
        this.retrieveFlaggedReviewList(this.params);
      }
    },
    ...mapActions(['retrieveFlaggedReviewList']),
  },
  computed:{
    parseEntryCount(){
      let entryLimit = (this.request_items.perPage * this.reviews.current_page);
      entryLimit = (entryLimit > this.reviews.total) ? this.reviews.total : entryLimit;
      return "Showing " +
          parseInt( (this.params.perPage * (this.reviews.current_page - 1)  + 1) ) +" to " +
          entryLimit + " of "+ this.reviews.total;
    },
    ...mapState({
      reviews: state => state.rating.user_ratings.reviews,
      request_items: state => state.rating.user_ratings.request_items,
    }),
  }
}
</script>

