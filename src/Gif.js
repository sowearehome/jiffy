import React, {Component} from 'react';

class Gif extends React.Component {
  // when video has loaded add a loaded className, otherwise the video stays hidden

  // setting up state to achieve above goal
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }
  render() {
    const {loaded} = this.state;
    const {images} = this.props;
    return (
      <video
        // className={`grid-item video ${loaded ? 'loaded' : ''}`} = same as
        className={`grid-item video ${loaded && 'loaded'}`}
        autoPlay
        loop
        src={this.props.images.original.mp4}
        onLoadedData={() => this.setState({loaded: true})}
      />
    );
  }
}

export default Gif;
