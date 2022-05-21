<template>
  <app-layout>
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Profile
      </h2>
    </template>
    <div>
      <div class="max-w-7xl mx-auto flex m-2 px-3 justify-start my-2 flex-wrap md:gap-8 flex-row mt-2 md:mt-4">
        <template v-if="this.user != null">
          <div class="w-full md:w-1/5 flex-shrink">
            <div class="container mx-auto">
              <div class="flex">
                <div class="w-full mx-auto">
                  <div class="mb-4 px-10">
                    <img
                        class="rounded-full mx-auto"
                        :src="this.user && this.user.spotify_avatar ? this.user.spotify_avatar : getImages('loading-asset-alternate.svg')">
                  </div>
                  <div class="mb-4">
                    <div class="text-xl md:text-2xl text-center font-medium text-grey-darkest">
                      {{ this.user.name }}
                    </div>
                  </div>
                  <aside class="w-full ml-auto" aria-label="Sidebar">
                    <div class="overflow-y-auto py-4 px-3 bg-white rounded dark:bg-gray-800">
                      <ul class="space-y-2">
                        <li>
                          <router-link :to="{name:'user_profile',params: { id: this.$route.params.id }}" class=
                              "flex items-center p-2
                              text-white bg-green-500
                              text-base font-normal rounded-lg">
                            <i class="lg:text-base text-xs flex-shrink-0 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-user"></i>
                            <span class="lg:text-base text-xs flex-1 ml-3 whitespace-nowrap">Profile</span>
                          </router-link>
                        </li>
                        <li>
                          <router-link :to="{name:'user_reactions',params: { id: this.$route.params.id }}" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i class="lg:text-base text-xs flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-thumbs-up"></i>
                            <span class="lg:text-base text-xs flex-1 ml-3 whitespace-nowrap">User reactions</span>
                          </router-link>
                        </li>
                        <li>
                          <router-link :to="{name:'user_ratings',params: { id: this.$route.params.id }}" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i class="lg:text-base text-xs flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-star"></i>
                            <span class="lg:text-base text-xs flex-1 ml-3 whitespace-nowrap">Reviews and ratings</span>
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
            <template v-if="this.getUserData != null">
              <template v-if="this.getUserData.user_id == this.$route.params.id">
               <template v-if="artists != null">
                <template v-if="artists.length > 0">
                  <p class="text-base md:text-xl mb-2">Most listened artists <span class="md:text-xl text-xs">(last 6 months)</span> :</p>
                  <div class="grid mb-4 sm:grid-cols-4 grid-cols-2 gap-x-0.5 gap-y-1">
                    <template v-for="index in 8" :key="index">
                      <top-artist-item :data="this.artists[index-1]" :index="index-1" />
                    </template>
                  </div>
                </template>
               </template>
              </template>
            </template>
            <template v-if="rating.decades != null">
            <div v-if="rating.decades.length > 0 || checkRatingSum">
              <p class="text-base md:text-xl mb-2">User rating statistics:</p>
              <div class="sm:grid sm:grid-cols-2 sm:grid-rows-3 mx-auto">
                <div>
                  <p class="text-sm md:text-base mb-2">Rating distribution by decade :</p>
                  <div class="w-56 h-56 mx-auto">
                    <Pie :chart-data="this.buildPieData" :chart-options="{ plugins: { legend: { position: 'bottom'} }}" />
                  </div>
                </div>
                <div class="w-5/6 h-5/6">
                  <p class="text-sm md:text-base mb-2">Rating distribution:</p>
                  <Bar class="mt-8" :height="200" :chart-options="{ plugins: { legend: {display: false} }}" :chart-data="this.buildBarData"/>
                </div>
              </div>
            </div>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="mx-auto text-center content-center">
            <bullet-list-loader viewBox="-20 0 300 150" :speed="2"/>
          </div>
        </template>
      </div>
    </div>
  </app-layout>
</template>

<script>

import AppLayout from '../../AppLayout'
import JetNavLink from '../../components/customcomponents/NavLink'
import {mapActions, mapGetters, mapState} from "vuex";
import {BulletListLoader} from "vue-content-loader";
import TopArtistItem from "@/components/customcomponents/TopArtistItem";
import NotFoundError from "@/components/customcomponents/NotFoundError";
import {Chart as ChartJS, Title, Tooltip, ArcElement, CategoryScale, Legend} from 'chart.js'
ChartJS.register(Title, Tooltip, ArcElement, CategoryScale,Legend)
import {Pie} from 'vue-chartjs'
import {Bar} from "vue-chartjs";

export default {
  created() {
    this.getUserProfile(this.$route.params.id);
  },
  methods: {
    ...mapActions(['getUserProfile']),
    getImages(img) {
      return `/${img}`;
    },
    randomColor(){
      return '#'+Math.floor(Math.random()*16777215).toString(16);
    },
  },
  data() {
  },
  computed: {
    ...mapState({
      user: state => state.user.profile,
      artists: state => state.artist.artists,
      rating: state => state.rating.profile_rating,
    }),
    ...mapGetters(['getUserData']),
    buildBarData() {
      return {
        labels: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
        datasets: [{
          data: this.rating.distribution,
          backgroundColor: '#FFD73D',
        }]
      }
    },
    buildPieData(){
      if(this.rating.decades != null) {
        let labels = [];
        let data = [];
        let backgroundColor = [];
        for (let i = 0; i < this.rating.decades.length; i++) {
          labels.push(this.rating.decades[i]['decade'] * 10 );
          data.push(this.rating.decades[i]['count']);
          backgroundColor.push(this.randomColor());
        }
        return {labels: labels, datasets: [{data: data, backgroundColor: backgroundColor}]};
      }
      else {
        let defaults = {
          labels: [ 'January', 'February', 'March' ],
              datasets: [
            {
              data: [40, 20, 12],
              backgroundColor: ["#41B883", "#E46651", "#00D8FF"],
            }
          ]
        }
        return defaults
      }
    },
    checkRatingSum() {
      if (this.rating != null) {
        return this.rating.distribution.reduce((pv, cv) => pv + cv, 0) > 0;
      } else return false;
    },
  },
  components: {
    NotFoundError,
    TopArtistItem,
    AppLayout,
    JetNavLink,
    BulletListLoader,
    Pie,
    Bar
  },
}
</script>
