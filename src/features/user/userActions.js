import { toastr } from 'react-redux-toastr'
import { 
  asyncActionStart, 
  asyncActionFinish,
  asyncActionError 
} from '../../features/async/asyncActions'
import cuid from 'cuid'
import firebase from '../../app/config/firebase'
import { FETCH_USER_EVENTS } from '../event/eventConstant'


export const updateProfile = (updatedUserData) => 
  async (dispatch, getState, {getFirebase}) => {
    const firestore = firebase.firestore()
    const user = firebase.auth().currentUser
    const today = new Date()

    const { isLoaded, isEmpty, ...updatedUser } = updatedUserData

    let userDocRef = firestore.collection('users').doc(user.uid)
    let eventsDocRef = firestore.collection('events')

    try {
      // await firebase.updateProfile(updatedUser)
      let batch = firestore.batch()
      batch.update(userDocRef, updatedUser)

      let eventsHostedByQuery = await eventsDocRef
        .where('hostUid', '==', user.uid)
        .where('date', '>=', today)

      let eventsHostedBySnap = await eventsHostedByQuery.get()
      
      for (let i = 0 ; i < eventsHostedBySnap.docs.length ; i++) {
        let eventDocRef = await firestore.collection('events').doc(eventsHostedBySnap.docs[i].id)
        batch.update(eventDocRef, {'hostedBy': updatedUser.displayName})
      }
       
      await batch.commit()

      toastr.success('Success', 'Your profile has been updated')
    } catch (error) {
      console.log(error)
    }
  }


export const uploadProfileImage = (file, fileName) => 
  async (dispatch, getState, { getFirebase, getFirestore }) => {
    const imageName = cuid()
    const firebase = getFirebase()
    const firestore = getFirestore()
    const user = firebase.auth().currentUser
    const path = `${user.uid}/user_images`
    const options = {
      name: imageName
    }
    try {  
      dispatch(asyncActionStart())
      // upload the file to firebase storage
      let uploadedFile = await firebase.uploadFile(path, file, null, options)
      // get url of image
      let downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL()
      // get userdoc
      let userDoc = await firestore.get(`users/${user.uid}`)
  
      // check if user has photo, if not update profile
      if (!userDoc.data().photoURL) {
        await firebase.updateProfile({
          photoURL: downloadURL
        })

        await user.updateProfile({
          photoURL: downloadURL
        })
      } 

      // add the image to firestore
      await firestore.add({
        collection: 'users',
        doc: user.uid,
        subcollections: [{collection: 'photos'}]
      }, {
        name: imageName,
        url: downloadURL
      })

      dispatch(asyncActionFinish())
    } catch (error) {
      console.log(error)
      dispatch(asyncActionError())
    }
  }

