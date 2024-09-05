<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <!-- https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i>
          {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { storage, auth, songsDocument, db } from '@/includes/firebase'
import { addDoc, collection, getDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export default {
  name: 'Upload',
  data() {
    return {
      is_dragover: false,
      uploads: []
    }
  },
  props: {
    addSong: {
      type: Function,
      required: true
    }
  },
  methods: {
    upload($event) {
      this.is_dragover = false
      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]
      files.forEach((file) => {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        if (file.type !== 'audio/mpeg') {
          return
        }

        // https://firebase.google.com/docs/storage/web/create-reference?authuser=0#create_a_reference
        // Create a child reference
        const songsRef = ref(storage, `songs/${file.name}`) // each file will upload to 'music-back-end.appspot.com/songs/${file.name}'

        // https://firebase.google.com/docs/storage/web/upload-files?authuser=0#monitor_upload_progress
        const uploadTask = uploadBytesResumable(songsRef, file)

        // Initial each file object and record the file index in array
        const uploadIndex =
          this.uploads.push({
            uploadTask,
            current_progress: 0,
            name: file.name,
            variant: 'bg-blue-400',
            icon: 'fas fa-spinner fa-spin',
            text_class: ''
          }) - 1

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            // Update progress for each file
            this.uploads[uploadIndex].current_progress = progress
          },
          (error) => {
            // Handle unsuccessful uploads
            this.uploads[uploadIndex].variant = 'bg-red-400'
            // Search for icon class: https://fontawesome.com/search
            this.uploads[uploadIndex].icon = 'fas fa-times'
            this.uploads[uploadIndex].text_class = 'text-red-400'
            // List of error codes: https://firebase.google.com/docs/storage/web/handle-errors?authuser=0#handle_error_messages
          },
          async () => {
            // Handle successful uploads on complete
            // Record message and send to firestore
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              // Original name never change
              original_name: uploadTask.snapshot.ref.name,
              modified_name: uploadTask.snapshot.ref.name,
              genre: '',
              comment_count: 0
            }
            song.url = await getDownloadURL(uploadTask.snapshot.ref)
            // https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document
            const songRef = await addDoc(collection(db, songsDocument), song)
            // The function addSong needs a snapshot
            // https://firebase.google.com/docs/reference/js/firestore_.md#getdoc_4569087
            const songSnapshot = await getDoc(songRef)
            this.addSong(songSnapshot)

            // Update styles
            this.uploads[uploadIndex].variant = 'bg-green-400'
            this.uploads[uploadIndex].icon = 'fas fa-check'
            this.uploads[uploadIndex].text_class = 'text-green-400'
          }
        )
      })
    }
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      // https://firebase.google.com/docs/storage/web/upload-files?authuser=0#manage_uploads
      upload.uploadTask.cancel()
    })
  }
}
</script>
