<template>
  <div :class="componentClasses">
    <div class="my-2 flex sm:flex-row flex-col">
        <div class="flex flex-row mb-1 sm:mb-0">
            <div class="relative">
                <slot name="selection"></slot>
            </div>
        </div>
        <div class="block relative" v-if="searchOptions">
            <slot name="search_input"> </slot>
        </div>
    </div>
    <div :class="divClass">
      <template v-if="!isLoading">
        <div class="py-1 overflow-x-auto " v-if="hasRecords">
            <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <table class="min-w-full w-full leading-normal table-fixed">
                    <thead>
                        <tr>
                            <slot name="head"></slot>
                        </tr>
                    </thead>
                    <tbody>
                        <slot name="content"></slot>
                    </tbody>
                </table>
                <slot name="pagination" v-if="hasRecords && hasPagination"></slot>
            </div>
        </div>
        <not-found-error    :icon="errorIcon"
                            :errorText="errorText"
                            v-else>
        </not-found-error>
      </template>
      <div class="mx-auto text-center content-center" v-else>
        <bullet-list-loader viewBox="-20 0 300 150" :speed="2" />
      </div>
    </div>
  </div>
</template>
<script>
import {BulletListLoader} from "vue-content-loader";
import NotFoundError from "@/components/customcomponents/NotFoundError";
export default {
  components: { BulletListLoader,NotFoundError },
    props:{
        componentClasses:String,
        isLoading:{
          type:Boolean,
          default: false,
        },
        hasRecords:{
            type:Boolean,
            default: true,
        },
        searchOptions:{
            type:Boolean,
            default:true,
        },
        hasPagination:{
            type:Boolean,
            default:true,
        },
        divClass:String,
        errorText:{
            type:String,
            default:"Start typing to initiate the search...",
        },
        errorIcon:{
            type:String,
            default:"fa fa-search",
        }
    },
}
</script>
