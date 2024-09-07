import './assets/base.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidatePlugin from '@/includes/validation'
import { auth } from '@/includes/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Icon from '@/directives/icon'
import i18n from './includes/i18n'

let app
// check if the user is authenticated when application starts
// https://firebase.google.com/docs/reference/js/auth.md#onauthstatechanged_b0d07ab
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App)

    app.use(router)
    app.use(VeeValidatePlugin)
    app.use(i18n)
    app.use(createPinia())
    app.directive('icon', Icon)

    app.mount('#app')
  }
})
