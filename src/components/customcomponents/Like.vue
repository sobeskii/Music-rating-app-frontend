<template>
  {{ total }}
  <template v-if="disabled || !loggedIn">
    <span :class="isActive + ' ' + getReactionType"> </span>
  </template>
  <template v-else>
    <a class="cursor-pointer"
       @click="addLike({ is_like : reaction_type, rating_id : review.id })"
       as="button">
      <span :class="isActive + ' ' + getReactionType"> </span>
    </a>
  </template>
</template>
<script>
import {mapActions, mapGetters} from "vuex";

export default {
  created() {
    this.amount = this.total;
  },
  props: {
    review: Object,
    reaction_type: Boolean,
    is_clicked: Boolean,
    total: Number,
    disabled: Boolean,
  },
  data(){
    return {
      amount: null,
    }
  },
  methods: {
    ...mapActions(['addLike']),
  },
  computed: {
    ...mapGetters(['loggedIn']),
    getReactionType() {
      return this.reaction_type ? 'thumbs-up' : 'thumbs-down';
    },
    isActive() {
      return this.reaction_type ? this.is_clicked ?
              'text-green-600' : '' :
          this.is_clicked ? 'text-red-600' : '';
    }
  }
}
</script>
<style scoped>
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
