import React from 'react';
import { Link } from 'react-router-dom'
import { Grid, Segment, Button } from 'semantic-ui-react'

const UserDetailedSidebar = ({profile, isCurrentUser, followUser, unfollowUser, followingUsers, isFollowing}) => {
  return (
    <Grid.Column width={4}>
      <Segment>
        {isCurrentUser &&
          <Button 
            as={ Link }
            to='/settings'
            color='teal' 
            fluid 
            basic 
            content='Edit Profile'
          /> 
        }

        {!isCurrentUser && 
          (isFollowing ?
             <Button 
              onClick={() => unfollowUser(profile)}
              color='red'
              fluid 
              basic 
              content='Unfollow'
            /> :
            <Button 
              onClick={() => followUser(profile)}
              color='teal'
              fluid 
              basic 
              content='Follow'
            />
          )
        }
      </Segment>
    </Grid.Column>
  )
}

export default UserDetailedSidebar;