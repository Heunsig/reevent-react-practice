import React, { Fragment } from 'react';
import { Header, Segment } from 'semantic-ui-react'

const EventActivity = (props) => {
  return (
    <Fragment>
      <Header 
        attached='top'
        content='Recent Activity'
      ></Header>
      <Segment attached>
        <p>Recent activity</p>
      </Segment>
    </Fragment>
  )
}

export default EventActivity;