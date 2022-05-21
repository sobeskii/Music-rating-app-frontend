<template>
  <app-layout>
    <div class="py-4 bg-white w-full lg:w-3/5 mx-auto md:rounded-2xl mt-20">
      <div class="w-full md:max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-4">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl text-green-600 font-semibold tracking-wide">Discover music</h1>
          <p class="mt-1 sm:mt-2 max-w-4xl text-base sm:text-3xl text-gray-500 lg:mx-auto">
            A resource for music fans to keep up with their favourite music. Discover music that you enjoy and share
            your thoughts!
          </p>
        </div>
      </div>
      <p class="text-base md:text-xl my-2 mx-2">Top 15 Best Rated Releases:</p>
      <custom-table divClass="container mx-auto relative h-full"
                    :searchOptions="false"
                    :hasPagination="false"
                    :hasRecords="(this.releases != null)  ? (this.releases.data.length > 0) ? true : false : false"
                    :isLoading="(this.releases == null)  ? true : false"
                    errorText="There are no rated releases currently"
                    errorIcon="far fa-frown">
        <template v-slot:head>
          <th
              class="md:w-1/12 w-1/12 text-xs text font-semibold text-gray-600 uppercase text-left px-5 py-3">
            #
          </th>
          <th
              class="md:w-2/3 w-1/2 text-xs font-semibold text-gray-600 uppercase text-left px-5 py-3">
            Release
          </th>
          <th
              class="md:w-1/4 hidden sm:table-cell w-1/4 text-xs font-semibold text-gray-600 uppercase text-left px-5 py-3">
            Rating count
          </th>
          <th
              class="md:w-1/5 w-1/4 text-xs font-semibold text-gray-600 uppercase text-left px-5 py-3">
            Rating
          </th>
          <th
              class="md:w-1/5 w-1/5 text-xs font-semibold text-gray-600 uppercase text-left px-5 py-3">
          </th>
        </template>
        <template v-slot:content>
          <template v-for="(release,index) in this.releases.data" :key="release.id">
            <home-release-content :index="index" :data="release"></home-release-content>
          </template>
        </template>
      </custom-table>
    </div>
  </app-layout>
</template>
<script>
import AppLayout from '../../AppLayout.vue'
import CustomTable from '../../components/customcomponents/Table'
import HomeReleaseContent from '../../components/customcomponents/HomePageTableContent'
import {mapActions, mapState} from "vuex";

export default {
  created() {
    this.params.perPage = 15;
    this.retrieveBestRatedReleases(this.params);
  },
  data() {
    return {
      params: {
        perPage: null,
      }
    }
  },
  components: {
    CustomTable,
    AppLayout,
    HomeReleaseContent
  },
  methods: {
    ...mapActions(['retrieveBestRatedReleases']),
  },
  computed: {
    ...mapState({
      releases: state => state.release.releases.releases,
    }),
  }
}
</script>
