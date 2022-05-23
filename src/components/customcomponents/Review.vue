<template>
  <div class="w-full mx-auto">
    <div class="flex w-full border-gray-300 border-b py-2">
      <template v-if="belongsToUserProfileReaction">
        <div class="w-1/7">
          <router-link :to="{ name: 'release', params: { id: review.release.spotify_id }}">
            <div class="mx-auto text-center">
              <div class="mx-auto flex-shrink-0 rounded-lg shadow h-24 w-24 sm:w-36 sm:h-36 p-2">
                <img class="w-full h-full rounded-md"
                     :src="review.release.release_image"
                     alt=""/>
              </div>
              <p class="text-gray-500 py-1 text-xs sm:text-sm">
                {{ shortenReleaseName }}
              </p>
              <router-link :to="{ name: 'artist', params: { id: review.release.artist.spotify_id }}"
                           class="text-gray-500 py-1 text-xs sm:text-sm">
                {{ shortenArtistName }}
              </router-link>
            </div>
          </router-link>
        </div>
      </template>
      <div class="w-full ml-2">
        <!-- Add link to release page if the ratings review is in User reaction page -->
        <template v-if="belongsToUserProfileReaction">
            <div class="w-full text-sm md:text-base p-2">
              <div class="h-8">
                <strong>{{ review.user.name }}</strong>,
                <small class="text-gray-500"> {{ formatDate }} </small>
                <div class="float-right text-muted -mt-2 lg:-mt-1 hidden sm:block">
                  <div class="h-8 w-25 p-1" :class="review.rating+'_rating'"></div>
                </div>
              </div>
              <div class="pb-1 break-all" v-if="review.review != null">
                {{ formattedBody }}
                <button class="text-gray-500 text-xs" v-if="this.review.review.length > this.maxChars" @click="showingFullText = !showingFullText">
                  Read {{ showingFullText ? "Less" : "More" }}
                </button>
              </div>
            </div>
          <div class="px-2 mt-4" v-if="hasLikes">
            <div class="w-full sm:text-base text-xs">
              <div v-if="review.liked">
                <span class="thumbs-up text-green-600"> </span>
                liked this review
              </div>
              <div v-else>
                <span class="thumbs-down text-red-600"> </span>
                disliked this review
              </div>
            </div>
          </div>
        </template>
        <!-- Show rating with a review normally -->
        <template v-else>
          <template v-if="!review.isFlagged">
            <div class="w-full text-sm md:text-base px-2">
              <div class="h-8">
                <strong><router-link :to="{ name: 'user_profile', params: { id: review.user.id }}">{{ review.user.name }}</router-link></strong>,
                <small class="text-gray-500"> {{ formatDate }} </small>
                <div class="float-right text-muted -mt-2 lg:-mt-1">
                  <div class="h-8 w-25 p-1" :class="review.rating+'_rating'"></div>
                </div>
              </div>
              <div class="pb-1 break-all" v-if="review.review != null">
                  {{ formattedBody }}
                  <button class="text-gray-500 text-xs" v-if="this.review.review.length > this.maxChars" @click="showingFullText = !showingFullText">
                    Read {{ showingFullText ? "Less" : "More" }}
                  </button>
              </div>
            </div>
            <div class="px-2">
              <div class="w-full">
                <small>
                  <like :review="review"
                        :reaction_type="true"
                        :is_clicked="review.liked"
                        :total="review.like_count"
                        :disabled="review.disliked || belongsToUserProfileReaction"
                  >
                  </like>
                  <like :review="review"
                        :reaction_type="false"
                        :is_clicked="review.disliked"
                        :total="review.dislike_count"
                        :disabled="review.liked || belongsToUserProfileReaction"
                  >
                  </like>
                </small>
              </div>
            </div>
          </template>
          <template v-else>
            <template v-if="this.getUserData != null">
              <template v-if="review.user_id == this.getUserData.user_id || this.getUserData.role.role == 'admin'">
                <div class="bg-yellow-300 border-t-4 border-yellow-500 rounded-b text-white px-2 py-2" role="alert">
                  <div class="flex">
                    <div class="py-1">
                      <svg class="fill-current h-5 w-5 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 20 20">
                        <path
                            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-base">
                        <template v-if="review.user.mute_reason == null">
                          Review has been hidden. Please edit the review to make it visible!
                        </template>
                        <template v-else>
                          {{ review.user.mute_reason }}
                        </template>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="w-full text-sm md:text-base px-2 opacity-50">
                  <div class="h-8">
                    <strong>{{ review.user.name }}</strong>,
                    <small class="text-gray-500"> {{ formatDate }} </small>
                    <div class="float-right text-muted -mt-2 lg:-mt-1">
                      <div class="h-8 w-25 p-1" :class="review.rating+'_rating'"></div>
                    </div>
                  </div>
                  <div class="pb-1 break-all">
                    {{ formattedBody }}
                    <button class="text-gray-500 text-xs" v-if="this.review.review.length > this.maxChars" @click="showingFullText = !showingFullText">
                      Read {{ showingFullText ? "Less" : "More" }}
                    </button>
                  </div>
                </div>
              </template>
            </template>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import Like from './Like.vue'
