<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{ $t('home.title') }}</h1>
          <p class="w-full md:w-8/12 mx-auto">
            {{ $t('home.desc') }}
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">{{ $t('home.songs') }}</span>
          <!-- Icon -->
          <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <song-item v-for="song in songs" :key="song.docID" :song="song"></song-item>
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>
<script>
import SongItem from '@/components/SongItem.vue'
import { songsDocument, db, songsCollection } from '@/includes/firebase'
import { getDocs, getDoc, limit, orderBy, query, startAfter, doc } from 'firebase/firestore'

export default {
  name: 'Home',
  data() {
    return {
      songs: [],
      maxPerPage: 1,
      pendingRequest: false
    }
  },
  components: {
    SongItem
  },
  async created() {
    this.getSongs()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement
      const { innerHeight } = window
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

      if (bottomOfWindow) {
        this.getSongs()
      }
    },
    async getSongs() {
      // Cannot request before response is returned
      if (this.pendingRequest) {
        return
      }
      this.pendingRequest = true

      // Not first query
      let querySnapshot
      if (this.songs.length) {
        // https://firebase.google.com/docs/firestore/query-data/query-cursors?authuser=0#paginate_a_query
        // Get the last document by docID
        // https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0#get_a_document
        const lastSnapshot = await getDoc(
          doc(db, songsDocument, this.songs[this.songs.length - 1].docID)
        )
        // Query docs after last snapshot
        querySnapshot = await getDocs(
          query(
            songsCollection,
            orderBy('modified_name'),
            startAfter(lastSnapshot),
            limit(this.maxPerPage)
          )
        )
      } else {
        // First qurey
        querySnapshot = await getDocs(
          query(songsCollection, orderBy('modified_name'), limit(this.maxPerPage))
        )
      }
      querySnapshot.forEach((doc) => {
        this.songs.push({
          docID: doc.id,
          ...doc.data()
        })
      })

      this.pendingRequest = false
    }
  }
}
</script>
