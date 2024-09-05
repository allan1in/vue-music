<template>
  <!-- Composition Items -->
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = true"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4 rounded"
        v-if="show_alert"
        :class="alert_vatiant"
      >
        {{ alert_message }}
      </div>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsaveFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsaveFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="showForm = false"
          :disabled="in_submission"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>
<script>
import { db, songsDocument, storage } from '@/includes/firebase'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true
    },
    updateSong: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    removeSong: {
      type: Function,
      required: true
    },
    updateUnsaveFlag: {
      type: Function
    }
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces'
      },
      in_submission: false,
      show_alert: false,
      alert_vatiant: 'bg-blue-500',
      alert_message: 'Please wait! Updating song info.'
    }
  },
  methods: {
    async edit(values) {
      this.in_submission = true
      this.show_alert = true
      this.alert_vatiant = 'bg-blue-500'
      this.alert_message = 'Please wait! Updating song info.'

      // https://firebase.google.com/docs/firestore/manage-data/add-data?authuser=0#update-data
      try {
        await updateDoc(doc(db, songsDocument, this.song.docID), values)
      } catch (error) {
        this.in_submission = false
        this.alert_vatiant = 'bg-red-500'
        this.alert_message = 'Something went wrong! Try again later'
        return
      }

      this.updateSong(this.index, values)
      this.updateUnsaveFlag(false)

      this.in_submission = false
      this.alert_vatiant = 'bg-green-500'
      this.alert_message = 'Success!'
    },
    async deleteSong() {
      const songRef = ref(storage, `songs/${this.song.original_name}`)

      // Delete the file in storage
      // https://firebase.google.com/docs/storage/web/delete-files?authuser=0#delete_a_file
      await deleteObject(songRef)
      // Delete the infomation in firestore
      // https://firebase.google.com/docs/firestore/manage-data/delete-data?authuser=0#delete_documents
      await deleteDoc(doc(db, songsDocument, this.song.docID))

      this.removeSong(this.index)
    }
  }
}
</script>
