<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <nav class="nav-custom-red" @click="toggle">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div data-toggle="navbar" class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button
              data-toggle="navbar"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500
              hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false">
            <span data-toggle="navbar" class="sr-only">Open main menu</span>
            <!-- Icon when menu is closed. -->
            <!--
              Heroicon name: menu

              Menu open: "hidden", Menu closed: "block"
            -->
            <svg data-toggle="navbar" class="h-6 w-6" :class="is_active ? 'hidden':'block'"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor"
                 aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <!-- Icon when menu is open. -->
            <!--
              Heroicon name: x

              Menu open: "block", Menu closed: "hidden"
            -->
            <svg data-toggle="navbar" class="h-6 w-6" :class="is_active ? 'block':'hidden'"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex-shrink-0 flex items-center">
            <router-link :exact="true" tag="a" to="/" class="text-xl text-white font-bold uppercase">
              <img :src="require('@/assets/nearfolio.svg')" alt="">
            </router-link>
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <router-link
                  :key="nav_item.name"
                  v-for="nav_item in main_nav_items" tag="a"
                  :to="nav_item.to"
                  exact-active-class="bg-gray-900 text-white"
                  :exact="true"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                {{ nav_item.name }}
              </router-link>
              <router-link
                  tag="a"
                  :to="'/create'"
                  exact-active-class="bg-gray-900 text-white"
                  :exact="true"
                  v-if="is_admin"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Mint NFT
              </router-link>
              <router-link
                  tag="a"
                  :to="'/create/collection'"
                  exact-active-class="bg-gray-900 text-white"
                  :exact="true"
                  v-if="is_minter"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Create Collection
              </router-link>
              <router-link
                  tag="a"
                  :to="'/admin'"
                  exact-active-class="bg-gray-900 text-white"
                  :exact="true"
                  v-if="is_minter"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Admin
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="auth"
             class="w-100 absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <!--<button
              class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span class="sr-only">View notifications</span>
            &lt;!&ndash; Heroicon name: bell &ndash;&gt;
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </button>-->

          <!-- Profile dropdown -->
          <UserInfoContainer @click="toggleUser"></UserInfoContainer>
          <div class="ml-3 relative">
            <div>
              <button
                  @click="toggleUser"
                  class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  id="user-menu" aria-haspopup="true">
                <span class="sr-only">Open user menu</span>
                <img
                    v-if="threeBoxUser"
                    class="h-10 w-10 rounded-full"
                    :src="threeBoxUser ? 'https://ipfs.infura.io/ipfs/'+threeBoxUser.image[0].contentUrl['/'] : ''"
                    alt="">
                <i v-else class="fa fa-user h-10 w-10 p-2 flex items-center justify-center" style="font-size: 28px"></i>
              </button>
            </div>
            <!--
              Profile dropdown panel, show/hide based on dropdown state.
              Entering: "transition ease-out duration-100"
                From: "transform opacity-0 scale-95"
                To: "transform opacity-100 scale-100"
              Leaving: "transition ease-in duration-75"
                From: "transform opacity-100 scale-100"
                To: "transform opacity-0 scale-95"
            -->
            <div
                :class="is_user_dropdown_active ? 'block':'sm:hidden hidden'"
                class="z-index-top origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
              <UserInfoContainer :mobile="true" @click="toggleUser"></UserInfoContainer>

              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Collector
                Profile</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Account</a>
              <a @click.prevent="logout" href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                 role="menuitem">Sign out</a>
            </div>
          </div>
        </div>
        <div class="flex  items-center justify-between login-buttons" v-else>
          <i class="text-white text-sm fa fa-key text-gray-300 mr-3"></i>
          <button
              @click="login"
              class="transition duration-300 hover:bg-gray-100 flex mx-2 items-center justify-center button text-gray-300 bg-gray-300
              text-indigo-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            <img class="mx-auto near-img" :src="require('@/assets/near.logo.svg')" alt="">
          </button>
          <button
              v-if="ethereum && false"
              class="transition duration-300 hover:bg-gray-100
              flex mx-2 items-center justify-center button text-gray-300 bg-gray-300 text-indigo-900
              px-3 py-2 rounded-md text-sm font-medium">
            <i class="fab fa-ethereum" :src="require('@/assets/near.logo.svg')" alt=""></i>
          </button>
        </div>
      </div>
    </div>

    <!--
      Mobile menu, toggle classes based on menu state.

      Menu open: "block", Menu closed: "hidden"
    -->
    <div :class="is_active ? 'block':'sm:hidden hidden'">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <router-link
            :key="nav_item.name"
            v-for="nav_item in main_nav_items" tag="a"
            :to="nav_item.to"
            exact-active-class="bg-gray-900"
            :exact="true"
            class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium block">
          {{ nav_item.name }}
        </router-link>
      </div>
    </div>
  </nav>

</template>
<script>
import main_nav_items from '../helpers/main_nav.json'
import {logout, login} from '../utils'
import UserInfoContainer from "@/components/UserInfoContainer";

export default {
  name: "Navigation",
  components: {UserInfoContainer},
  data() {
    return {
      is_active: false,
      is_user_dropdown_active: false,
      main_nav_items,
      is_admin: false
    }
  },
  methods: {
    toggle({target}) {
      if (target.getAttribute('data-toggle') === 'navbar') {
        this.is_active = !this.is_active
      } else {
        this.is_active = false
      }
    },
    toggleUser({target}) {
      this.is_user_dropdown_active = !this.is_user_dropdown_active
    },
    logout,
    login
  },
  computed: {
    accountId() {
      return window.accountId
    },
    ethereum() {
      if (window.ethereum) {
        return window.ethereum
      } else return null
    },
    auth() {
      return window.walletConnection.isSignedIn()
    },
    user() {
      if (this.$store.getters['auth/getAuth']) {
        return this.$store.getters['auth/getUser']
      }
      return window.accountId
    },
    threeBoxUser() {
      return this.$store.getters['get3Box']
    },
    is_minter() {
      return this.$store.getters['getMinter']
    }
  },
  async beforeMount() {
    window.contract.get_contract_owner().then(res => {
      console.log(res)
      const user = window.contract.account.accountId
      if (user !== res) return;
      this.is_admin = window.accountId === res
      this.$store.commit('updateAdmin', this.is_admin = window.accountId === res)
    }).catch(err => console.log(err))
    window.contract.get_minter({accountId: accountId}).then(res => {
      if (res) {
        this.$store.commit('updateMinter')
      }
    }).catch(err => {

    })
  }
}
</script>

<style scoped lang="scss">
.router-link-active {
  color: white !important;
}

.login-buttons {
  button {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      object-fit: cover;
    }
  }
}

.near-img {
  transform: scale(1.5);
}

.z-index-top {
  z-index: 99999;
}
</style>
