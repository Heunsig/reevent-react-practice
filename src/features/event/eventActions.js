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

export const updateEvent = (event) => {
  return async (dispatch, getState, { getFirebase, getFirestore}) => {
    const firestore = getFirestore()
    try {
      
      await firestore.update(`events/${event.id}`, event)
      // dispatch({
      //   type: UPDATE_EVENT,
      //   payload:{
      //     event
      //   }
      // })
      toastr.success('Success!', 'Event has been created')
    } catch (error) {
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