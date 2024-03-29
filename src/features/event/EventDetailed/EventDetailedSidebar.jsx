import React, { Fragment } from 'react';
import { Segment, Item, List, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const EventDetailedSidebar = ({attendees}) => {
  // const isHost = false

  return (
    <Fragment>
      <Segment
        textAlign="center"
        style={{ border: 'none' }}
        attached="top"
        secondary
        inverted
        color="teal"
      >
        {attendees && attendees.length} {attendees && attendees.length === 1 ? 'Person' : 'People'} Going
      </Segment>
      <Segment attached>
        <List relaxed divided>
        {attendees && attendees.map((attendee) => (
          <Item 
            key={attendee.id} 
            style={{ position: 'relative' }}
          >
          {attendee.host && 
            <Label
              style={{ position: 'absolute' }}
              color="orange"
              ribbon="right"
            >Host</Label>
          }
              
            
            <Item.Image size="tiny" src={attendee.photoURL}/>
            <Item.Content verticalAlign="middle" style={{width: "10px"}}>
              <Item.Header as="h3">
                <Link to={`/profile/${attendee.id}`}>{attendee.displayName}</Link>
              </Item.Header>
            </Item.Content>
          </Item>
        ))}
        </List>
      </Segment>
    </Fragment>
  )
}

export default EventDetailedSidebar;