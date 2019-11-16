import {
  // CREATE_EVENT,
  // UPDATE_EVENT,
  // DELETE_EVENT,
  FETCH_EVENTS
} from './eventConstant'

import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from '../async/asyncActions'

import { toastr } from 'react-redux-toastr'
import { fetchSampleData } from '../../app/data/mockApi'
import { createNewEvent } from '../../app/common/util/helpers'
import firebase from '../../app/config/firebase'

export const createEvent = (event) => {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore()
    const firebase = getFirebase()
    const user = firebase.auth().currentUser
    const photoURL = getState().firebase.profile.photoURL
    const newEvent = createNewEvent(user, photoURL, event)
    try {
      let createdEvent = await firestore.add('events', newEvent)
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true
      })
      // dispatch({
      //   type: CREATE_EVENT,
      //   payload:{
      //     event
      //   }
      // })
      toastr.success('Success!', 'Event has been created')

      return createdEvent
    } catch (error) {
      toastr.success('Oops', 'Something went wrong')
    } 
  }
}

export const updateEvent = event => {
  return async (dispatch, getState) => {
    const firestore = firebase.firestore()
    // const firestore = getFirestore()
    try {
      dispatch(asyncActionStart())
      let eventDocRef = firestore.collection('events').doc(event.id)
      let dateEqual = getState().firestore.ordered.events[0].date.isEqual(event.date)
      if (!dateEqual) {
        let batch = firestore.batch()
        batch.update(eventDocRef, event)

        let eventAttendeeRef = firestore.collection('event_attendee')
        let eventAttendeeQuery = await eventAttendeeRef.where('eventId', '==', event.id)
        let eventAttendeeQuerySnap = await eventAttendeeQuery.get()

        for (let i = 0 ; i < eventAttendeeQuerySnap.docs.length ; i++) {
          let eventAttendeeDocRef = await firestore.collection('event_attendee').doc(eventAttendeeQuerySnap.docs[i].id)

          batch.update(eventAttendeeDocRef, {
            eventDate: event.date
          })
        }

        await batch.commit()
      } else {
        await eventDocRef.update(event)
      }

      dispatch(asyncActionFinish())
      // await firestore.update(`events/${event.id}`, event)
      toastr.success('Success!', 'Event has been created')
    } catch (error) {
      dispatch(asyncActionError())
      toastr.success('Oops', 'Something went wrong')
    } 
  }
}

export const cancelToggle = (cancelled, eventId) => {
  return async (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore()
     const message = cancelled ? 'Are you sure you want to cancel the event?' : 'This will reactiviate the event, are you sure?'
    try {
      toastr.confirm(message, {
        onOk: async () => await firestore.update(`events/${eventId}`, {
          cancelled: cancelled
        })
      })
      
    } catch (error) {
      console.log(error)
    }
  }
}


// export const deleteEvent = (eventId) => {
//   return {
//     type: DELETE_EVENT,
//     payload: {
//       eventId
//     }
//   }
// }

export const loadEvents = () => {
  return async dispatch => {
    try {
      dispatch(asyncActionStart())
      const events = await fetchSampleData()
      dispatch({
        type: FETCH_EVENTS, 
        payload: { events }
      })
      dispatch(asyncActionFinish())
    } catch (error) {
      console.log(error)
      dispatch(asyncActionError())
    }
  }
}

export const getEventsForDashboard = (lastEvent) => {
  return async (dispatch, getState) =>{
    let today = new Date()
    const firestore = firebase.firestore()
    const eventsRef = firestore.collection('events').where('date', '>=', today)
    try {
      dispatch(asyncActionStart())
      let startAfter = lastEvent && await firestore.collection('events').doc(lastEvent.id).get()
      // let querySnap = await eventsQuery.get()
      let query

      lastEvent ? query = eventsRef.orderBy('date').startAfter(startAfter).limit(2)
      : query = eventsRef.orderBy('date').limit(2)

      let querySnap = await query.get()

      if (querySnap.docs.length === 0) {
        dispatch(asyncActionFinish())
        return querySnap
      }

      let events = []

      for (let i = 0 ; i < querySnap.docs.length ; i++) {
        let evt = {...querySnap.docs[i].data(), id: querySnap.docs[i].id}
        events.push(evt)
      }

      dispatch({
        type: FETCH_EVENTS,
        payload: { events }
      })
      dispatch(asyncActionFinish())
      return querySnap
    } catch (error) {
      console.log(error)
      dispatch(asyncActionError())
    }
  }
}

export const addEventComment= (eventId, values, parentId) => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase()
    const profile = getState().firebase.profile
    const user = firebase.auth().currentUser

    let newComment = {
      parentId: parentId,
      displayName: profile.displayName,
      photoURL: profile.photoURL || '/assets/user.png',
      uid: user.uid,
      text: values.comment,
      date: Date.now()
    }

    try {
      await firebase.push(`event_chat/${eventId}`, newComment)
    } catch (error) {
      console.log(error)
      toastr.error('Oops', 'Problem adding comment')
    }
  }
}