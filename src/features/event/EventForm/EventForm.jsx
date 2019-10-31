import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment, Form, Button } from 'semantic-ui-react'
import { createEvent, updateEvent } from '../eventActions'
import cuid from 'cuid'

class EventForm extends Component {
  state = {...this.props.event}

  componentDidMount () {
    if (this.props.selectedEvent !== null) {
      this.setState({
        ...this.props.selectedEvent
      })
    }
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    if (this.state.id) {
      this.props.updateEvent(this.state)
      this.props.history.push(`/events/${this.state.id}`)
    } else {
      const newEvent = {
        ...this.state,
        id: cuid(),
        hostPhotoURL: '/assets/user.png'
      }
      this.props.createEvent(newEvent)  
      this.props.history.push(`/events/${newEvent.id}`)
    }
  }

  handleInputChange = ({target: {name, value}}) => {
    this.setState({
      [name]: value
    })
  }

  render() {
    const { title, date, city, venue, hostedBy } = this.state

    return (
      <Segment>
        <Form onSubmit={this.handleFormSubmit} autoComplete='off'>
          <Form.Field>
            <label>Event Title</label>
            <input 
              name='title'
              onChange={this.handleInputChange}
              value={ title }
              placeholder="Event Title" 
            />
          </Form.Field>
          <Form.Field>
            <label>Event Date</label>
            <input 
              name='date'
              onChange={this.handleInputChange}
              value={ date }
              type="date" 
              placeholder="Event Date" 
            />
          </Form.Field>
          <Form.Field>
            <label>City</label>
            <input 
              name='city'
              onChange={this.handleInputChange}
              value={ city }
              placeholder="City event is taking place" 
            />
          </Form.Field>
          <Form.Field>
            <label>Venue</label>
            <input 
              name='venue'
              onChange={this.handleInputChange}
              value={ venue }
              placeholder="Enter the Venue of the event" 
            />
          </Form.Field>
          <Form.Field>
            <label>Hosted By</label>
            <input 
              name='hostedBy'
              onChange={this.handleInputChange}
              value={ hostedBy }
              placeholder="Enter the name of person hosting" 
            />
          </Form.Field>
          <Button positive type="submit">
            Submit
          </Button>
          <Button 
            /*onClick={cancelFormOpen} */
            onClick={this.props.history.goBack}
            type="button"
          >
            Cancel
          </Button>
        </Form>
      </Segment>
    );
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

  if (eventId && state.events.length > 0) {
    event = state.events.filter(event => event.id === eventId)[0]
  }

  return {
    event
  }
}

const mapDispatchToProps = {
  createEvent,
  updateEvent
}

export default connect(mapStateToProps, mapDispatchToProps)(EventForm)