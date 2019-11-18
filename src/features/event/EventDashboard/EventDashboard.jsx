import React, { Component, createRef } from 'react'
import { Grid, Loader } from 'semantic-ui-react'
import { connect } from 'react-redux'
import EventList from '../EventList/EventList'
import EventActivity from '../EventActivity/EventActivity'
// import {
//   createEvent,
//   updateEvent
// } from '../eventActions'
import { getEventsForDashboard } from '../eventActions'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { firestoreConnect } from 'react-redux-firebase'

class EventDashboard extends Component {
  contextRef = createRef()

  state = {
    moreEvents: false,
    loadingInitial: true,
    loadedEvents: [],
  }

  async componentDidMount () {
    let next = await this.props.getEventsForDashboard()

    if (next && next.docs && next.docs.length > 1) {
      this.setState({
        moreEvents: true,
        loadingInitial: false
      })
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.events !== prevProps.events) {
      this.setState({
        loadedEvents: [...this.state.loadedEvents, ...this.props.events]
      })
    }
  }

  getNextEvents = async () => {
    const { events } = this.props
    let lastEvent = events && events[events.length -1]
    let next = await this.props.getEventsForDashboard(lastEvent)
    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreEvents: false
      })
    }
  }


  render() {
    const { loading, activities } = this.props
    const { moreEvents, loadedEvents, loadingInitial } = this.state

    if (loadingInitial) return <LoadingComponent inverted={false}/>

    return (
      <Grid>
        <Grid.Column width={10}>
          <div ref={this.contextRef}>
            <EventList 
              events={loadedEvents} 
              getNextEvents={this.getNextEvents}
              loading={loading}
              moreEvents={moreEvents}
            />

          </div>
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity activities={activities} contextRef={this.contextRef}/>
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loading}/>
        </Grid.Column>
      </Grid>
    )
  }
}

const query = [
  {
    collection: 'activity',
    orderBy: ['timestamp', 'desc'],
    limit: 5
  }
]

const mapStateToProps = (state) => {
  return {
    events: state.events.events,
    loading: state.async.loading,
    activities: state.firestore.ordered.activity
    // events: state.firestore.ordered.events,
    // loading: state.async.loading
  }
}

// const actions = {
//     createEvent,
//     updateEvent
// }

export default connect(
  mapStateToProps, 
  {
    getEventsForDashboard
  }
)(firestoreConnect(query)(EventDashboard))