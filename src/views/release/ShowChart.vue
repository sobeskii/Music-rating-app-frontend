<template>
  <app-layout :chartsActive="true">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Best rated release chart
      </h2>
    </template>
    <div class="max-w-7xl mx-auto flex m-2 px-8 justify-start my-2 flex-wrap md:gap-5 flex-row mt-2 md:mt-4">
      <div class="flex-none w-full min-w-min my-2 md:w-9/12 justify-center sm:order-1 order-2">
      <custom-table   :hasRecords="(this.releases != null)  ? (this.releases.data.length > 0) ? true : false : false"
                      :isLoading="(this.releases == null)  ? true : false"
                      divClass="container mx-auto relative h-full"
                      :searchOptions="false"
                      errorText="There are no rated releases currently"
                      errorIcon="far fa-frown"
      >
        <template v-slot:selection>
          <select
              v-model.number="params.perPage"
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
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase md:w-1/12 w-1/12">
            #
          </th>
          <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase md:w-2/3 w-1/2">
            Release
          </th>
          <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase md:w-1/4 hidden sm:table-cell w-1/4">
            Rating count
          </th>
          <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase md:w-1/5 w-1/4">
            Rating
          </th>
          <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 md:w-1/5 w-1/5 ">
          </th>
        </template>
        <template v-slot:content>
          <template v-for="(release,index) in (this.releases != null) ? this.releases.data : []" :key="release.release.id" >
            <home-release-content :index="placementInChart(index)" :data="release"></home-release-content>
          </template>
        </template>
        <template v-if="(this.releases != null)  ? (this.releases.total > params.perPage) ? true : false : false" v-slot:pagination>
          <pagination :paginationNext="nextPage" :paginationPrevious="previousPage" >
            <template v-slot:entrycount>
              {{ parseEntryCount }}
            </template>
          </pagination>
        </template>
      </custom-table>
      </div>
      <div class="w-full md:w-1/5 flex-shrink sm:order-2 sm:my-7 order-1">
        <div class="container mx-auto">
          <div class="flex">
            <div class="w-full mx-auto">
              <accordion title="Sort By:" :selection="sortByName" :hasValue="this.params.sort_by != null">
                <span class="float-right text-xs cursor-pointer" @click="clearSortBy()" v-if="this.params.sort_by != null">
                  Clear filter
                </span>
                <div>
                  <input type="radio" class="option-input radio" name="sort_by" id="rating" :checked="this.params.sort_by == 'rating'" @click="this.sortBy('rating')" />
                  <span class="text-xs ml-1">Rating</span>
                </div>
                <div>
                  <input type="radio" class="option-input radio" name="sort_by" id="rating_count" :checked="this.params.sort_by == 'rating_count'" @click="this.sortBy('rating_count')" />
                  <span class="text-xs ml-1">Rating count</span>
                </div>
              </accordion>
              <accordion title="Record type:" :selection="TypeName" :hasValue="this.params.type != null">
                <span class="float-right text-xs cursor-pointer"  v-if="this.params.type != null" @click="clearType()">
                  Clear filter
                </span>
                <div>
                  <input type="radio" class="option-input radio" name="type" id="single" :checked="this.params.type == 'single'" @click="this.type('single')" />
                  <span class="text-xs ml-1">Single</span>
                </div>
                <div>
                  <input type="radio" class="option-input radio" name="type" id="album" :checked="this.params.type == 'album'" @click="this.type('album')" />
                  <span class="text-xs ml-1">Album</span>
                </div>
              </accordion>
              <accordion title="Release year:" :selection="formatRange" :hasValue="this.params.release_date != null">
                <span class="float-right text-xs cursor-pointer"  v-if="this.params.release_date != null" @click="clearReleaseDate()">
                  Clear filter
                </span>
                <div>
                  <div v-if="activeYear">
                    <div class="output mb-3 text-xs">Single year:</div>
                    <Slider showTooltip="drag"
                        :min="1900" :max="2022" v-model="value" tooltipPosition="bottom" @update="this.release_date(value)"/>
                  </div>
                  <div v-if="!activeYear">
                    <div class="output mb-3 text-xs">Date range:</div>
                    <Slider showTooltip="drag"
                        :min="1900" :max="2022" v-model="multiple" tooltipPosition="bottom" @update="this.release_date(multiple)"/>
                  </div>
                </div>
                <div class="mt-3">
                  <Button @click="activeYear = true" :btnClass="(!activeYear) ? 'inline-flex items-center border-black px-4 py-2 bg-white border border-transparent rounded-md font-semibold text-xs text-black uppercase tracking-widest hover:bg-gray-200 active:bg-gray-200 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray transition ease-in-out duration-150': undefined">
                    Year
                  </Button>
                  <Button class="ml-2" @click="activeYear = false" :btnClass="(activeYear) ? 'inline-flex items-center border-black px-4 py-2 bg-white border border-transparent rounded-md font-semibold text-xs text-black uppercase tracking-widest hover:bg-gray-200 active:bg-gray-200 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray transition ease-in-out duration-150': undefined">
                    Range
                  </Button>
                </div>
              </accordion>
            </div>
          </div>
        </div>
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
import Accordion from "@/components/customcomponents/Accordion";
import {mapActions, mapState} from "vuex";
import Label from "@/components/customcomponents/Label";
import Slider from '@vueform/slider'
import Button from "@/components/customcomponents/Button";

export default {
  created() {
    this.params.perPage = 15;
    this.params.page = 1;
    this.params.sort_by = (this.$route.query.sort_by != null) ? this.$route.query.sort_by : null;
    this.params.type = (this.$route.query.type != null) ? this.$route.query.type : null;
    this.params.release_date = (this.$route.query.release_date != null) ? this.$route.query.release_date : null;
    this.retrieveBestRatedReleases(this.params);
  },
  updated() {
    this.retrieveBestRatedReleases(this.params);
  },
  data() {
    return {
      params: {
        perPage: null,
        page: null,
        sort_by:  null,
        type: null,
        release_date: null,
      },
      value: 2022,
      multiple:[2000,2022],
      activeYear:true,
    }
  },
  components:{
    Button,
    Label,
    Pagination,
    CustomTable,
    HomeReleaseContent,
    NotFoundError,
    AppLayout,
    Accordion,
    Slider
  },
  methods:{
    ...mapActions(['retrieveBestRatedReleases']),
    sortBy(query){
      this.params.sort_by = query;
      let obj = [];
      this.params.page = 1
      if (this.params.type == null && this.params.release_date == null) {
        obj = {sort_by: query};
      } else if (this.params.type == null) {
        obj = {sort_by: query, release_date: this.params.release_date};
      } else if (this.params.release_date == null) {
        obj = {sort_by: query, type: this.params.type};
      } else {
        obj = {sort_by: query, type: this.params.type, release_date: this.params.release_date};
      }
      return this.$router.push({path: 'charts', query: obj});
    },
    clearSortBy(){
      this.params.sort_by = null;
      let obj = { type: this.params.type, release_date: this.params.release_date}
      return this.$router.push({path: 'charts', query: obj});
    },
    clearType(){
      this.params.type = null;
      let obj = {sort_by: this.params.sort_by,  release_date: this.params.release_date}
      return this.$router.push({path: 'charts', query: obj});
    },
    clearReleaseDate(){
      this.params.release_date = null;
      let obj = {sort_by: this.params.sort_by, type: this.params.type}
      return this.$router.push({path: 'charts', query: obj});
    },
    type(query){
      this.params.type = query;
      let obj = [];
      this.params.page = 1
      if (this.params.sort_by == null && this.params.release_date == null) {
        obj = {type: query};
      } else if (this.params.sort_by == null) {
        obj = {type: query, release_date: this.params.release_date};
      } else if (this.params.release_date == null) {
        obj = {type: query, sort_by: this.params.sort_by};
      } else {
        obj = {type: query, sort_by: this.params.sort_by, release_date: this.params.release_date};
      }
      return this.$router.push({path: 'charts', query: obj});
    },
    release_date(query) {
      this.params.release_date = query;
      let obj = [];
      this.params.page = 1
      if (this.params.sort_by == null && this.params.type == null) {
        obj = {release_date: query};
      } else if (this.params.sort_by == null) {
        obj = {release_date: query, type: this.params.type};
      } else if (this.params.type == null) {
        obj = {release_date: query, sort_by: this.params.sort_by};
      } else {
        obj = {release_date: query, sort_by: this.params.sort_by, type: this.params.type};
      }
      return this.$router.push({path: 'charts', query: obj});
    },
    changePerPage() {
      this.retrieveBestRatedReleases(this.params);
    },
    nextPage() {
      if(this.releases.current_page != this.releases.last_page){
        this.params.page = this.releases.current_page + 1;
        this.retrieveBestRatedReleases(this.params);
      }
    },
    previousPage() {
      if(this.releases.current_page != 1){
        this.params.page = this.releases.current_page - 1;
        this.retrieveBestRatedReleases(this.params);
      }
    },
    placementInChart(index){
      return index + (this.params.perPage * (this.releases.current_page - 1));
    }
  },
  computed:{
    ...mapState({
      releases: state => state.release.releases.releases,
    }),
    parseEntryCount(){
      let entryLimit = (this.params.perPage * this.releases.current_page);
      entryLimit = (entryLimit > this.releases.total) ? this.releases.total : entryLimit;
      return "Showing " +
          parseInt( (this.params.perPage * (this.releases.current_page - 1)  + 1) ) +" to " +
          entryLimit + " of "+ this.releases.total;
    },
    sortByName(){
      if(this.params.sort_by == 'rating_count'){
        return 'Rating count';
      }
      else if(this.params.sort_by == 'rating'){
        return 'Rating';
      }
    },
    TypeName() {
      if (this.params.sort_by == 'album') {
        return 'Album';
      } else if (this.params.sort_by == 'single') {
        return 'Single';
      }
    },
    formatRange(){
      if(Array.isArray(this.params.release_date)){
        return this.params.release_date[0]+ " to "+ this.params.release_date[1];
      } else{
        return this.params.release_date;
      }
    }
  },
}
</script>
<style src="@vueform/slider/themes/default.css"></style>
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
.option-input {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -o-appearance: none;
    appearance: none;
    position: relative;
    right: 0;
    bottom: 0;
    left: 0;
    height: 20px;
    width: 20px;
    transition: all 0.15s ease-out 0s;
    background: #cbd1d8;
    border: none;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    outline: none;
    position: relative;
    z-index: 1000;
  }
.option-input:checked {
  background: #039669;
}
.option-input:focus{
  background: #039669;
}
.option-input:hover{
  background: #039669;
}
.option-input:checked::before {
  width: 20px;
  height: 20px;
  display:flex;
  margin-top: 1px;
  content: '\f00c';
  font-size: 10px;
  font-weight:bold;
  position: absolute;
  align-items:center;
  justify-content:center;
  background: #039669;
  border-radius: 50%;
  font-family:'Font Awesome 5 Free';
}
.option-input:checked::after {
  -webkit-animation: click-wave 0.65s;
  -moz-animation: click-wave 0.65s;
  animation: click-wave 0.65s;
  content: '';
  display: block;
  position: relative;
  z-index: 100;
}
.option-input.radio {
  border-radius: 50%;
}
.option-input.radio::after {
  border-radius: 50%;
}
</style>
