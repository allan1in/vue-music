<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <!-- https://router.vuejs.org/zh/guide/essentials/active-links.html -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
        >Music</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <!-- <li>
            <router-link class="px-2 text-white" :to="{ name: 'about' }">About</router-link>
          </li> -->
          <li v-if="!userStore.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleForm">{{
              $t('header.login_or_register')
            }}</a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">{{
                $t('header.manage')
              }}</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signOut">{{
                $t('header.logout')
              }}</a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a class="px-2 text-white" href="#" @click.prevent="changeLocale">{{
              currentLocale
            }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
<script>
import { mapStores, mapActions } from 'pinia'
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'
import { setLocale } from '@vee-validate/i18n'

export default {
  name: 'Header',
  computed: {
    ...mapStores(useUserStore),
    currentLocale() {
      return this.$i18n.locale === 'zh' ? 'English' : '中文'
    }
  },
  methods: {
    ...mapActions(useModalStore, ['toggleForm']),
    signOut() {
      this.userStore.signOut()
      // leave from manage page
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'home' })
      }
    },
    changeLocale() {
      // https://vue-i18n.intlify.dev/guide/essentials/scope.html#locale-changing
      this.$i18n.locale = this.$i18n.locale === 'zh' ? 'en' : 'zh'
      setLocale(this.$i18n.locale)
    }
  }
}
</script>
