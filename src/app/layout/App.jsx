import React, { Component, Fragment } from 'react';
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Route, Switch, withRouter } from 'react-router-dom'
import NavBar from '../../features/nav/NavBar/NavBar'
import HomePage from '../../features/home/HomePage'
import EventDashboard from '../../features/event/EventDashboard/EventDashboard'
import EventDetailedPage from '../../features/event/EventDetailed/EventDetailedPage'
import PeopleDashboard from '../../features/user/PeopleDashboard/PeopleDashboard'
import UserDetailedPage from '../../features/user/UserDetailed/UserDetailedPage'
import SettingsDashboard from '../../features/user/Settings/SettingsDashboard'
import EventForm from '../../features/event/EventForm/EventForm'
import TestComponent from '../../features/testarea/TestComponent'
import ModalManager from '../../features/modals/ModalManage'
import { UserIsAuthenticated } from '../../features/auth/authWrapper'
import NotFound from './NotFound'

// import { getFollowingUsers } from '../../features/user/userActions'

const actions = {
  // getFollowingUsers
}

class App extends Component {
  async componentDidMount () {
    // await this.props.getFollowingUsers()
  }

  render() {
    return (
      <Fragment>
        <ModalManager/>
        <Route exact path="/" component={HomePage}/>
        <Route 
          path='/(.+)' 
          render={() => (
            <Fragment>
              <NavBar />
              <Container className="main">
                <Switch key={this.props.location.key}>
                  <Route exact path="/events" component={EventDashboard}/>
                  <Route path="/events/:id" component={EventDetailedPage}/>
                  <Route path="/people" component={UserIsAuthenticated(PeopleDashboard)}/>
                  <Route path="/profile/:id" component={UserIsAuthenticated(UserDetailedPage)}/>
                  <Route path="/settings" component={UserIsAuthenticated(SettingsDashboard)}/>
                  <Route path={["/createEvent", '/manage/:id']} component={UserIsAuthenticated(EventForm)}/>
                  <Route path="/test" component={TestComponent}/>
                  <Route component={NotFound}/>
                </Switch>
              </Container>
            </Fragment>
        )}/>
      </Fragment>
    )
  }
}


export default withRouter(connect(null, actions)(App))