/*global google*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from 'revalidate'
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react'
import { createEvent, updateEvent, cancelToggle } from '../eventActions'
import { withFirestore } from 'react-redux-firebase'
import TextInput from '../../../app/common/form/TextInput'
import TextArea from '../../../app/common/form/TextArea'
import SelectInput from '../../../app/common/form/SelectInput'
import DateInput from '../../../app/common/form/DateInput'
import PlaceInput from '../../../app/common/form/PlaceInput'

const category = [
  { key: 'drinks', text: 'Drinks', value: 'drinks' },
  { key: 'culture', text: 'Culture', value: 'culture' },
  { key: 'film', text: 'Film', value: 'film' },
  { key: 'food', text: 'Food', value: 'food' },
  { key: 'music', text: 'Music', value: 'music' },
  { key: 'travel', text: 'Travel', value: 'travel' }
]

class EventForm extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {}
  }

  async componentDidMount() {
    // const {firestore, match, history} = this.props
    const { firestore, match } = this.props
    await firestore.setListener(`events/${match.params.id}`)
    // let event = await firestore.get(`events/${match.params.id}`)
    // if (!event.exists) {
    //   history.push('/events')
    //   toastr.error('Sorry', 'Event not found')
    // } else {
    //   this.setState({
    //     venueLatLng: event.data().venueLatLng
    //   })
    // }
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props
    await firestore.unsetListener(`events/${match.params.id}`)
  }

  onFormSubmit = async values => {
    values.venueLatLng = this.state.venueLatLng

    try {
      if (this.props.initialValues.id) {
        if (Object.keys(values.venueLatLng).length === 0) {
          values.venueLatLng = this.props.event.venueLatLng
        }
        
        this.props.updateEvent(values)
        this.props.history.push(`/events/${this.props.initialValues.id}`)
      } else {
        // const newEvent = {
        //   ...values,
        //   id: cuid(),
        //   hostPhotoURL: '/assets/user.png',
        //   hostedBy: 'Bob'
        // }
        let createdEvent = await this.props.createEvent(values)
        this.props.history.push(`/events/${createdEvent.id}`)
      }
    } catch (error) {
  
    }
    
  }

  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(res => getLatLng(res[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        })
      })
      .then(() => {
        this.props.change('city', selectedCity)
      })
  }

  handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
      .then(res => getLatLng(res[0]))
      .then(latlng => {
        this.setState({
          venueLatLng: latlng
        })
      })
      .then(() => {
        this.props.change('venue', selectedVenue)
      })
  }

  render() {
    // const { title, date, city, venue, hostedBy } = this.state
    const { 
      history, 
      initialValues, 
      invalid, 
      submitting, 
      pristine,
      event, 
      cancelToggle,
      loading
    } = this.props

    return (
      <Grid>
        <Grid.Column width={10}>
          <Segment>
            <Form
              onSubmit={this.props.handleSubmit(this.onFormSubmit)}
              autoComplete='off'
            >
              <Header sub color='teal' content='Event Details' />
              <Field
                name='title'
                component={TextInput}
                placeholder='Give your event a name'
              />
              <Field
                name='category'
                component={SelectInput}
                options={category}
                placeholder='hat is our event about?'
              />
              <Field
                name='description'
                component={TextArea}
                rows={3}
                placeholder='Tell us about your event'
              />
              <Header sub color='teal' content='Event Location Details' />
              <Field
                name='city'
                component={PlaceInput}
                options={{types: ['(cities)']}}
                onSelect={this.handleCitySelect}
                placeholder='Event City'
              />
              <Field
                name='venue'
                component={PlaceInput}
                options={{
                  location: new google.maps.LatLng(this.state.cityLatLng),
                  radius: 1000,
                  types: ['establishment']
                }}
                onSelect={this.handleVenueSelect}
                placeholder='Event Venue'
              />
              <Field
                name='date'
                component={DateInput}
                dateFormat='dd LLL yyyy h:mm a'
                showTimeSelect
                timeFormat='HH:mm'
                placeholder='Event Date'
              />
              <Button
                disabled={invalid || submitting || pristine}
                loading={loading}
                positive
                type='submit'
              >
                Submit
              </Button>
              <Button
                /*onClick={cancelFormOpen} */
                onClick={
                  initialValues.id
                    ? () => history.push(`/events/${initialValues.id}`)
                    : () => history.push('/events')
                }
                type='button'
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type='button'
                color={event.cancelled ? 'green' : 'red'}
                content={event.cancelled ? 'Reactivate event' : 'Cancel event'}
                onClick={() => cancelToggle(!event.cancelled, event.id)}
              />
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const eventId = ownProps.match.params.id

  let event = {
    title: '',
    date: '',
    city: '',
    venue: '',
    hostedBy: ''
  }

  if (state.firestore.ordered.events && state.firestore.ordered.events.length > 0) {
    event = state.firestore.ordered.events.filter(event => event.id === eventId)[0] || {}
  }

  return {
    initialValues: event,
    event,
    loading: state.async.loading
  }
}

const mapDispatchToProps = {
  createEvent,
  updateEvent,
  cancelToggle
}

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired({ message: 'The category is required' }),
  description: composeValidators(
    isRequired({ message: 'Please enter the description' }),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 characters'
    })
  )(),
  citi: isRequired('city'),
  venue: isRequired('venue'),
  date: isRequired('date')
})


export default withFirestore(connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm({ form: 'eventForm', validate, enableReinitialize: true })(EventForm)))
