<template>
  <div id="app_layout">
    <template v-if="this.user.errors">
      <toast-list :toast="this.user.errors" :isError="true"></toast-list>
    </template>
    <template v-if="this.user.success">
      <toast-list :toast="this.user.success" :isError="false"></toast-list>
    </template>
    <jet-banner/>
    <div class="bg-white h-full flex flex-col min-h-screen">
      <nav class="bg-green-600 border-b border-green-500">
        <!-- Primary Navigation Menu -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <!-- Logo -->
              <div class="flex-shrink-0 flex items-center">
                <router-link :to="{name:'home'}">
                  <jet-application-mark class="block h-9 w-9 hover:opacity-75"/>
                </router-link>
              </div>
              <!-- Navigation Links -->
              <div class="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                <jet-nav-link :href="{name:'search'}" :active="searchActive">
                  Search
                </jet-nav-link>
                <jet-nav-link :href="{name:'charts'}" :active="chartsActive">
                  Charts
                </jet-nav-link>
               <template v-if="this.getUserData">
                 <jet-nav-link v-if="getUserData.role.role == 'admin'" :href="{name:'admin'}" :active="adminPanelActive">
                   Admin
                 </jet-nav-link>
               </template>
              </div>
            </div>
            <div class="hidden sm:flex sm:items-center sm:ml-6">
              <template v-if="loggedIn">
                <!-- Settings Dropdown -->
                <div>
                  <jet-dropdown align="right" width="48">
                    <template #trigger>
                      <span class="inline-flex rounded-md hover:opacity-80">
                        <div
                            class="relative w-8 h-8 mt-1 cursor-pointer focus:outline-none transition ease-in-out duration-75">
                          <img class="rounded-full w-full h-full shadow-sm"
                               :src="this.getUserData && this.getUserData.avatar ? this.getUserData.avatar : getImages('loading-asset-alternate.svg')"
                               alt="user image"/>
                        </div>
                        <button v-if="this.getUserData != null" type="button"
                                class="inline-flex items-center px-2 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 focus:outline-none transition ease-in-out duration-75">
                          {{ this.getUserData.name }}
                          <svg class="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                               viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clip-rule="evenodd"/>
                          </svg>
                        </button>
                      </span>
                    </template>
                    <template #content>
                      <!-- Authentication -->
                      <template v-if="loggedIn && this.getUserData != null">
                        <jet-dropdown-link :href="{name: 'user_profile', params: { id: getUserData.user_id }}">
                          Profile
                        </jet-dropdown-link>
                      </template>
                      <jet-dropdown-link  :href="{name:'discover'}">
                        Recommendations
                      </jet-dropdown-link>
                      <form @submit.prevent="this.destroyToken">
                        <jet-dropdown-link asx="button">
                          Log Out
                        </jet-dropdown-link>
                      </form>
                    </template>
                  </jet-dropdown>
                </div>
              </template>
              <template v-else>
                <a :href="authLink" class="text-sm text-white hover:text-gray-200">
                  Log in
                </a>
              </template>
            </div>
            <!-- Hamburger -->
            <div class="-mr-2 flex items-center sm:hidden">
              <button @click="showingNavigationDropdown = ! showingNavigationDropdown"
                      class="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-green-600 focus:outline-none focus:bg-green-600 focus:text-gray-200 transition duration-150 ease-in-out">
                <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path :class="{'hidden': showingNavigationDropdown, 'inline-flex': ! showingNavigationDropdown }"
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                  <path :class="{'hidden': ! showingNavigationDropdown, 'inline-flex': showingNavigationDropdown }"
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <!-- Responsive Navigation Menu -->
        <div :class="{'block': showingNavigationDropdown, 'hidden': ! showingNavigationDropdown}" :active="searchActive" class="sm:hidden">
          <div class="pt-2 pb-3 space-y-1">
            <jet-responsive-nav-link :href="'search'">
              Search
            </jet-responsive-nav-link>

            <template v-if="loggedIn && this.getUserData != null">
              <jet-responsive-nav-link :href="{name:'discover'}">
                Recommendations
              </jet-responsive-nav-link>
            </template>

            <jet-responsive-nav-link :href="{name:'charts'}" :active="chartsActive">
              Charts
            </jet-responsive-nav-link>

          </div>
          <!-- Responsive Settings Options -->
          <div class="pt-4 pb-1 border-t border-gray-200">
            <template v-if="loggedIn &&  this.getUserData != null">
              <div class="flex items-center px-4">
                <div>
                  <div class="font-medium text-base text-gray-200">
                    <router-link :to="{name: 'user_profile', params: { id: getUserData.user_id }}">
                      {{ this.getUserData.name }}
                    </router-link>
                  </div>
                  <div class="font-medium text-sm text-gray-200"></div>
                </div>
              </div>
              <div class="mt-3 space-y-1">
                <!-- Authentication -->
                <form method="POST" @submit.prevent="this.destroyToken">
                  <jet-responsive-nav-link asx="button">
                    Log Out
                  </jet-responsive-nav-link>
                </form>
              </div>
            </template>
            <template v-else>
              <a :href="authLink" class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out ">
                Log in
              </a>
            </template>
          </div>
        </div>
      </nav>

      <!-- Page Heading -->
      <header class="bg-white shadow" v-if="$slots.header">
        <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <slot name="header"></slot>
        </div>
      </header>
      <!-- Page Content -->
      <main class="h-4/5 sm:pb-8 pb-4 mb-2">
        <slot></slot>
      </main>
      <footer class="footer text-xs sm:text-sm bg-green-600 flex flex-wrap items-center justify-between p-3 mt-auto">
        <div class="container mx-auto flex flex-col flex-wrap items-center justify-between">

        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import JetApplicationMark from './components/customcomponents/ApplicationMark.vue'
