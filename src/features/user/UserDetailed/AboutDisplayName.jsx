import React from 'react';
import { Grid, Header } from 'semantic-ui-react'
import { format } from 'date-fns'

const AboutDisplayName = ({profile}) => {
  return (
    <Grid.Column width={10}>
      <Header icon='smile' content='About Display Name'/>
      <p>I am a: <strong>Occupation Placeholder</strong></p>
      <p>Originally from <strong>{profile.origin ? profile.origin : 'Unknown'}</strong></p>
      <p>Member Since: <strong>{ profile.createdAt ? format(profile.createdAt.toDate(), 'do LLLL yyyy') : 'hi'}</strong></p>
      <p>Description of user</p>
      <p>{profile.about ? profile.about : ''}</p>
    </Grid.Column>
  )
}

export default AboutDisplayName;