import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Icon } from 'semantic-ui-react'

const AnyReactComponent = () => <Icon name='marker' size='big' color='red'></Icon>

class SimpleMap extends Component {
  static defaultProps = {
    zoom: 11
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyC1l2S7b-MBkrwnYW7L8v_j0aVcIJ4RE6c' }}
          defaultCenter={this.props.location}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={this.props.location.lat}
            lng={this.props.location.lng}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;