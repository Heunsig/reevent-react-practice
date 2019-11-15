import React, { Component } from 'react'
import { Grid, Button, Loader } from 'semantic-ui-react'
import { connect } from 'react-redux'
import EventList from '../EventList/EventList'
import EventActivity from '../EventActivity/EventActivity'
// import {
//   createEvent,
//   updateEvent
// } from '../eventActions'
import { getEventsForDashboard } from '../eventActions'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'

class EventDashboard extends Component {
  state = {
    moreEvents: false,
    loadingInitial: true,
    loadedEvents: []
  }

  async componentDidMount () {
    let next = await this.props.getEventsForDashboard()
    console.log(next)

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
    // console.log(lastEvent)
    let next = await this.props.getEventsForDashboard(lastEvent)
    // console.log(next)
    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreEvents: false
      })
    }
  }


  render() {
    const { events, loading } = this.props
    const { moreEvents, loadedEvents, loadingInitial } = this.state

    if (loadingInitial) return <LoadingComponent inverted={false}/>

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList 
            events={loadedEvents} 
            getNextEvents={this.getNextEvents}
            loading={loading}
            moreEvents={moreEvents}
          />
          {/*<Button 
            loading={loading}
            onClick={this.getNextEvents} 
            disabled={!this.state.moreEvents} 
            content='More' 
            color='green' 
            floated='right'
          />*/}
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loading}/>
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.events,
    loading: state.async.loading
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
)(firestoreConnect([{collection: 'events'}])(EventDashboard))