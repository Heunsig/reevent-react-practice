import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'
import { Menu, Container, Button } from 'semantic-ui-react'
import { NavLink, Link, withRouter } from 'react-router-dom'
import SignedInMenu from '../Menus/SignedInMenu'
import SignedOutMenu from '../Menus/SignedOutMenu'
import { openModal } from '../../modals/modalActions'
// import { logout } from '../../auth/authActions'

class NavBar extends Component {
  handleSignIn = () => {
    this.props.openModal('LoginModal')
  }

  handleRegister = () => {
    this.props.openModal('RegisterModal')
  }

  handleSignOut = () => {
    this.props.firebase.logout()
    this.props.history.push('/')
  }


  render() {
    const { auth, profile } = this.props
    const authenticated = auth.isLoaded && !auth.isEmpty

    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={ NavLink } exact to='/' header>
            <img src="/assets/logo.png" alt="logo"/>
            Re-vents
          </Menu.Item>
          <Menu.Item as={ NavLink } exact to='/events'>Events</Menu.Item>
          {authenticated &&  
            <Fragment>
              <Menu.Item as={ NavLink } to='/people'>People</Menu.Item>
              <Menu.Item as={ NavLink } to='/test'>Test</Menu.Item>
              <Menu.Item>
                <Button 
                  as={ Link } 
                  to="/createEvent" 
                  floated="right" 
                  positive 
                  inverted 
                  content="Create Event"
                />
              </Menu.Item>
            </Fragment>
          }
          { authenticated ? 
            (<SignedInMenu 
              auth={auth}
              signOut={this.handleSignOut} 
              profile={profile} 
             />) : 
            (<SignedOutMenu 
              signIn={this.handleSignIn} 
              register={this.handleRegister} 
             />) 
           }
        </Container>
      </Menu>
    )
  }
}

const mapState = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}

const actions = {
  openModal,
  // logout
}

export default withRouter(withFirebase(connect(mapState, actions)(NavBar)))