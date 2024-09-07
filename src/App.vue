<template>
  <Header></Header>

  <!-- https://router.vuejs.org/guide/advanced/transitions.html#Transitions -->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <player></player>

  <Auth></Auth>
</template>
<script>
import { mapWritableState } from 'pinia'
import Auth from './components/Auth.vue'
import Header from './components/Header.vue'
import useUserStrore from '@/stores/user'
import { auth } from '@/includes/firebase'
import Player from './components/Player.vue'

export default {
  name: 'App',
  components: {
    Header,
    Auth,
    Player
  },
  computed: {
    ...mapWritableState(useUserStrore, ['userLoggedIn'])
  },
  created() {
    // https://firebase.google.com/docs/reference/js/auth.auth.md#auth_interface
    if (auth.currentUser) {
      this.userLoggedIn = true
    }
  }
}
</script>
<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.3s linear;
}

.fade-leave-to {
  transition: all 0.3s linear;
  opacity: 0;
}
</style>
