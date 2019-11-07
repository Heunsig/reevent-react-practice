import React from 'react';
import { Link } from 'react-router-dom'
import { Grid, Segment, Button } from 'semantic-ui-react'

const UserDetailedSidebar = (props) => {
  return (
    <Grid.Column width={4}>
      <Segment>
        <Button 
          as={ Link }
          to='/settings'
          color='teal' 
          fluid 
          basic 
          content='Edit Profile'
        />
      </Segment>
    </Grid.Column>
  )
}

export default UserDetailedSidebar;