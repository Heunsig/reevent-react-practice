import React, { Component } from 'react'
import { connect } from 'react-redux'
import { incrementCounter, decrementCounter } from './testActions'
import { Button } from 'semantic-ui-react'
import TestPlaceInput from './TestPlaceInput'
import SimpleMap from './SimpleMap'

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
    const {data, incrementCounter, decrementCounter} = this.props
    return (
      <div>
        <h1>Test Component</h1>
        <h3>{data}</h3>
        <Button onClick={incrementCounter} positive content='Increment'/>
        <Button onClick={decrementCounter} negative content='Decrement'/>
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
  decrementCounter
}

export default connect(mapStateToProps, actions)(TestComponent)