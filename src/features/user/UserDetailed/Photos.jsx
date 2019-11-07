import React from 'react';
import {Grid, Segment, Header, Image } from 'semantic-ui-react'

const Photos = ({photos}) => {
  return (
    <Grid.Column width={12}>
      <Segment attached>
        <Header icon='image' content='Photos'/>
        
        <Image.Group size='small'>
          {photos.map(({id, url}) => (
            <Image key={id} src={url}/>
          ))}
        </Image.Group>
      </Segment>
    </Grid.Column>
  )
}

export default Photos