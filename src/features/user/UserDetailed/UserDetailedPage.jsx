import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { Grid } from "semantic-ui-react";
import UserDetailedHeader from './UserDetailedHeader'
import Photos from './Photos'
import UserDetailedSidebar from './UserDetailedSidebar'
import UsderDetailedDescription from './UsderDetailedDescription'
import UserDetailedEvents from './UserDetailedEvents'


const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    photos: state.firestore.ordered.photos,
  }
}

const query = ({auth}) => {
  return [{
    collection: 'users',
    doc: auth.uid,
    subcollections: [{collection: 'photos'}],
    storeAs: 'photos'
  }]
}

const UserDetailedPage = ({
  profile,
  photos
}) => {
  return (
    <Grid>
      <UserDetailedHeader profile={profile}/>
      <UsderDetailedDescription profile={profile}/>
      <UserDetailedSidebar />
      {photos && photos.length > 0 &&
      <Photos photos={photos}/>
      }
      <UserDetailedEvents />
    </Grid>  
  );
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(auth=> query(auth))
)(UserDetailedPage)

