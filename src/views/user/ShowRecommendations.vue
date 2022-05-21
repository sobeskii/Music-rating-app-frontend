<template>
  <app-layout>
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Recommendations
      </h2>
    </template>
    <div class="py-4 w-full lg:w-3/5 mx-auto md:rounded-2xl px-4">
      <p class="text-base md:text-xl mb-2">Artists recommended based on what you are listening to:</p>
      <template v-if="artists != null">
        <template v-if="artists.length > 0">
          <div class="grid mb-4 sm:grid-cols-5 grid-cols-2 gap-x-0.5 gap-y-1">
            <template v-for="artist in this.artists">
              <top-artist-item :noIndex="true" :data="artist" />
            </template>
          </div>
        </template>
        <template v-else>
          <not-found-error errorText="You do not have any Spotify listening information"
                           icon="far fa-frown">

          </not-found-error>
        </template>
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
import AppLayout from "@/AppLayout";
import {mapActions, mapState} from "vuex";
import TopArtistItem from "@/components/customcomponents/TopArtistItem";
import NotFoundError from "@/components/customcomponents/NotFoundError";
import {BulletListLoader} from "vue-content-loader";

export default {
  created() {
    this.getUserRecommendations();
  },
  components: {
    TopArtistItem,
    AppLayout,
    NotFoundError,
    BulletListLoader
  },
  methods:{
    ...mapActions(['getUserRecommendations'])
  },
  computed: {
    ...mapState({
      artists: state => state.artist.artists,
    })
  }
}
</script>

<style scoped>

</style>