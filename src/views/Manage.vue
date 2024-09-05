<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload :addSong="addSong"></app-upload>
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <composition-item
              v-for="(song, index) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :index="index"
              :removeSong="removeSong"
              :updateUnsaveFlag="updateUnsaveFlag"
            ></composition-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import CompositionItem from '@/components/CompositionItem.vue'
import AppUpload from '@/components/Upload.vue'
import { auth, db } from '@/includes/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default {
  name: 'Manage',
  components: {
    AppUpload,
    CompositionItem
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false
    }
  },
  async created() {
    // https://firebase.google.com/docs/firestore/query-data/queries?authuser=0#execute_a_query
    const q = query(collection(db, 'songs'), where('uid', '==', auth.currentUser.uid))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(this.addSong)
  },
  methods: {
    updateSong(index, values) {
      this.songs[index].modified_name = values.modified_name
      this.songs[index].genre = values.genre
    },
    removeSong(index) {
      this.songs.splice(index, 1)
    },
    addSong(doc) {
      const song = {
        ...doc.data(),
        docID: doc.id
      }
      this.songs.push(song)
    },
    updateUnsaveFlag(value) {
      this.unsavedFlag = value
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next()
    } else {
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?')
      // The confirm function will return a boolean value
      next(leave)
    }
  }
}
</script>