import moment from 'moment';
import {mapGetters} from "vuex";

export default {
  props: {
    review: Object,
    belongsToUserProfileReaction: {
      type: Boolean,
      default: false,
    },
    hasLikes: {
      type:Boolean,
      default: false,
    }
  },
  data() {
    return {
      showingFullText: false,
      maxChars: 200,
    };
  },
  components: {
    Like,
  },
  computed: {
    ...mapGetters(['loggedIn', 'getUserData']),
    formatDate() {
      return moment(this.review.created_at).format('YYYY-MM-DD');
    },
    shortenReleaseName() {
      if(this.review.release != null) {
        return parseInt(this.review.release.name.length) > 20 ? this.review.release.name.substring(0, 20) + "..." :
            this.review.release.name
      } return false;
    },
    shortenArtistName() {
      if(this.review.release != null) {
        return parseInt(this.review.release.artist.name.length) > 20 ? this.review.release.artist.name.substring(0, 20) + "..." :
            this.review.release.artist.name
      } return false;
    },

    formattedBody() {
      if (this.showingFullText) {
        return this.review.review;
      } else {
        if(this.review.review.length > this.maxChars) {
          return `${this.review.review.slice(0, this.maxChars).trim()}...`;
        } else {
          return this.review.review;
        }
      }
    }
  },
}
</script>
<style scoped>
.w-25 {
  width: 6.5rem;
}

[class~="0_rating"] {
  background: url(../../../public/assets/ratings/0s.png);
}

[class~="0.5_rating"] {
  background: url(../../../public/assets/ratings/1s.png);
}

[class~="1_rating"] {
  background: url(../../../public/assets/ratings/2s.png);
}

[class~="1.5_rating"] {
  background: url(../../../public/assets/ratings/3s.png);
}

[class~="2_rating"] {
  background: url(../../../public/assets/ratings/4s.png);
}

[class~="2.5_rating"] {
  background: url(../../../public/assets/ratings/5s.png);
}

[class~="3_rating"] {
  background: url(../../../public/assets/ratings/6s.png);
}

[class~="3.5_rating"] {
  background: url(../../../public/assets/ratings/7s.png);
}

[class~="4_rating"] {
  background: url(../../../public/assets/ratings/8s.png);
}

[class~="4.5_rating"] {
  background: url(../../../public/assets/ratings/9s.png);
}

[class~="5_rating"] {
  background: url(../../../public/assets/ratings/10s.png);
}
 .thumbs-up:hover {
   color: #008000;
 }

.thumbs-down:hover {
  color: #FF0000;
}

.thumbs-up:before {
  content: "\f164";
  margin: 5px;
  font-size: 1em;
  font-weight: 900;
  font-family: "Font Awesome 5 Free";
  display: inline-block;
}

.thumbs-down:before {
  content: "\f165";
  margin: 5px;
  font-size: 1em;
  font-weight: 900;
  font-family: "Font Awesome 5 Free";
  display: inline-block;
}

</style>

