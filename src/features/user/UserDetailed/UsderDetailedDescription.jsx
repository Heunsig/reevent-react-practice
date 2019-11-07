import React from 'react';
import { Grid, Segment } from 'semantic-ui-react'
import AboutDisplayName from './AboutDisplayName'
import Interests from './Interests'

const UsderDetailedDescription = ({profile}) => {
  return (
    <Grid.Column width={12}>
      <Segment>
        <Grid columns={2}>
          <AboutDisplayName profile={profile}/>
          <Interests interests={profile.interests}/>
        </Grid>
      </Segment>
    </Grid.Column>
  )
}

export default UsderDetailedDescription;