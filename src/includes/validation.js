import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure
} from 'vee-validate'
// https://vee-validate.logaretm.com/v4/guide/global-validators#vee-validaterules
import {
  required,
  min,
  max,
  alpha_spaces,
  email,
  min_value,
  max_value,
  confirmed,
  not_one_of as excluded
} from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import { setLocale } from '@vee-validate/i18n'
import en from '@/locales/validation/en'
import zh from '@/locales/validation/zh'

// Install vee-validate global components
// https://cn.vuejs.org/guide/reusability/plugins#introduction
export default {
  install(app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)
    // https://vee-validate.logaretm.com/v4/guide/global-validators/#vee-validaterules
    defineRule('required', required)
    defineRule('tos', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('alpha_spaces', alpha_spaces)
    defineRule('email', email)
    defineRule('min_value', min_value)
    defineRule('max_value', max_value)
    defineRule('password_mismatch', confirmed)
    defineRule('excluded', excluded)

    // https://vee-validate.logaretm.com/v4/api/configuration/#config-options
    configure({
      // Customize error message without i18n
      // generateMessage: (context) => {
      //   const messages = {
      //     required: `The field ${context.field.replace('_', ' ')} is required.`,
      //     min: `The field ${context.field} is too short`,
      //     max: `The field ${context.field} is too long`,
      //     alpha_spaces: `The field ${context.field} may only contain alphabetical characters and spaces`,
      //     email: `The field ${context.field} must be a valid email`,
      //     min_value: `The field ${context.field} is too low`,
      //     max_value: `The field ${context.field} is too high`,
      //     excluded: `You are not allowed to use this value for the field ${context.field}`,
      //     password_mismatch: `The password don't match`,
      //     tos: `You must accept the Terms of Service`
      //   }

      //   const message = messages[context.rule.name]
      //     ? messages[context.rule.name]
      //     : `The field ${context.field} is invalid`

      //   return message
      // },

      // Customize error message with i18n
      // https://vee-validate.logaretm.com/v4/guide/i18n/#using-vee-validatei18n
      generateMessage: localize({
        en,
        zh
      }),

      // Customize validate triggers
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true
    })

    // Set default locale
    setLocale('zh')
  }
}