import JetDropdown from './components/customcomponents/Dropdown'
import JetDropdownLink from './components/customcomponents/DropdownLink'
import JetNavLink from './components/customcomponents/NavLink'
import JetResponsiveNavLink from './components/customcomponents/ResponsiveNavLink'
import Toast from "./components/customcomponents/Toast"
import ToastList from "./components/customcomponents/ToastList"
import {mapActions, mapGetters, mapState} from "vuex";

export default {
  created() {
    if (this.user.token != null && localStorage.getItem('user_data') == null) {
      this.retrieveUserData();
    }
  },
  updated() {
    if (this.user.isBanned == 1) {
      this.showBannedMessage();
      this.destroyToken();
      this.timeout = setTimeout(()=> {
        this.user.isBanned = false
        this.clearBannedMessage();
      }, 2000);
    }
    if (this.user.isBanned == 1) {
      this.showBannedMessage();
      this.destroyToken();
      this.timeout = setTimeout(()=> {
        this.user.isBanned = false
        this.clearBannedMessage();
      }, 2000);
    }
    if(this.user.invalidCredentials == 1){
      this.showInvalidCredentialMessage()
      this.timeout = setTimeout(()=> {
        this.user.invalidCredentials = false
        this.clearInvalidCredentialMessage();
      },2000);
    }

  },
  components: {
    JetApplicationMark,
    JetDropdown,
    JetDropdownLink,
    JetNavLink,
    JetResponsiveNavLink,
    Toast,
    ToastList,
  },
  props: {
    searchActive: {
      type: Boolean,
      default: false,
    },
    chartsActive: {
      type: Boolean,
      default: false,
    },
    adminPanelActive: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      showingNavigationDropdown: false,
    }
  },
  computed: {
      authLink(){
        return process.env.VUE_APP_LOGIN;
      },
    ...mapState({
      user: state => state.user,
    }),
    ...mapGetters(['getUserData', 'loggedIn']),
  },
  methods: {
    ...mapActions(['destroyToken', 'retrieveUserData', 'showBannedMessage','clearBannedMessage','showInvalidCredentialMessage','clearInvalidCredentialMessage']),
    getImages(img) {
      return `/${img}`;
    }
  },
}
</script>
