import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { withFirestore } from 'react-redux-firebase'
import { Grid } from 'semantic-ui-react'
import { toastr } from 'react-redux-toastr'
import EventDetailedHeader from './EventDetailedHeader'
import EventDetailedInfo from './EventDetailedInfo'
import EventDetailedChat from './EventDetailedChat'
import EventDetailedSidebar from './EventDetailedSidebar'
import { objectToArray } from '../../../app/common/util/helpers'

const EventDetailedPage = ({event, firestore, match, history}) => {

  useEffect(() => {

    (async () => {
      let event = await firestore.get(`events/${match.params.id}`)
      if (!event.exists) {
        history.push('/events')
        toastr.error('Sorry', 'Event no found')
      }
    })()

  }, [firestore, match, history])

  const attendees = event && event.attendees && objectToArray(event.attendees)

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader event={event}/>
        <EventDetailedInfo event={event}/>
        <EventDetailedChat/>
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
    event
  }
}
export default withFirestore(connect(mapStateToProps)(EventDetailedPage));