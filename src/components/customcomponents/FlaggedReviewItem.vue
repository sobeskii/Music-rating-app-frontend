<template>
  <tr>
    <td class="px-5 py-5 border-b border-gray-200 hidden sm:table-cell bg-white text-sm">
      <router-link :to="{ name: 'user_profile', params: { id: this.data.user_id }}">
        <p class="text-gray-900 whitespace-no-wrap">{{ data.user.name }}</p>
      </router-link>
    </td>
    <td class="px-5 py-5 border-b border-gray-200 bg-white hidden lg:table-cell text-sm">
      {{ formatDate }}
    </td>
    <td class="px-5 py-5 border-b border-gray-200 hidden sm:table-cell bg-white text-sm">
      {{data.flagged_review_reasons[data.flagged_review_reasons.length - 1].moderation_rule.reason}}
    </td>
    <td class="px-5 py-5 border-b border-gray-200 lg:text-sm text-xs bg-white">
      <template v-if="this.data.flagged_review_reasons[data.flagged_review_reasons.length - 1].moderation_rule.strategy == 'classifier' ">
        For {{ this.data.flagged_review_reasons[data.flagged_review_reasons.length - 1].moderation_rule.mute_minutes }} minutes
      </template>
      <template v-else-if="this.data.flagged_review_reasons[data.flagged_review_reasons.length - 1].moderation_rule.strategy == 'regex'">
        <template v-if="this.data.flagged_review_reasons_count > this.data.flagged_review_reasons[data.flagged_review_reasons.length - 1].moderation_rule.detect_after_count">
          For {{ this.data.flagged_review_reasons[data.flagged_review_reasons.length - 1].moderation_rule.mute_minutes  }}
        </template>
        <template v-else>
          Not muted
        </template>
      </template>
    </td>
    <td class="px-5 py-5 border-b border-gray-200 lg:text-lg text-sm bg-white">

      <template v-if="this.showingFullText">
        <router-link :to="{ name: 'release', params: { id: this.data.release_id }}">
          <div v-html="data.review">
          </div>
        </router-link>
        <button class="text-gray-500 text-xs" v-if="this.data.review.length > this.maxChars" @click="showingFullText = !showingFullText">
          Read {{ showingFullText ? "Less" : "More" }}
        </button>
      </template>
      <template v-else>
        <router-link :to="{ name: 'release', params: { id: this.data.release_id }}">
          <div v-html="formattedText">
          </div>
        </router-link>
        <button class="text-gray-500 text-xs" v-if="this.data.review.length > this.maxChars" @click="showingFullText = !showingFullText">
          Read {{ showingFullText ? "Less" : "More" }}
        </button>
      </template>

    </td>
    <td class="px-5 py-5 border-b border-gray-200 lg:text-lg text-sm bg-white">
      <jet-button @click="confirmingDeleteConfirm = true"
                  btnClass="inline-flex items-center w-28 md:w-32 justify-center px-2 py-1 bg-red-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-300 focus:outline-none focus:border-red-700 focus:shadow-outline-green active:bg-red-600 transition ease-in-out duration-150">
        <i class="fas fa-trash"></i>&nbsp;Delete
      </jet-button>
      <jet-button @click="confirmingReviewConfirm = true"
                  btnClass="inline-flex items-center w-28 md:w-32 justify-center px-2 py-1 bg-yellow-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-300 focus:outline-none focus:border-yellow-700 focus:shadow-outline-green active:bg-yellow-600 transition ease-in-out duration-150">
        <i class="fas fa-backward"></i>&nbsp;Revert
      </jet-button>
    </td>
  </tr>
  <!-- Confirmation Modal -->
  <jet-dialog-modal :show="confirmingReviewConfirm" @close="confirmingReviewConfirm">
    <template #title>
      Revert this decision
    </template>

    <template #content>
      Do you want to revert this decision?
    </template>

    <template #footer>
      <jet-secondary-button @click="confirmingReviewConfirm = false">
        Cancel
      </jet-secondary-button>
      <jet-button btnClass="inline-flex items-center ml-2  justify-center px-4 py-2 bg-green-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gren-300 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-600 transition ease-in-out duration-150"
                  @click="handleConfirm(this.data.id)">
        Revert
      </jet-button>
    </template>
  </jet-dialog-modal>

  <!-- Delete review Modal -->
  <jet-dialog-modal :show="confirmingDeleteConfirm" @close="confirmingDeleteConfirm">
    <template #title>
      Delete review
    </template>

    <template #content>
      Do you want to delete this review?
    </template>

    <template #footer>
      <jet-secondary-button @click="confirmingDeleteConfirm = false">
        Cancel
      </jet-secondary-button>
      <jet-button btnClass="inline-flex items-center ml-2 justify-center px-4 py-2 bg-red-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-300 focus:outline-none focus:border-red-700 focus:shadow-outline-green active:bg-red-600 transition ease-in-out duration-150"
                  @click="handleDelete(this.data.id)">
        Delete review
      </jet-button>
    </template>
  </jet-dialog-modal>
