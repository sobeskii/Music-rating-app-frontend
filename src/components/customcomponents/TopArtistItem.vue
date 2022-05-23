<template>
  <div class="flex w-full min-w-min md:w-1/4 hover:opacity-50" v-if="this.data != null">
    <router-link v-if="this.id !=null" :to="{ name: 'artist', params: { id: this.id }}">
      <div class="flex w-full flex" v-if="(noIndex) ? this.data.images != null : this.data.artist != null">
      <div class="frame xl:h-48 xl:w-48 lg:h-36 lg:w-36 md:h-32 md:w-32 sm:h-36 sm:w-36 w-full h-48"><img class="w-full object-cover object-center h-full"
                                        :src="(!noIndex) ? data.artist.artist_image : data.images[0].url"
                                        alt="Artist image">
        <div class="cover_item">
          <div class="max-w-5xl mx-auto flex px-1 justify-start h-full lg:gap-8 sm:gap-8 md:gap-2 gap-8 flex-row">
            <div class="flex-none w-1/2 overflow-hidden">
              <div class="bottom-2 sm:absolute md:w-1/2 sm:w-3/4 w-1/2">
                <p class="whitespace-no-wrap text-base sm:text-xs text-white">

                    {{ shortenArtistName }}
                </p>
              </div>
            </div>
            <div class="flex-none md:w-1/2 sm:m-0 mb-2 w-1/4" v-if="!noIndex">
              <div>
                <div class="flex items-center justify-between text-gray-800 lg:px-3 px-1">
                  <div class="lg:w-8 lg:h-8 w-6 h-6 md:text-base text-xs rounded-full bg-gray-800 text-white flex items-center justify-center">
                    #{{ tableNumber }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    noIndex: {
      default: false,
      type:Boolean,
    },
    data: Object,
    index: Number,
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowHeight = window.innerHeight
    })
  },
  data() {
    return {
      windowHeight: window.innerHeight,
    }
  },
  computed: {
    id(){
        return (!this.noIndex) ? this.data?.artist?.spotify_id ?? null : this.data.id ?? null;
    },
    tableNumber() {
      return (this.index + 1)
    },
    shortenArtistName(){
      if( this.windowHeight <= 768 && this.windowHeight >= 1024) {
        if(!this.noIndex) {
          return parseInt(this.data.artist.name.length) > 6 ? this.data.artist.name.substring(0, 6) + "..." : this.data.artist.name
        }else {
          return parseInt(this.data.name.length) > 6 ? this.data.name.substring(0, 6) + "..." : this.data.name
        }
      } else{
        if(!this.noIndex) {
          return parseInt(this.data.artist.name.length) > 15 ? this.data.artist.name.substring(0, 15) + "..." : this.data.artist.name
        }
        else {
          return parseInt(this.data.name.length) > 15 ? this.data.name.substring(0, 15) + "..." : this.data.name
        }
      }
    },
  }
}
</script>

<style scoped>
.frame {
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.frame:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  left: 0;
  background: url(../../../public/frame.png);
  background-repeat: no-repeat;
  background-size: cover;
}

.cover_item {
  position: absolute;
  z-index: 1;
  bottom: 0.5px;
  margin-left: auto;
  margin-right: auto;
  left: 5px;
  right: 5px;
}
</style>