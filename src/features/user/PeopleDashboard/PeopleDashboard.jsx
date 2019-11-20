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
    usersFollowing: state.firestore.ordered.users,
    followingUsers: state.user.followingUsers
  }
}

const PeopleDashboard = ({followingUsers, usersFollowing, auth}) => {
  const usersf = usersFollowing || []
  const fusers = objectToArray(followingUsers) || []

  return (
    <Grid>
      <Grid.Column width={16}>
        <Segment>
          <Header dividing content="People following me" />
          <Card.Group itemsPerRow={8} stackable>
            {usersf.map(user => (
              <PersonCard key={user.id} user={user}/>
            ))}
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

const query = (auth) => {
  return [{
    collection: 'users',
    doc: auth.uid,
    subcollections: [{ collection: 'follower' }]
  }]
}

export default compose(
  connect(mapState),
  firestoreConnect(({ auth }) => query(auth))
)(PeopleDashboard)

// connect(mapState)(firestoreConnect((auth) => query(auth.uid))());


// export default compose(
//   connect(mapStateToProps, actions),
//   firestoreConnect((auth, userUid)=> userDetailedQuery(auth, userUid))
// )(UserDetailedPage)

