import React, { Component } from 'react'
import { connect } from 'react-redux'
import { incrementCounter, decrementCounter } from './testActions'
import { Button } from 'semantic-ui-react'
import TestPlaceInput from './TestPlaceInput'
import SimpleMap from './SimpleMap'
import { openModal } from '../modals/modalActions'

class TestComponent extends Component {
  state = {
    location: {
      lat: 59.95,
      lng: 30.33
    }
  }

  onHandlePlaceChange = (latlng) => {
    this.setState({
      location: {
        lat: latlng.lat,
        lng: latlng.lng
      }
    })
  }

  render() {
    const {data, incrementCounter, decrementCounter, openModal} = this.props
    return (
      <div>
        <h1>Test Component</h1>
        <h3>{data}</h3>
        <Button onClick={incrementCounter} positive content='Increment'/>
        <Button onClick={decrementCounter} negative content='Decrement'/>
        <Button onClick={()=>openModal('TestModal', {data: 42})} color='teal' content='Open modal'/>
        <TestPlaceInput onHandlePlaceChange={this.onHandlePlaceChange}/>
        <SimpleMap key={this.state.location.lng} location={this.state.location}/>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.test.data
  }
}

const actions = {
  incrementCounter,
  decrementCounter,
  openModal
}

export default connect(mapStateToProps, actions)(TestComponent)