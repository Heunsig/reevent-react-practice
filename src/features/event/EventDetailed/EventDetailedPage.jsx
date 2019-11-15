import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase'
import { compose } from 'redux'
import { Grid } from 'semantic-ui-react'
// import { toastr } from 'react-redux-toastr'
import EventDetailedHeader from './EventDetailedHeader'
import EventDetailedInfo from './EventDetailedInfo'
import EventDetailedChat from './EventDetailedChat'
import EventDetailedSidebar from './EventDetailedSidebar'
import { objectToArray, createDataTree } from '../../../app/common/util/helpers'
import { goingToEvent, cancelGoingToEvent } from '../../user/userActions'
import { addEventComment } from '../eventActions'

const EventDetailedPage = ({
  event, 
  firestore, 
  match, 
  history, 
  auth, 
  goingToEvent, 
  cancelGoingToEvent,
  addEventComment,
  eventChat
}) => {

  useEffect(() => {

    (async () => {
      await firestore.setListener(`events/${match.params.id}`)
      // if (!event.exists) {
      //   history.push('/events')
      //   toastr.error('Sorry', 'Event no found')
      // }
      return async () => {
        await firestore.unsetListener(`events/${match.params.id}`)
      }
    })()

  }, [firestore, match, history])

  const attendees = event && event.attendees && objectToArray(event.attendees)
  const isHost = event.hostUid === auth.uid
  const isGoing = attendees && attendees.some(a => a.id === auth.uid)
  const chatTree = !isEmpty(eventChat) && createDataTree(eventChat)

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader 
          event={event} 
          isGoing={isGoing} 
          isHost={isHost}
          goingToEvent={goingToEvent}
          cancelGoingToEvent={cancelGoingToEvent}
        />
        <EventDetailedInfo event={event}/>
        <EventDetailedChat
          eventChat={chatTree}
          addEventComment={addEventComment}
          eventId={event.id}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar attendees={attendees}/>
      </Grid.Column>
    </Grid>
  )
}

const mapStateToProps = (state, ownProps) => {
  const eventId = ownProps.match.params.id
  let event = {}

  if (state.firestore.ordered.events && state.firestore.ordered.events.length > 0) {
    event = state.firestore.ordered.events.filter(event => event.id === eventId)[0] || {}
  }

  return { 
    event,
    auth: state.firebase.auth,
    eventChat: !isEmpty(state.firebase.data.event_chat) && 
               objectToArray(state.firebase.data.event_chat[ownProps.match.params.id])
  }
}
export default compose(
  withFirestore,
  connect(mapStateToProps, { goingToEvent, cancelGoingToEvent, addEventComment }),
  firebaseConnect((props) => ([`event_chat/${props.match.params.id}`]))
 )(EventDetailedPage)

 