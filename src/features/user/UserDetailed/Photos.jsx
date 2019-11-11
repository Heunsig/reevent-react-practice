import React from 'react';
import {Grid, Segment, Header, Image } from 'semantic-ui-react'
import LazyLoad from 'react-lazyload'

const Photos = ({photos}) => {
  return (
    <Grid.Column width={12}>
      <Segment attached>
        <Header icon='image' content='Photos'/>
        
        <Image.Group size='small'>
          {photos.map(({id, url}) => (
            <LazyLoad 
              key={id} 
              height={150} 
              placeholder={<Image src='/assets/user.png'/>}
            >
              <Image src={url}/>
            </LazyLoad>
          ))}
        </Image.Group>
      </Segment>
    </Grid.Column>
  )
}

export default Photos