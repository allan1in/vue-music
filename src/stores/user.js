import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from '@/includes/firebase'
import { doc, setDoc } from 'firebase/firestore'

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  actions: {
    async register(values) {
      // response include a token for authentication, firebase can store the token and send it for us
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      )
      // send user information, store in firestore database
      // get uid from returns of createUserWithEmailAndPassword()
      // https://firebase.google.com/docs/reference/js/auth.md#createuserwithemailandpassword_21ad33b
      let userID = userCredential.user.uid
      // specify an ID for the firestore document
      // https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document
      await setDoc(doc(db, 'users', userID), {
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country
      })
      // update state
      this.userLoggedIn = true
    },

    async authenticate(values) {
      // https://firebase.google.com/docs/reference/js/auth.md#signinwithemailandpassword_21ad33b
      await signInWithEmailAndPassword(auth, values.email, values.password)
      // update state
      this.userLoggedIn = true
    },

    async signOut() {
      // https://firebase.google.com/docs/reference/js/auth.md#signout_2a61ea7
      await signOut(auth)
      // update state
      this.userLoggedIn = false
    }
  }
})