</template>
<script>
import JetButton from './Button'
import JetDialogModal from './DialogModal'
import JetDangerButton from './DangerButton'
import JetSecondaryButton from './SecondaryButton'
import Pill from "@/components/customcomponents/Pill";
import {mapActions} from "vuex";
export default {
  mounted() {
    this.highlightFlaggedParts
  },
  beforeUpdate() {
    if(this.showingFullText) {
      this.highlightFlaggedParts
    }
  },
  components: {
    Pill,
    JetButton,
    JetDialogModal,
    JetDangerButton,
    JetSecondaryButton,
  },
  data() {
    return {
      showingFullText: (this.data.length < 250) ? true : false,
      maxChars: 125,
      confirmingReviewConfirm: false,
      confirmingDeleteConfirm: false,
    }
  },
  props:{
    data:Object
  },
  methods:{
    handleConfirm(id){
      this.confirmReview({id:id})
      this.confirmingReviewConfirm = false
    },
    handleDelete(id){
      this.removeFlaggedReview(id)
      this.confirmingDeleteConfirm = false
    },
    ...mapActions(['confirmReview','removeFlaggedReview'])
  },
computed:{
    formatDate(){
      return new Date(this.data.flagged_review_reasons[0].created_at).toJSON().slice(0, 19).replace('T', ' ')
    },
    highlightFlaggedParts(){
      let that = this
      this.data.flagged_review_reasons.forEach(function (value){
        if(value.flagged_part != null) {
          if (that.data.review.includes(value.flagged_part)) {
            that.data.review = that.data.review.replace(new RegExp(value.flagged_part, 'gi'), '' +
                '<div class="highlight break-words tooltip hover:cursor-pointer">' +
                ' $& ' +
                '<div class="left">' +
                value.moderation_rule.name +
                '<i></i>' +
                '</div>' +
                '</div>'
            )
          }
        }
      });
    },
    formattedText() {
      return `${this.data.review.slice(0, this.maxChars).trim()}`;
    }
  }
}
</script>
<style>
.highlight{
  border-radius: 1em 0 1em 0;
  word-break:break-all;
  background-image: linear-gradient(
      -100deg,
      rgba(5,150,105, 0.2),
      rgba(5,150,105, 0.7) 95%,
      rgba(5,150,105, 0.1)
  );
}

@media (max-width: 768px) {
  .tooltip .left {
    min-width:200px;
    max-width:400px;
    top:50%;
    left:100%;
    margin-left:20px;
    transform:translate(0, -50%);
    padding:0;
    color:#EEEEEE;
    background-color:#444444;
    font-weight:normal;
    font-size:13px;
    border-radius:8px;
    position:absolute;
    z-index:99999999;
    box-sizing:border-box;
    box-shadow:0 1px 8px rgba(0,0,0,0.5);
    display:none;
    border:1px solid #ffffff;
  }

  .tooltip .left i {
    position:absolute;
    top:50%;
    right:100%;
    margin-top:-12px;
    width:12px;
    height:24px;
    overflow:hidden;
  }

  .tooltip .left i::after {
    content:'';
    position:absolute;
    width:12px;
    height:12px;
    left:0;
    top:50%;
    transform:translate(50%,-50%) rotate(-45deg);
    background-color:#444444;
    border:1px solid #ffffff;
  }
}
  .tooltip {
    display: inline-block;
    position: relative;
    text-align: left;
    cursor: pointer;
  }

  .tooltip .left {
    min-width: 120px;
    max-width: 200px;
    top: 50%;
    right: 100%;
    margin-right: 20px;
    transform: translate(0, -50%);
    padding: 10px;
    color: #ffffff;
    background-color: #111102;
    font-weight: normal;
    font-size: 16px;
    text-align: center;
    border-radius: 8px;
    position: absolute;
    z-index: 99999999;
    box-sizing: border-box;
    display: none;
    border: 1px solid #ffffff;
  }


  .tooltip:hover .left {
    display: block;
  }

  .tooltip .left i {
    position: absolute;
    top: 50%;
    left: 100%;
    margin-top: -12px;
    width: 12px;
    height: 24px;
    overflow: hidden;
  }

  .tooltip .left i::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    left: 0;
    top: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    background-color: #030301;
    border: 1px solid #ffffff;
  }

</style>