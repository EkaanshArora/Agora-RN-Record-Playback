import {Dimensions, StyleSheet} from 'react-native';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const styles = StyleSheet.create({
  max: {
    flex: 1,
    marginTop: 20,
  },
  heading: {fontSize: 18, marginLeft: 10, paddingBottom: 10, fontWeight: '500'},
  backgroundVideo: {
    width: '100%',
    height: 300,
    backgroundColor: '#efefef',
    marginBottom: 10,
  },
  pad: {paddingHorizontal: 2.5},
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  bigButtonHolder: {
    flexDirection: 'row',
    alignContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  menuText: {
    paddingHorizontal: 20,
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  recordingText: {
    fontWeight: '700',
    fontSize: 20,
  },
  bigButton: {
    borderColor: '#0093E9',
    borderBottomWidth: 2,
    borderStyle: 'solid',
    marginRight: 20,
    flex: 1,
  },
  bigButtonText: {
    color: '#0093E9',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height - 250,
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
  trackList: {
    flex: 1,
    marginHorizontal: 0,
  },
  trackItem: {
    borderColor: '#ccc',
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderStyle: 'solid',
    padding: 10,
  },
  flex3: {flex: 2},
  status: {color: '#777', flexWrap: 'wrap', textAlign: 'center'},
});

export default styles;
