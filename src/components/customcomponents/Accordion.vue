<template>
  <div class="">
    <div class="rounded-t-lg">
      <a href="#" :aria-expanded="active" class="p-3 flex text-xs rounded-md hover:bg-green-400 bg-green-600 block no-underline text-white border-b-2 border-white flex justify-between dropdown-toggle" @click.prevent="active = !active">
        <div class="w-1/2 flex-none">
        {{title}}
        </div>
        <div class="w-1/3 flex-none text-right" v-if="selection">
          {{ (selection) }}
        </div>
      </a>
    </div>
    <transition
        enter-active-class="transition ease-out duration-500"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95">
      <div class="border border-t-0 p-2.5 -mt-2 rounded-lg" v-show="active">
        <slot />
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: [
    'title',
    'selection',
    'hasValue'
  ],
  data() {
    return {
      active: (this.hasValue) ? true  : false,
    }
  },

}
</script>
<style scoped>

.dropdown-toggle[aria-expanded="true"]:after {
  transform: rotate(180deg);
}
/*for animation*/
.dropdown-toggle:after {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 0.3em;
  vertical-align: middle;
  content: "";
  margin-top: 0.5em;
  border-top: 0.4em solid;
  border-right: 0.3em solid transparent;
  border-left: 0.3em solid transparent;
  transition: 0.7s;
}

</style>