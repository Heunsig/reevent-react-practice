import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { objectToArray } from '../../../app/common/util/helpers'
import { Grid, Segment, Header, Card } from 'semantic-ui-react';
import PersonCard from './PersonCard';

const mapState = (state) => {
  return {
    followingUsers: state.user.followingUsers
  }
}

const PeopleDashboard = ({followingUsers}) => {

  const fusers = objectToArray(followingUsers) || []

  return (
    <Grid>
      <Grid.Column width={16}>
        <Segment>
          <Header dividing content="People following me" />
          <Card.Group itemsPerRow={8} stackable>
            {/*<PersonCard />
            <PersonCard />
            <PersonCard />
            <PersonCard />
            <PersonCard />*/}
          </Card.Group>
        </Segment>
        <Segment>
          <Header dividing content="People I'm following" />
          <Card.Group itemsPerRow={8} stackable>
          {fusers.map(user => (
            <PersonCard key={user.id} user={user}/>
          ))}
          </Card.Group>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default connect(mapState)(PeopleDashboard);
