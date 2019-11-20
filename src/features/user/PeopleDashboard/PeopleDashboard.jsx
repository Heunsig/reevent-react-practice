import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { objectToArray } from '../../../app/common/util/helpers'
import { Grid, Segment, Header, Card } from 'semantic-ui-react';
import { firestoreConnect } from 'react-redux-firebase'
import PersonCard from './PersonCard';
import { compose }  from 'redux'

const mapState = (state) => {
  return {
    auth: state.firebase.auth,
    followers: state.firestore.ordered.followers,
    followings: state.firestore.ordered.following,
  }
}

const PeopleDashboard = ({followers, followings}) => {
  return (
    <Grid>
      <Grid.Column width={16}>
        <Segment>
          <Header dividing content="People following me" />
          <Card.Group itemsPerRow={8} stackable>
            {followers && followers.map(follower => (
              <PersonCard key={follower.id} user={follower}/>
            ))}
          </Card.Group>
        </Segment>
        <Segment>
          <Header dividing content="People I'm following" />
          <Card.Group itemsPerRow={8} stackable>
          {followings && followings.map(following => (
            <PersonCard key={following.id} user={following}/>
          ))}
          </Card.Group>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

const query = (auth) => {
  return [
  {
    collection: 'users',
    doc: auth.uid,
    subcollections: [{ collection: 'followers' }],
    storeAs: 'followers'
  },
  {
    collection: 'users',
    doc: auth.uid,
    subcollections: [{ collection: 'following' }],
    storeAs: 'following'
  }
 ]
}

export default compose(
  connect(mapState),
  firestoreConnect(({ auth }) => query(auth))
)(PeopleDashboard)