<template>
  <app-layout>
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Reactions
      </h2>
    </template>
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
                <div class="overflow-y-auto sm:py-4 sm:px-3 bg-white rounded dark:bg-gray-800">
                  <ul class="space-y-2">
                    <li>
                      <router-link :to="{name:'user_profile',params: { id: this.$route.params.id }}" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="lg:text-base text-xs flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-user"></i>
                        <span class="lg:text-base text-xs flex-1 ml-3 whitespace-nowrap">Profile</span>
                      </router-link>
                    </li>
                    <li>
                      <router-link :to="{name:'user_reactions',params: { id: this.$route.params.id }}" class="flex items-center p-2
                              text-white bg-green-500
                              text-base font-normal rounded-lg">
                        <i class="lg:text-base text-xs flex-shrink-0 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-thumbs-up"></i>
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
      <p class="text-base md:text-xl mt-2">Reactions:</p>
      <review-thread  :isLoading="reactions == null"
                      :loadMore="LoadMoreReviews"
                      :reviewsShowing="reviewsToShow"
                      :reviews="this.reactions"
                      :belongsToUserProfileReaction="true"
                      :hasLikes="true"
                      emptyMsg="User has not reacted to anything"
      ></review-thread>
      </div>
      </template>
      <template v-else>
        <div class="mx-auto text-center content-center">
          <bullet-list-loader viewBox="-20 0 300 150" :speed="2"/>
        </div>
      </template>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '../../AppLayout'
import ReviewThread from '../../components/customcomponents/ReviewThread'
import {mapActions, mapGetters, mapState} from "vuex";
import {BulletListLoader} from "vue-content-loader";

export default {
  created() {
    this.getUserLikes(this.$route.params.id);
  },
  components: {
    BulletListLoader,
    AppLayout,
    ReviewThread,
  },
  data(){
    return {
      reviewsToShow: 5,
    }
  },
  methods:{
    ...mapActions(['getUserLikes']),
    LoadMoreReviews(){
      this.reviewsToShow  +=  5
    },
    getImages(img) {
      return `/${img}`;
    }
  },
  computed: {
    ...mapState({
      reactions: state => state.like.likes,
      user: state => state.user.profile,
    }),
  }
}
</script>
