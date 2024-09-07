import { defineStore } from 'pinia'
import { Howl } from 'howler'
import helper from '@/includes/helper'

export default defineStore('player', {
  state: () => ({
    current_song: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%'
  }),
  actions: {
    async newSong(song) {
      // Distroy the Howl object already existed
      if (this.sound instanceof Howl) {
        // https://github.com/goldfire/howler.js?tab=readme-ov-file#unload
        this.sound.unload()
      }
      this.current_song = song

      // https://github.com/goldfire/howler.js/blob/master/src/howler.core.js#L567
      this.sound = new Howl({
        src: [song.url],
        // Use HTML5 API to get audio file
        html5: true
      })

      this.sound.play()

      // Start to render progress bar
      // https://github.com/goldfire/howler.js?tab=readme-ov-file#onevent-function-id
      this.sound.on('play', () => {
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
        requestAnimationFrame(this.progress)
      })
    },
    async toggleAudio() {
      // Check if the sound object is existed
      if (!this.sound.playing) {
        return
      }

      // https://github.com/goldfire/howler.js/blob/master/src/howler.core.js#L1698
      if (this.sound.playing()) {
        this.sound.pause()
      } else {
        this.sound.play()
      }
    },
    progress() {
      // https://github.com/goldfire/howler.js?tab=readme-ov-file#seekseek-id
      this.seek = helper.formatTime(this.sound.seek())
      // https://github.com/goldfire/howler.js?tab=readme-ov-file#durationid
      this.duration = helper.formatTime(this.sound.duration())

      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress)
      }
    },
    updateSeek(event) {
      if (!this.sound.playing) {
        return
      }

      // Calculate percentage by click position
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
      const { x, width } = event.currentTarget.getBoundingClientRect()
      // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX
      const clickX = event.clientX - x
      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage

      this.sound.seek(seconds)
      // Update progress bar after finishing seek event
      // https://github.com/goldfire/howler.js?tab=readme-ov-file#onceevent-function-id
      this.sound.once('seek', this.progress)
    }
  },
  // https://pinia.vuejs.org/zh/core-concepts/getters.html#getters
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing()
      }

      return false
    }
  }
})
