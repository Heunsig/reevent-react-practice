import React from 'react';
import { Grid, List, Header, Icon, Item } from 'semantic-ui-react'

const Interests = ({ interests }) => {
  return (
    <Grid.Column width={6}>
      <Header icon='heart outline' content='Interests'/>
      <List>
        {interests && interests.map(interest => (
          <Item key={interest}>
            <Icon name='heart'/>
            <Item.Content>{interest}</Item.Content>
          </Item>
        ))}
      </List>
    </Grid.Column>
  )
}

export default Interests;