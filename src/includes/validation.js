import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure
} from 'vee-validate'
// learn rules from https://vee-validate.logaretm.com/v4/guide/global-validators#vee-validaterules
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

// install vee-validate global components
// learn vue-plugins from https://cn.vuejs.org/guide/reusability/plugins#introduction
export default {
  install(app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)
    // learn defineRule from https://vee-validate.logaretm.com/v4/guide/global-validators/#vee-validaterules
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
    // learn configure from https://vee-validate.logaretm.com/v4/api/configuration/#config-options
    configure({
      // customize error message for rules
      generateMessage: (context) => {
        const messages = {
          required: `The field ${context.field.replace('_', ' ')} is required.`,
          min: `The field ${context.field} is too short`,
          max: `The field ${context.field} is too long`,
          alpha_spaces: `The field ${context.field} may only contain alphabetical characters and spaces`,
          email: `The field ${context.field} must be a valid email`,
          min_value: `The field ${context.field} is too low`,
          max_value: `The field ${context.field} is too high`,
          excluded: `You are not allowed to use this value for the field ${context.field}`,
          password_mismatch: `The password don't match`,
          tos: `You must accept the Terms of Service`
        }

        const message = messages[context.rule.name]
          ? messages[context.rule.name]
          : `The field ${context.field} is invalid`

        return message
      },

      // customize validate triggers
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true
    })
  }
}
