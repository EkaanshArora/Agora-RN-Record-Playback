import React, {Component} from 'react';
import {Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import requestCameraAndAudioPermission from './components/Permission';

interface Props {}

const URL = '';
const appId = '';
const channelName = '';

/**
 * @property joinSucceed State variable for storing success
 * @property peerIds Array for storing connected peers
 * @property rid Resource ID for cloud recording
 * @property sid Recording ID for unique identification of the current recording
 * @property recUid UID used by cloud recording
 */
interface State {
  joinSucceed: boolean;
  peerIds: number[];
  rid: null | string;
  sid: null | string;
  recUid: null | string;
}

export default class App extends Component<Props, State> {
  _engine?: RtcEngine;

  constructor(props: Props) {
    super(props);
    this.state = {
      joinSucceed: false,
      peerIds: [],
      rid: null,
      sid: null,
      recUid: null,
    };
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });
    }
  }

  componentDidMount() {
    this.init();
  }

  /**
   * @name init
   * @description Function to initialize the Rtc Engine, attach event listeners and actions
   */
  init = async () => {
    this._engine = await RtcEngine.create(appId);
    await this._engine.enableVideo();

    this._engine.addListener('Warning', warn => {
      console.log('Warning', warn);
    });

    this._engine.addListener('Error', err => {
      console.log('Error', err);
    });

    this._engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // Get current peer IDs
      const {peerIds} = this.state;
      // If new user
      if (peerIds.indexOf(uid) === -1) {
        this.setState({
          // Add peer ID to state array
          peerIds: [...peerIds, uid],
        });
      }
    });

    this._engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      const {peerIds} = this.state;
      this.setState({
        // Remove peer ID from state array
        peerIds: peerIds.filter(id => id !== uid),
      });
    });

    // If Local user joins RTC channel
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
      this.setState({
        joinSucceed: true,
      });
    });
  };

  /**
   * @name startCall
   * @description Function to start the call
   */
  startCall = async () => {
    let that = this;
    // Join Channel using token and channel name
    fetch(URL + '/api/get/rtc/test')
      .then(function (response) {
        response.json().then(async function (data) {
          console.log(data);
          await that._engine?.joinChannel(
            data.rtc_token,
            channelName,
            null,
            data.uid,
          );
        });
      })
      .catch(function (err) {
        console.log('Fetch Error', err);
      });
  };

  /**
   * @name endCall
   * @description Function to end the call
   */
  endCall = async () => {
    await this._engine?.leaveChannel();
    this.setState({peerIds: [], joinSucceed: false});
  };

  /**
   * @name startRecording
   * @description Function to start the call recording
   */
  startRecording = async () => {
    let that = this;
    fetch(URL + '/api/start/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({channel: channelName}),
    })
      .then(function (response) {
        response.json().then(async function (res) {
          console.log(res);
          let data = res.data;
          that.setState({recUid: data.uid, sid: data.sid, rid: data.rid});
        });
      })
      .catch(function (err) {
        console.log('Fetch Error', err);
      });
  };

  /**
   * @name query
   * @description Function to log the currect status of cloud recording
   */
  query = async () => {
    fetch(URL + '/api/status/call', {
      method: 'POST',
      body: JSON.stringify({rid: this.state.rid, sid: this.state.sid}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(function (response) {
        response.json().then(async function (data) {
          console.log(data);
        });
      })
      .catch(function (err) {
        console.log('Fetch Error', err);
      });
  };

  /**
   * @name stopRecording
   * @description Function to stop the call recording
   */
  stopRecording = async () => {
    fetch(URL + '/api/stop/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: channelName,
        rid: this.state.rid,
        sid: this.state.sid,
        uid: this.state.recUid,
      }),
    })
      .then(function (response) {
        response.json().then(async function (data) {
          console.log(data);
        });
      })
      .catch(function (err) {
        console.log('Fetch Error', err);
      });
  };

  render() {
    return (
      <View style={styles.max}>
        <View style={styles.max}>
          <View style={styles.buttonHolder}>
            <TouchableOpacity onPress={this.startCall} style={styles.button}>
              <Text style={styles.buttonText}> Start Call </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.endCall} style={styles.button}>
              <Text style={styles.buttonText}> End Call </Text>
            </TouchableOpacity>
          </View>
          {this.state.joinSucceed ? (
            <View style={styles.buttonHolder}>
              <Text style={styles.recordingText}>Recording:</Text>
              <TouchableOpacity
                onPress={this.startRecording}
                style={styles.button}>
                <Text style={styles.buttonText}> Start </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.stopRecording}
                style={styles.button}>
                <Text style={styles.buttonText}> End </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.query} style={styles.button}>
                <Text style={styles.buttonText}> Query </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
          {this._renderVideos()}
        </View>
      </View>
    );
  }

  _renderVideos = () => {
    const {joinSucceed} = this.state;
    return joinSucceed ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.max}
          channelId={channelName}
          renderMode={VideoRenderMode.Hidden}
        />
        {this._renderRemoteVideos()}
      </View>
    ) : null;
  };

  _renderRemoteVideos = () => {
    const {peerIds} = this.state;
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={styles.pad}
        horizontal={true}>
        {peerIds.map(value => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.remote}
              uid={value}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
    );
  };
}

import {Dimensions, StyleSheet} from 'react-native';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const styles = StyleSheet.create({
  max: {
    flex: 1,
  },
  pad: {paddingHorizontal: 2.5},
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  recordingText: {
    fontWeight: '700',
    fontSize: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height - 150,
  },
  remoteContainer: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
});
