<template>
  <form @submit.prevent="sendRating">
    <input type="hidden" v-model="this.setValue">
    <div class="flex w-full sm:w-2/3">
      <div class="w-full">
        <div class="w-full flex">
          <div id="num_rating" class="p-2 w-1/4 sm:w-1/5 md:1/7 text-center">
            <small>{{ this.user_rating_data.rating  }}</small>
          </div>
          <fieldset class="rating w-2/3 lg:w-1/2 md:w-2/3 sm:w-1/2 mb-3 float-left" :id="'rating_' + release.release_id">
            <template v-for="n in reverseKeys" v-bind:key="n">
              <template v-if="n != 0">
                <input type="radio"
                       :disabled="(loggedIn) ? false : true"
                       @click="loggedIn ?  (rate( starRating( n ) ), showButtons())
                                                                : false"
                       :id="'star' + starRating( n )"
                       :checked="(starRating( n ) == this.user_rating_data.rating ) ? true : false"
                       name="rating"
                       :value="starRating( n ) "/>

                <label @click="loggedIn ? false : redirectToLogin()"
                       @mouseleave="(isSet) ? showNumericValue( setValue ) : showNumericValue( 0 ) "
                       @mouseover="showNumericValue( starRating( n ) )"
                       :class="Number.isInteger( starRating( n ) ) ? 'full' : 'half'"
                       :for="'star' + starRating( n )">
                </label>
              </template>
            </template>
          </fieldset>
        </div>
        <div v-if="buttonsVisible" class="w-full">
          <div v-if="showTextArea" class="w-full p-3">
                        <textarea placeholder="Write your review here" v-model="this.user_rating_data.review" rows="5" class='w-full h-80' name="review">
                        </textarea>
          </div>
          <div class="clear-both"></div>
          <jet-button type='submit'>
            Submit
          </jet-button>
          &nbsp;
          <jet-button :clickFunc="removeRating"
                      type='button'
                      v-if="isSet && user_rating_data.user_id != null">
            Remove
          </jet-button>
          &nbsp;
          <jet-button :clickFunc="toggleReviewTextArea"
                      type='button'>
            Review
          </jet-button>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import JetButton from './Button'
import {mapActions, mapGetters, mapState} from "vuex";

export default {
  components: {
    JetButton
  },
  props:['release','primary_artist','user_rating_data','rating_data','user'],
  mounted() {
    if (this.user_rating_data.rating != 0) {
      this.rate(this.user_rating_data.rating);
    }
  },
  data() {
    return {
      isSet: false,
      setValue: 0,
      buttonsVisible: false,
      showTextArea: false,
    }
  },
  methods: {
    ...mapActions(['putRating','deleteRating']),
    sendRating(){
      this.putRating({
        rating : this.setValue,
        review : this.user_rating_data.review,
        artist_id : this.primary_artist.spotify_id,
        release_id:  this.release.spotify_id,
        user_id : this.getUserData.user_id,
        token : this.user.token
      })
      this.hideButtons();
    },
    removeRating() {
      this.deleteRating({
        release_id : this.release.spotify_id,
        artist_id : this.primary_artist.spotify_id,
        user_id:this.getUserData.user_id,
        token : this.user.token,
        id : this.user_rating_data.id,
      });
      this.hideButtons();
      this.reset();
    },
    rate(value) {
      this.setValue = value;
      this.isSet = true;
    },
    reset() {
      this.rating_data.rating = 0
      this.setValue = 0;
      this.user_rating_data.rating = null;
      this.isSet = false;
      this.hideButtons();
      $('input[name="rating"]').prop('checked', false);
    },
    showButtons() {
      this.buttonsVisible = true
    },
    hideButtons() {
      this.buttonsVisible = false
    },
    showNumericValue(value) {
      $("#num_rating > small").text(value);
    },
    starRating(iteration) {
      let starRating = iteration * 0.5;
      return starRating;
    },
    toggleReviewTextArea() {
      this.showTextArea = !this.showTextArea
    },
    redirectToLogin() {
      //window.location.href = route('login')
    },
  },
  computed: {
    ...mapGetters(['loggedIn','getUserData']),
    reverseKeys() {
      return [...Array(11).keys()].slice().reverse()
    },
  }
}
</script>
<style scoped>
.rating {
  border: none;
  float: left;
}

.rating > input {
  display: none;
}

.rating > label:before {
  margin: 5px;
  font-size: 1.25em;
  font-weight: 900;
  content: "\f005";
  font-family: "Font Awesome 5 Free";
  display: inline-block;
}

.rating > .half:before {
  content: "\f089";
  position: absolute;
}

.rating > label {
  color: #ddd;
  float: right;
}

.rating > input:checked ~ label,
.rating:not(:checked) > label:hover,
.rating:not(:checked) > label:hover ~ label {
  color: #FFD700 !important;
}

.rating > input:checked + label:hover,
.rating > input:checked ~ label:hover,
.rating > label:hover ~ input:checked ~ label,
.rating > input:checked ~ label:hover ~ label {
  color: #FFED85 !important;
}
</style>
