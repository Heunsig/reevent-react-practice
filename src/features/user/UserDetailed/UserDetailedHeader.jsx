import React from 'react';
import { Grid, Segment, Item, Header } from 'semantic-ui-react'
import differenceInYears from 'date-fns/differenceInYears'
import LazyLoad from 'react-lazyload'

const UserDetailedHeader = ({
  profile
}) => {
  const { displayName, city, dateOfBirth, photoURL } = profile

  const getAge = () => {
    if (dateOfBirth) {
      return differenceInYears(Date.now(), dateOfBirth.toDate())
    } else {
      return 'Unknown age'
    }
  }

  return (
    <Grid.Column width={16}>
      <Segment>
        <Item.Group>
          <Item>
            <LazyLoad
              height={150}
              placeholder={<Item.Image avatar size='small' src='/assets/user.png'/>}
            >
              <Item.Image avatar size='small' src={photoURL ? photoURL : '/assets/user.png'}/>
            </LazyLoad>
            <Item.Content verticalAlign='bottom'>
                <Header as='h1'>{ displayName }</Header>
                <br/>
                <Header as='h3'>Occupation</Header>
                <br/>
                <Header as='h3'>
                  { getAge() }, { city ? city : 'No info'}
                </Header>
            </Item.Content>
          </Item>
       </Item.Group>
    </Segment>
  </Grid.Column>
  )
}

export default UserDetailedHeader;