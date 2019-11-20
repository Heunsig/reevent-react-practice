const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const newActivity = (type, event, id) => {
  return {
    type: type,
    eventDate: event.date,
    hostedBy: event.hostedBy,
    title: event.title,
    photoURL: event.hostPhotoURL,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    hostUid: event.hostUid,
    eventId: id
  }
}

exports.createActivity = functions.firestore
  .document('events/{eventId}')
  .onCreate(event => {
    let newEvent = event.data()

    console.log({newEvent})

    const activity = newActivity('newEvent', newEvent, event.id)

    console.log({activity})

    return admin.firestore().collection(`activity`)
      .add(activity)
      .then((docRef) => { 
        return console.log('Activity created with ID: ', docRef.id)
      })
      .catch((err) => {
        return console.log('Error adding activity', err)
      })
  })


 exports.cancelActivity = functions.firestore
   .document('events/{eventId}')
   .onUpdate((event, context) => {
     let updatedEvent = event.after.data()
     let previousEventData = event.before.data()
     console.log({event})
     console.log({context})
     console.log({updatedEvent})
     console.log({previousEventData})

     if (!updatedEvent.cancelled || updatedEvent.cancelled === previousEventData.cancelled) 
       return false

     const activity = newActivity('cancelledEvent', updatedEvent, context.params.eventId)

     console.log({activity})

     return admin.firestore().collection(`activity`)
      .add(activity)
      .then((docRef) => {
        return console.log('Activity created with ID: ', docRef.id)
      })
      .catch((err) => {
        return console.log('Error adding activity', err)
      })
   })

 exports.followUserActivity = functions.firestore
    .document('users/{userId}/{followingCollectionId}/{followingUserId}')
    .onCreate(async (event, context) => {
      if (context.params.followingCollectionId === 'following') {

        console.log({context})

        let userDocRef = await admin.firestore().collection('users').doc(context.params.userId).get()
        let userData = userDocRef.data()

        return admin.firestore()
        .collection('users')
        .doc(context.params.followingUserId)
        .collection('follower')
        .doc(context.params.userId)
        .set({
          displayName: userData.displayName,
          city: userData.city || 'Unkown City',
          photoURL: userData.photoURL || '/assets/user.png'
         })
         .then((docRef) => {
            return console.log('Activity created with ID: ', docRef.id)
          })
          .catch((err) => {
            return console.log('Error adding activity', err)
          })
      }

      return false
    })

 exports.unfollowUserActivity = functions.firestore
   .document('users/{userId}/{subCollection}/{followingUserId}')
   .onDelete(async (event, context) => {
     console.log({context})
     if (context.params.subCollection === 'following') {
       console.log({context})
       return admin.firestore()
         .collection('users') 
         .doc(context.params.followingUserId)
         .collection('follower')
         .doc(context.params.userId)
         .delete()
     }
     return false
   })