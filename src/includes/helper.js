export default {
  // Accept the time in seconds
  formatTime(time) {
    const minutes = Math.floor(time / 60) || 0
    const seconds = Math.round(time - minutes * 60 || 0)

    return `${minutes < 10 ? '0' : ''}${minutes < 100 ? minutes : '99'}:${seconds < 10 ? '0' : ''}${seconds < 100 ? seconds : '99'}`
  }
}
