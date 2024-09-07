<template>
  <!-- Registration Form -->
  <!-- https://vee-validate.logaretm.com/v4/api/form/ -->
  <!-- https://vee-validate.logaretm.com/v4/guide/components/validation/#form-level-validation -->
  <vee-form :validation-schema="registerSchema" @submit="register" :initial-values="userData">
    <!-- alert -->
    <div
      class="text-white text-center font-bold p-4 rounded mb-4"
      v-if="reg_show_alert"
      :class="reg_alert_variant"
    >
      {{ reg_alert_msg }}
    </div>
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.name') }}</label>
      <vee-field
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('auth.enter.name')"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.email') }}</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('auth.enter.email')"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.age') }}</label>
      <vee-field
        name="age"
        type="text"
        :placeholder="$t('auth.enter.age')"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.password') }}</label>
      <!-- https://vee-validate.logaretm.com/v4/api/field/#slots -->
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('auth.enter.password')"
          v-bind="field"
        />
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.confirm_password') }}</label>
      <vee-field
        name="confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('auth.enter.confirm_password')"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('auth.country') }}</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="America">{{ $t('auth.countries.america') }}</option>
        <option value="China">{{ $t('auth.countries.china') }}</option>
        <option value="Mexico">{{ $t('auth.countries.mexico') }}</option>
        <option value="Germany">{{ $t('auth.countries.germany') }}</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- Terms of Service -->
    <div class="mb-3 pl-6">
      <vee-field
        type="checkbox"
        name="tos"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <label class="inline-block">{{ $t('auth.accept_service') }}</label>
      <ErrorMessage class="text-red-600 block" name="tos" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="reg_in_submission"
    >
      {{ $t('auth.submit') }}
    </button>
  </vee-form>
</template>
<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'

export default {
  name: 'RegisterForm',
  props: ['tab'],
  data() {
    return {
      registerSchema: {
        name: 'required|min:3|max:30|alpha_spaces',
        email: 'required|min:3|max:30|email',
        age: 'required|min_value:1|max_value:100',
        password: 'required|min:8|max:30|excluded:password',
        confirm_password: 'required|password_mismatch:@password',
        country: 'required',
        tos: 'tos'
      },
      userData: {
        country: 'America'
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: this.$t('auth.alert.register_wait')
    }
  },
  methods: {
    // https://pinia.vuejs.org/zh/core-concepts/actions.html#without-setup
    ...mapActions(useUserStore, { createUser: 'register' }),
    async register(values) {
      this.reg_show_alert = true
      this.reg_in_submission = true
      this.reg_alert_variant = 'bg-blue-500'
      this.reg_alert_msg = this.$t('auth.alert.register_wait')

      // https://firebase.google.com/docs/auth/web/start?hl=zh-cn#web-modular-api_1
      try {
        await this.createUser(values)
      } catch (error) {
        this.reg_in_submission = false
        this.reg_alert_variant = 'bg-red-500'
        this.reg_alert_msg = this.$t('auth.alert.register_error')
        return
      }

      // Register and login succeess
      this.reg_alert_variant = 'bg-green-500'
      this.reg_alert_msg = this.$t('auth.alert.register_success')

      window.location.reload()
    }
  }
}
</script>
