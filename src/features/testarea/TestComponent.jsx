import React, { Component } from 'react'
import { connect } from 'react-redux'
import { incrementAsync, decrementAsync, incrementCounter, decrementCounter } from './testActions'
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
    const {
      data, 
      incrementAsync, 
      decrementAsync, 
      openModal,
      loading,
      buttonName
    } = this.props
    return (
      <div>
        <h1>Test Component</h1>
        <h3>{data}</h3>
        <Button 
          name='increment' 
          loading={buttonName === 'increment' && loading} 
          onClick={e => incrementAsync(e.target.name)} 
          positive 
          content='Increment'
        />
        <Button 
          name='decrement' 
          loading={buttonName === 'decrement' && loading}  
          onClick={e => decrementAsync(e.target.name)}
          negative 
          content='Decrement'
        />
        <Button onClick={()=>openModal('TestModal', {data: 42})} color='teal' content='Open modal'/>
        <TestPlaceInput onHandlePlaceChange={this.onHandlePlaceChange}/>
        <SimpleMap key={this.state.location.lng} location={this.state.location}/>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.test.data,
    loading: state.async.loading,
    buttonName: state.async.elementName
  }
}

const actions = {
  incrementCounter,
  decrementCounter,
  incrementAsync,
  decrementAsync,
  openModal
}

export default connect(mapStateToProps, actions)(TestComponent)