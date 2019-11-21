import React, { useEffect } from 'react';
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
import { getUserEvents, followUser, unfollowUser } from '../userActions'

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
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting,
    events: state.events.userEvents,
    eventsLoading: state.async.loading,
    following: state.firestore.ordered.following
  }
}

const actions = {
  getUserEvents,
  followUser,
  unfollowUser
}


const UserDetailedPage = ({
  profile,
  photos,
  auth,
  match,
  requesting,
  getUserEvents,
  userUid,
  events,
  eventsLoading,
  followUser,
  unfollowUser,
  following
}) => {
  
  useEffect(() => {
    (async () => {
      await getUserEvents(userUid)
    })()
  }, [getUserEvents, userUid])

  const isCurrentUser = auth.uid === match.params.id
  const loading = Object.values(requesting).some(a => a === true)
  const isFollowing = !isEmpty(following)

  let changeTab = (e, data) => {
    getUserEvents(userUid, data.activeIndex)
  }


  if (loading) return <LoadingComponent />

  return (
    <Grid>
      <UserDetailedHeader profile={profile}/>
      <UsderDetailedDescription profile={profile}/>
      <UserDetailedSidebar
        isFollowing={isFollowing}
        isCurrentUser={isCurrentUser} 
        followUser={followUser}
        unfollowUser={unfollowUser}
        profile={profile}
      />
      {photos && photos.length > 0 &&
        <Photos photos={photos}/>
      }
      <UserDetailedEvents 
        events={events} 
        eventsLoading={eventsLoading}
        changeTab={changeTab}
      />
    </Grid>  
  );
}

export default compose(
  connect(mapStateToProps, actions),
  firestoreConnect((auth, userUid, match)=> userDetailedQuery(auth, userUid, match))
)(UserDetailedPage)

