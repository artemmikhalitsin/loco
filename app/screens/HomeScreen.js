import React from 'react';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView
} from 'react-native';
import {
  Constants,
  Location,
  Permissions,
  MapView,
  WebBrowser
} from 'expo';
import { Marker } from 'react-native-maps';
import { Toast } from 'native-base';
import {
  Text,
  Overlay,
  Input
} from 'react-native-elements';
import { MonoText } from '../components/StyledText';
import { _ } from 'lodash';

export default class HomeScreen extends React.Component {
  state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      searchText: '',
      viewedLocation: {},
      viewedLocationStats: '',
      errorMessage: null,
      overlayVisible: false,
      showToast: false
    };

  static navigationOptions = {
    header: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.moveTo(location.coords.longitude, location.coords.latitude);
  };

  onRegionChangeComplete = (region) => {
    this.setState({ region });
  }

  toggleOverlay = () => {
    this.setState({ overlayVisible: !this.state.overlayVisible})
  }

  moveTo = (longitude, latitude) => {
    let newRegion = Object.assign({}, this.state.region, {
      longitude,
      latitude
    })
    this.setState({ region: newRegion });
  }

  drawMarker = (marker) => {
    if(!marker || !marker.location) {
      return null;
    }

    return (<Marker
      coordinate={marker.location}
      title={marker.title}
      description={marker.description}
      onCalloutPress={this.toggleOverlay}
    />)
  }

  onSubmitSearch = () => {
    if(this.state.searchText.length < 2) {
      Toast.show({
        text: 'Please be more specific',
        buttonText: 'Dismiss',
        duration: 2000
      })

      return
    }
    fetch(`http://3.82.226.23:1880/maps?lat=${this.state.region.latitude}` +
    `&lon=${this.state.region.longitude}&query=${this.state.searchText}`)
    .then(res => res.json())
    .then(results => {
      if(results.length > 0) {
        let bestMatch = results[0];
        this.setState({viewedLocation : {
          location: {
            longitude: bestMatch.geometry.location.lng,
            latitude: bestMatch.geometry.location.lat
          },
          title: bestMatch.formatted_address,
          description: "Tap to view the rating"
        }})
        this.loadLocationStats(bestMatch.geometry.location.lng, bestMatch.geometry.location.lat);
        this.moveTo(bestMatch.geometry.location.lng, bestMatch.geometry.location.lat);
      } else {
        Toast.show({
          text: 'No results found. Try being more specific',
          buttonText: 'Dismiss',
          duration: 3000
        })
      }
    })
  }

  loadLocationStats = (lon, lat) => {
    let crimeData = fetch(`http://3.82.226.23:1880/crimes?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
    let walkscoreData = fetch(`http://3.82.226.23:1880/walkscore?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
    let foodData = fetch(`http://3.82.226.23:1880/badfood?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
    let metroData = fetch(`http://3.82.226.23:1880/metro?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
    Promise.all([crimeData, walkscoreData, foodData, metroData])
    .then(([crimes, walk, food, metros]) => {
      let description = ''
      description += `Walk score: ${walk.walkscore} (${walk.description})\n`
      description += `Bike score: ${walk.bikescore} (${walk.bikedescription})\n\n`

      description += 'Nearby metro stations: \n'
      metros.map(metro => {
        description += `- ${metro.station} (${metro.walkingDistance} walk) \n`
      });
      description += '\n'

      let totalCrimes = crimes.items.length
      description += `Crimes since 2015: ${totalCrimes}\n`
      let groupedCrimes = _.groupBy(crimes.items, 'type')
      let crimeStats = ''
      _.keys(groupedCrimes).map(crimeType => {
        let typeCount = groupedCrimes[crimeType].length;
        let portion = ( typeCount / totalCrimes).toFixed(4) * 100;
        crimeStats += `${crimeType}: ${portion}% \n`
      })
      description += `Crimes breakdown:\n`
      description += crimeStats + '\n'

      // Bad food
      let totalViolations = food.items.length
      description += `Nearby resto health code violations: ${totalViolations}\n`
      description += `Restos to avoid:\n`
      let restos = _.groupBy(food.items, 'restoName')
      _.keys(restos).map(restoName => {
        description += `${restoName}: ${restos[restoName].length} violations\n`
      })
      this.setState({ viewedLocationStats: description })
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{
            flex: 1,
            zIndex: -1
          }}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {this.drawMarker(this.state.viewedLocation)}
        </MapView>
        <KeyboardAvoidingView
          style={styles.tabBarInfoContainer}
          behavior="padding">
          <Input
            style={{
              borderWidth: 0
            }}
            placeholder='Find a new spot'
            rightIcon={{ type: 'font-awesome', name: 'search' }}
            onChangeText={(searchText) => this.setState({searchText})}
            onSubmitEditing={this.onSubmitSearch}
            value={this.state.searchText}
          />
        </KeyboardAvoidingView>
        <Overlay
          isVisible={this.state.overlayVisible}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          width="auto"
          height="auto"
          >
            <Text h4 style={{
              alignSelf: 'center'
            }}>{this.state.viewedLocation.title}</Text>
            <Text>{this.state.viewedLocationStats}</Text>
          <Button title="Close" onPress={this.toggleOverlay}/>
        </Overlay>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 10,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
