import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import EventList from '../EventList/EventList'
import {
  createEvent,
  updateEvent,
  deleteEvent
} from '../eventActions'
import LoadingComponent from '../../../app/layout/LoadingComponent'

class EventDashboard extends Component {
  handleDeleteEvent = (id) => {
    this.props.deleteEvent(id)
  }

  render() {
    const { events, loading } = this.props
    if (loading) return <LoadingComponent inverted={false}/>

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList 
            events={events} 
            deleteEvent={this.handleDeleteEvent}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <h2>Activity Feed</h2>
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.events,
    loading: state.async.loading
  }
}

const mapDispatchToProps = {
    createEvent,
    updateEvent,
    deleteEvent
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDashboard)