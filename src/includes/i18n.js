import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import zh from '@/locales/zh.json'

// https://vue-i18n.intlify.dev/guide/essentials/started.html#creating-the-i18n-instance
export default createI18n({
  // https://www.science.co.il/language/Locale-codes.php
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})
