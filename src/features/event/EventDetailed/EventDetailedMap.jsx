import React from 'react';
import { Segment, Icon } from 'semantic-ui-react'
import GoogleMapReact from 'google-map-react';

const Marker = () => <Icon name='marker' size='big' color='red'></Icon>

const EventDetailedMap = ({lat, lng}) => {
  const zoom = 14
  return (
    <Segment attached='bottom' style={{padding: 0}}>
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyC1l2S7b-MBkrwnYW7L8v_j0aVcIJ4RE6c' }}
          defaultCenter={{lat, lng}}
          defaultZoom={zoom}
        >
          <Marker
            lat={lat}
            lng={lng}
          />
        </GoogleMapReact>
      </div>
    </Segment>
  )
}

export default EventDetailedMap;