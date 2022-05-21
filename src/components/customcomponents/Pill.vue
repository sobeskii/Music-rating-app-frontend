<template>
  <span :class="color + ' py-2 px-4 shadow-md no-underline rounded-full  font-sans font-semibold text-sm border-blue btn-primary ' + textColor">
    {{ text }}
  </span>
</template>

<script>
export default {
  props:{
      text:{
        type:String
      },
      color:{
        type:String
      },
      textColor:{
        type:String,
        default: 'text-white'
      }
  }
}
</script>

<style scoped>

</style>