export const deletePhoto = (photo) => {

  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase()
    const firestore = getFirestore()
    const user = firebase.auth().currentUser

    try {
      await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`)
      await firestore.delete({
        collection: 'users',
        doc: user.uid,
        subcollections: [{collection: 'photos', doc: photo.id}]
      })  
    } catch (error) {
      console.log(error)
      throw new Error('Problem deleting the photo')
    }

  }
}

export const setMainPhoto = (photo) => {
  return async (dispatch, getState) => {
    // const firebase = getFirebase()
    const firestore = firebase.firestore()
    const user = firebase.auth().currentUser
    const today = new Date()
    let userDocRef = firestore.collection('users').doc(user.uid)
    let eventAttendeeRef = firestore.collection('event_attendee')

    try {
      dispatch(asyncActionStart())
      let batch = firestore.batch()
      batch.update(userDocRef, {
        photoURL: photo.url
      })

      let eventQuery = await eventAttendeeRef
        .where('userUid', '==', user.uid)
        .where('eventDate', '>=', today)

      let eventQuerySnap = await eventQuery.get()

      for (let i = 0 ; i < eventQuerySnap.docs.length ; i++) {
        let eventDocRef = await firestore.collection('events').doc(eventQuerySnap.docs[i].data().eventId)
         
        let event = await eventDocRef.get()
        if (event.data().hostUid === user.uid) {
          batch.update(eventDocRef, {
            hostPhotoURL: photo.url,
            [`attendees.${user.uid}.photoURL`]: photo.url
          })
        } else {
          batch.update(eventDocRef, {
            [`attendees.${user.uid}.photoURL`]: photo.url
          })
        }
      }

      console.log(batch)
      await batch.commit()
      dispatch(asyncActionFinish())
    } catch (error) {
      console.log(error)
      dispatch(asyncActionError())
      throw new Error('Problem setting main photo')
    }
  }
}

export const goingToEvent = (event) => {
  return async (dispatch, getState) => {
    dispatch(asyncActionStart())
    const firestore = firebase.firestore()
    const user = firebase.auth().currentUser
    const profile = getState().firebase.profile
    const attendee = {
      going: true,
      joinDate: new Date(),
      photoURL: profile.photoURL || '/assets/user.png',
      displayName: profile.displayName,
      host: false
    }

    try {
      let eventDocRef = firestore.collection('events').doc(event.id)
      let eventAttendeeDocRef = firestore.collection('event_attendee').doc(`${event.id}_${user.uid}`)

      await firestore.runTransaction(async (transaction) => {
        await transaction.get(eventDocRef)
        await transaction.update(eventDocRef, {
          [`attendees.${user.uid}`]: attendee  
        })
        await transaction.set(eventAttendeeDocRef, {
          eventId: event.id,
          userUid: user.uid,
          eventDate: event.date,
          host: false
        })
      })

      // await firestore.update(`events/${event.id}`, {
      //   [`attendees.${user.uid}`]: attendee
      // })
      // await firestore.set(`event_attendee/${event.id}_${user.uid}`, {
      //   eventId: event.id,
      //   userUid: user.uid,
      //   eventDate: event.date,
      //   host: false
      // })
  
      dispatch(asyncActionFinish())
      toastr.success('Success', 'You have signed up to the event')
    } catch (error) {
      console.log(error)
      dispatch(asyncActionError())
      toastr.error('Oops', 'Problem signing up to the event')
    }
  }
}

export const cancelGoingToEvent = (event) => {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore()
    const firebase = getFirebase()
    const user = firebase.auth().currentUser

    try {
      await firestore.update(`events/${event.id}`, {
        [`attendees.${user.uid}`]: firestore.FieldValue.delete()
      })

      await firestore.delete(`event_attendee/${event.id}_${user.uid}`)
      toastr.success('Success', 'You have removed yourself from the event')
    } catch (error) {
      console.log(error)
    }
  } 
}

export const getUserEvents = (userUid, activeTab) => {
  return async (dispatch, getState) => {
    dispatch(asyncActionStart())
    const firestore = firebase.firestore()
    const today = new Date(Date.now())
    let eventsRef = firestore.collection('event_attendee')
    let query
    switch (activeTab) {
      case 1: // past events
        query = eventsRef
          .where('userUid', '==', userUid)
          .where('eventDate', '<=', today)
          .orderBy('eventDate', 'desc')
        break
      case 2: // future events
        query = eventsRef
          .where('userUid', '==', userUid)
          .where('eventDate', '>=', today)
          .orderBy('eventDate')
        break
      case 3: // hosted events
        query = eventsRef
          .where('userUid', '==', userUid)
          .where('host', '==', true)
          .orderBy('eventDate', 'desc')
        break
      default:
        query = eventsRef
          .where('userUid', '==', userUid)
          .orderBy('eventDate', 'desc')
    }

    try {
      let querySnap = await query.get()
      let events = []

      for (let i = 0 ; i < querySnap.docs.length ; i++) {
        let evt = await firestore.collection('events').doc(querySnap.docs[i].data().eventId).get()
        events.push({...evt.data(), id: evt.id})
      }
      
      dispatch({type: FETCH_USER_EVENTS, payload: {events}})
      dispatch(asyncActionFinish())
    } catch (error) {
      console.log(error)
      dispatch(asyncActionError())
    }
  }
}

export const followUser = (userToFollow) => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore()
    const user = firebase.auth().currentUser
    const following = {
      displayName: userToFollow.displayName,
      city: userToFollow.city || 'Unkown City',
      photoURL: userToFollow.photoURL || '/assets/user.png'
    }

    try {

      await firestore.set({
        collection: 'users',
        doc: user.uid,
        subcollections:[{ collection: 'following', doc: userToFollow.id }]
      }, following)

      toastr.success('Success', `You begin to follow ${userToFollow.displayName}`)
    } catch (error) {
      console.log(error)
    }
  }
}

export const unfollowUser = (userToUnfollow) => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = firebase.firestore()
    const user = firebase.auth().currentUser

    try {
      await firestore.collection('users')
                      .doc(user.uid)
                      .collection('following')
                      .doc(userToUnfollow.id)
                      .delete()


      toastr.success('Success', `You unfollowed ${userToUnfollow.displayName}`)
    } catch (error) {
      console.log(error)
    }
  }
}

// export const getFollowingUsers = () => {
//   return async (dispatch, getState, { getFirestore }) => {
//     const firestore = firebase.firestore()
//     const user = firebase.auth().currentUser
//     let followingUsersRef = firestore.collection('users').doc(user.uid).collection('following')
//     try {
//       const followingUsers = {}
//       const querySnap = await followingUsersRef.get()

//       for (let i = 0 ; i < querySnap.docs.length ; i++) {
//         followingUsers[querySnap.docs[i].id] = querySnap.docs[i].data()
//       }

//       dispatch({
//         type: 'FETCH_FOLLOWING_USERS',
//         payload: {
//           followingUsers
//         }
//       })
//     } catch (error) {
//       console.log(error)
//     }
//   }
// }