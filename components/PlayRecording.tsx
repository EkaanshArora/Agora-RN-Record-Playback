import React, {Component} from 'react';
import Video from 'react-native-video';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';

interface Props {
  URL: string;
  appId: string;
  channelName: string;
}

/**
 * @property tracks State variable for storing track urls from S3
 * @property currentTrack State variable for storing current index
 * @property statusMsg State variable for storing the status text
 */
interface State {
  tracks: [string];
  currentTrack: number;
  statusMsg: string;
}

export default class PlayRecording extends Component<Props, State> {
  videoRef: React.RefObject<unknown>;

  constructor(props: Props) {
    super(props);
    this.videoRef = React.createRef();
    this.state = {
      currentTrack: 0,
      tracks: [''],
      statusMsg: '',
    };
  }

  componentDidMount() {
    console.log('fetch');
    fetch(this.props.URL + '/api/GET/recordingUrls/' + this.props.channelName)
      .then(response => {
        response.json().then(data => {
          let urlArr = data.recordings;
          console.log(urlArr);
          this.setState({tracks: urlArr});
        });
      })
      .catch(function (err) {
        console.log('Fetch Error', err);
      });
  }

  render() {
    let {tracks, currentTrack, statusMsg} = this.state;
    return (
      <View style={styles.max}>
        <Text style={styles.heading}>
          Available tracks in channel {this.props.channelName}:
        </Text>
        <ScrollView style={styles.trackList}>
          {tracks.map((track, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => this.setState({currentTrack: index})}
              style={{
                ...styles.trackItem,
                backgroundColor:
                  index === this.state.currentTrack ? '#efefef' : undefined,
              }}>
              <Text
                style={{
                  color: index === currentTrack ? '#000' : '#777',
                }}>
                {track.split('/')[track.split('/').length - 1]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View />
        <View style={styles.flex3}>
          {tracks[currentTrack] !== '' ? (
            <Video
              source={{
                uri: tracks[currentTrack],
              }} // Can be a URL or a local file.
              ref={(ref: any) => {
                this.videoRef = ref;
              }} // Store reference
              onLoadStart={() =>
                this.setState({
                  statusMsg: 'Loading URL: ' + tracks[currentTrack],
                })
              }
              onBuffer={e => console.log(e)} // Callback when remote video is buffering
              onError={e => {
                this.setState({
                  statusMsg: 'Error playing: ' + tracks[currentTrack],
                });
                console.log(e);
              }} // Callback when video cannot be loaded
              onLoad={() =>
                this.setState({
                  statusMsg: 'Playing - Track ' + (currentTrack + 1),
                })
              }
              onEnd={() => this.setState({statusMsg: 'Finished playing'})}
              minLoadRetryCount={1}
              style={styles.backgroundVideo}
            />
          ) : null}
          <Text style={styles.status}>{statusMsg}</Text>
        </View>
      </View>
    );
  }
}
