import React, {Component} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import PlayRecording from './components/PlayRecording';
import Call from './components/Call';
import styles from './components/styles';

interface Props {}

const URL = '';
const appId = '';
const channelName = 'test';

/**
 * @property inCallMenu State variable for storing which menu is displayed
 */
interface State {
  inCallMenu: boolean;
}

export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inCallMenu: true,
    };
  }

  render() {
    return (
      <SafeAreaView style={styles.max}>
        <View style={styles.bigButtonHolder}>
          <Text style={styles.menuText}>
            {this.state.inCallMenu ? 'Call Menu' : 'Call Recordings'}
          </Text>
          <TouchableOpacity
            style={styles.bigButton}
            onPress={() => {
              this.setState({inCallMenu: !this.state.inCallMenu});
            }}>
            <Text style={styles.bigButtonText}>
              {this.state.inCallMenu ? 'View Recordings' : 'Go to Video Chat'}
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.inCallMenu ? (
          <Call URL={URL} appId={appId} channelName={channelName} />
        ) : (
          <PlayRecording URL={URL} appId={appId} channelName={channelName} />
        )}
      </SafeAreaView>
    );
  }
}
