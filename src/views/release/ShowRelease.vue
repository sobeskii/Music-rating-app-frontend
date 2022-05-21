<template>
  <app-layout>
    <cover-component
        :cover="(primary_artist != null) ? primary_artist.artist_image : getImages('default-loading-banner.jpg')">
      <div class="md:h-full md:w-40 w-20 h-full">
        <img class="w-full h-full rounded-md" :src="(release != null) ? release.release_image : getImages('loading-asset.svg')
" alt="Album cover"/>
      </div>
      <div class="flex-none w-1/2 overflow-hidden">
        <div v-if="release != null" class="bottom-2 sm:absolute sm:w-2/6">
          <p class="whitespace-no-wrap text-white md:text-xl text-sm">
            <a rel="noreferrer" href="sss" target="_blank" class="text-green-500">
              <i class="fab fa-spotify" aria-hidden="true"></i>
            </a>
            {{ release.name }}
          </p>
          <p class="whitespace-no-wrap text-xs md:text-base  text-white">
              <router-link :to="{ name: 'artist', params: { id: primary_artist.spotify_id }}">
                {{ primary_artist.name }}&nbsp;
              </router-link>
          </p>
        </div>
      </div>
      <div class="flex-none sm:w-1/4 w-1/2">
        <div v-if="rating_data != null" class="bottom-2 absolute">
          <h5 class="text-white md:text-base text-xs">Community rating: </h5>
          <p class="text-white md:text-base text-xs">
            {{ ratingAverage }} <i class="fa fa-star" aria-hidden="true"></i> <small> from ratings {{
              rating_data.count
            }} </small>
          </p>
        </div>
      </div>
    </cover-component>
    <div class="max-w-5xl mx-auto flex m-2 px-3 justify-start my-2 flex-wrap md:gap-8 flex-row mt-2 md:mt-4">
      <template v-if="release != null">
        <div class="w-full md:w-1/4 flex-shrink">
          <template v-if="checkRatingSum">
            <p class="text-base md:text-xl mb-2">Rating distribution:</p>
            <Bar :height="200" :chart-options="{ plugins: { legend: {display: false} }}" :chart-data="this.chartData"/>
          </template>
          <track-list :tracks="release.tracks"></track-list>
        </div>
        <div class="flex-none w-full min-w-min my-2 md:w-1/2">
          <p class="text-base md:text-xl mb-2">Release information:</p>
          <p class="text-sm md:text-base"><strong>Released:</strong></p>
          <p class="text-xs md:text-md my-1">{{ release.release_date }} </p>
          <p class="text-sm md:text-base"><strong>Label:</strong></p>
          <p class="text-xs md:text-md my-1">{{ release.label }}</p>
          <p class="text-sm md:text-base"><strong>Release type:</strong></p>
          <p class="text-xs md:text-md capitalize my-1">{{ release.album_type }}</p>
          <p class="text-sm md:text-base"><strong>Rate this release:</strong></p>
          <rating-component :release="this.release"
                            :primary_artist="this.primary_artist"
                            :user_rating_data="this.user_rating_data"
                            :rating_data="this.rating_data"
                            :user="this.user"
          >
          </rating-component>
          <review-thread :loadMore="LoadMoreReviews"
                         :reviewsShowing="reviewsToShow"
                         :reviews="this.availableReviews"
                         emptyMsg="There are no reviews yet">
          </review-thread>
        </div>
      </template>
      <template v-else>
        <bullet-list-loader viewBox="-20 0 300 150" :speed="2"/>
      </template>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '../../AppLayout'
import CoverComponent from '../../components/customcomponents/CoverComponent.vue'
import TrackList from '../../components/customcomponents/TrackList.vue'
import RatingComponent from '../../components/customcomponents/RatingComponent.vue'
import ReviewThread from '../../components/customcomponents/ReviewThread.vue'
import {mapActions, mapGetters, mapState} from "vuex";
import {BulletListLoader} from 'vue-content-loader';
import {Chart as ChartJS, Title, Tooltip, BarElement, CategoryScale, LinearScale} from 'chart.js'

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale)

import {Bar} from 'vue-chartjs'

export default {
  created() {
    this.retrieveRelease(this.$route.params.id)
  },
  components: {
    AppLayout,
    CoverComponent,
    TrackList,
    RatingComponent,
    ReviewThread,
    BulletListLoader,
    Bar,
  },
  data() {
    return {
      reviewsToShow: 5,
    }
  },
  methods: {
    LoadMoreReviews() {
      this.reviewsToShow += 5
    },
    getImages(img) {
      return `/${img}`;
    },
    ...mapActions(["retrieveRelease"]),
  },
  computed: {
    ...mapGetters(['availableReviews']),
    ...mapState({
      release: state => state.release.release,
      primary_artist: state => state.artist.artist,
      user_rating_data: state => state.rating.user_rating,
      rating_data: state => state.rating.global_rating,
      user: state => state.user,
    }),
    chartData() {
      return {
        labels: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
        datasets: [{
          data: this.rating_data.distribution,
          backgroundColor: '#FFD73D',
        }
        ]
      }
    },
    checkRatingSum() {
      if (this.rating_data != null) {
        return this.rating_data.distribution.reduce((pv, cv) => pv + cv, 0) > 0;
      } else return false;
    },
    ratingAverage() {
      return Number((this.rating_data.average).toFixed(2));
    },

  }
}
</script>

