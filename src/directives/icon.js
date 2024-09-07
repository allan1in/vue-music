// The v-icon directive
// Temporarily deprecated, because it will cause loss of reactivity
export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value.name} text-xl text-green-400`

    // Check args
    if (binding.arg === 'full') {
      iconClass = binding.value
    }

    // Check modifiers
    if (binding.modifiers.right) {
      iconClass += ' float-right'
    }

    // Check values
    if (binding.value.size) {
      iconClass += ` text-${binding.value.size}`
    }

    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
