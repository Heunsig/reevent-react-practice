import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect, isEmpty } from 'react-redux-firebase'
import { Grid } from "semantic-ui-react";
import UserDetailedHeader from './UserDetailedHeader'
import Photos from './Photos'
import UserDetailedSidebar from './UserDetailedSidebar'
import UsderDetailedDescription from './UsderDetailedDescription'
import UserDetailedEvents from './UserDetailedEvents'
import { userDetailedQuery } from '../userQueires'
import LoadingComponent from '../../../app/layout/LoadingComponent'

const mapStateToProps = (state, ownProps) => {
  let userUid = null
  let profile = {}

  if (ownProps.match.params.id === state.auth.uid) {
    profile = state.firebase.profile
  } else {
    profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0]
    userUid = ownProps.match.params.id
  }
  return {
    profile,
    userUid,
    auth: state.firebase.auth,
    // profile: state.firebase.profile,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting
  }
}


const UserDetailedPage = ({
  profile,
  photos,
  auth,
  match,
  requesting
}) => {
  
  const isCurrentUser = auth.uid === match.params.id
  const loading = Object.values(requesting).some(a => a === true)

  if (loading) return <LoadingComponent />

  return (
    <Grid>
      <UserDetailedHeader profile={profile}/>
      <UsderDetailedDescription profile={profile}/>
      <UserDetailedSidebar isCurrentUser={isCurrentUser}/>
      {photos && photos.length > 0 &&
        <Photos photos={photos}/>
      }
      <UserDetailedEvents />
    </Grid>  
  );
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect((auth, userUid)=> userDetailedQuery(auth, userUid))
)(UserDetailedPage)

