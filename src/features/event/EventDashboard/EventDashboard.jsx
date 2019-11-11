import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import EventList from '../EventList/EventList'
import EventActivity from '../EventActivity/EventActivity'
// import {
//   createEvent,
//   updateEvent
// } from '../eventActions'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'

class EventDashboard extends Component {
  render() {
    const { events } = this.props
    if (!isLoaded(events)) return <LoadingComponent inverted={false}/>

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList 
            events={events} 
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.firestore.ordered.events,
    // loading: state.async.loading
  }
}

// const actions = {
//     createEvent,
//     updateEvent
// }

export default connect(
  mapStateToProps, 
  null
)(firestoreConnect([{collection: 'events'}])(EventDashboard))