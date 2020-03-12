import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Button,
  TextInput,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, } from 'react-native-maps';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, }
  from 'react-native-responsive-screen';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/AntDesign';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import RBSheet from "react-native-raw-bottom-sheet";
import { getDistance, getPreciseDistance } from 'geolib';
import Vehicle from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      cordLatitude: null,
      cordLongitude: null,
      location: {},
      place: '',
      showsUserLocation: true,
      data: {},
      distance: null,
      Motofare: null,
      Gofare: null,
      Autofare: null,
      check: false,
    };
  }

  componentDidMount() {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }

  GetLocation = () => {
    Geocoder.init('AIzaSyAGKFNn0Gk9EFj35JTLG5G77RQ3XHD8hH8');
    Geocoder.from(this.state.data.description)
      .then(json => {
        var location = json.results[0].geometry.location;
        this.setState({ location })
      })
      .catch(error => console.warn(error))
  }

  _getDistance = () => {
    var dis = getDistance(
      { latitude: this.state.latitude, longitude: this.state.longitude },
      { latitude: this.state.location.lat, longitude: this.state.location.lng }
    );
    //alert(`Distance\n${dis} Meter\nor\n${dis / 1000} KM`);
    this.setState({
      distance: dis / 1000,
      Motofare: (((dis / 1000) * 20) + 50).toFixed(),
      Gofare: (((dis / 1000) * 30) + 90).toFixed(),
      Autofare: (((dis / 1000) * 25) + 70).toFixed()
    })
  };

  renderItem = (item, index) => (
    <View>
      <Button title={`OPEN BOTTOM SHEET-${index}`} onPress={() => this[RBSheet + index].open()} />
      <RBSheet
        ref={ref => {
          this[RBSheet + index] = ref;
        }}
      >
        <YourOwnComponent onPress={() => this[RBSheet + index].close()} />
      </RBSheet>
    </View>
  );

  onPressButton = () => {
    this.setState({
      check: !this.state.check,
    })
  }

  render() {
    console.log(this.state.location, "hello")
    return (
      <View style={styles.Container}>
        <View style={styles.map}>
          {this.state.latitude && this.state.longitude && <MapView style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={this.state.showsUserLocation}
            showsMyLocationButton={true}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1
            }}
            showsUserLocation={true}
          >
            {Object.keys(this.state.location).length ?
              <MapView.Marker
                coordinate={{
                  latitude: this.state.location.lat,
                  longitude: this.state.location.lng
                }}
                title={"Your Destination"}
              />
              :
              console.log(this.state.location, 'position')
            }

            {<MapViewDirections
              origin={{ "latitude": this.state.latitude, "longitude": this.state.longitude }}
              destination={{ "latitude": this.state.location.lat, "longitude": this.state.location.lng }}
              apikey={'AIzaSyAGKFNn0Gk9EFj35JTLG5G77RQ3XHD8hH8'}
              strokeWidth={2}
              strokeColor="blue"

              query={{
                key: "travelmode",
                value: "driving"
              }}
            />}

          </MapView>}
        </View>

        <GooglePlacesAutocomplete
          placeholder='Enter Dropoff'
          placeholderTextColor='grey'
          minLength={2} // minimum length of text to search
          autoFocus={false}
          keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
          listViewDisplayed={false}    // true/false/undefined
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            {this.setState({ data }),this.onPressButton()}
          }}
          //onPress={() => this.onPressButton()}
          debounce={0} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          query={{
            key: "AIzaSyAGKFNn0Gk9EFj35JTLG5G77RQ3XHD8hH8",
            language: 'en', // language of the results
          }}

          styles={{
            container: {
              marginTop: hp('1.2%'),
            },
            textInputContainer: {
              width: wp('78%'),
              height: hp('6%'),
              //backgroundColor: '#c6c0bf',
              marginLeft: hp('2%'),
              borderRadius: 10
            },
            description: {
              fontWeight: 'bold',
              alignItems: 'center',
            },
            predefinedPlacesDescription: {
              color: '#1faadb'
            },
            listView: {
              width: wp('93.1%'),
              backgroundColor: 'white',
              marginLeft: hp('2%'),
            },
            textInput: {
              //width: wp('10%'),
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0,
              marginTop: 0,
              height: hp('6%'),
              color: 'grey',
              fontSize: 15,
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 8,
              borderColor: 'grey',
              borderWidth: 1,
              //marginTop: hp('1.5%'),
            }
          }}

        />

        <View style={styles.footer}>
          <View style={styles.fareContainer}>

            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => { this._getDistance(), this.RBSheet.open() }}
            //onPress={() => this.RBSheet.open()}             
            >
              <Text style={{ fontSize: 25 }} >Select Car</Text>
            </TouchableOpacity>

            {/* <Text style={{ fontSize: 25 }}>{this.state.Motofare}</Text> */}
          </View>

          <View style={styles.gobuttonContainer}>
            <View style={{
              justifyContent: 'center', height: '100%',
              alignItems: 'center',
            }}>
              <TouchableOpacity
                style={styles.gobutton}
                onPress={() => this.GetLocation()}
              >
                <Icon name='right' size={35}></Icon>
                {/* <Text>hello</Text> */}
              </TouchableOpacity>
            </View>
            {/* <Text>button</Text> */}
          </View>
        </View>

        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={hp('30%')}
          duration={250}
          customStyles={{
            container: {
              justifyContent: 'flex-start',
              alignItems: "center"
            }
          }}
        >
          <View style={{ backgroundColor: 'white', height: hp('100%'), width: wp('100%') }}>
            <TouchableOpacity onPress={() => this.GetLocation()}>
              <View style={styles.Vehicles}>
                <Vehicle name='car-sports' size={30} style={{ marginLeft: '5%' }}></Vehicle>
                <Text style={{ fontSize: 30, marginLeft: '5%' }}>Uber Go</Text>
                <Text style={{ fontSize: 30, marginLeft: '5%' }}>Fare:{this.state.Gofare}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.GetLocation()}>
              <View style={styles.Vehicles}>
                <Image style={{ height: 25, width: 25, marginLeft: '5%' }}
                  source={{ uri: 'https://static.thenounproject.com/png/993-200.png' }}></Image>
                <Text style={{ fontSize: 30, marginLeft: '5%' }}>Uber Auto</Text>
                <Text style={{ fontSize: 30, marginLeft: '5%' }}>Fare:{this.state.Autofare}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.GetLocation()}>
              <View style={styles.Vehicles}>
                <Vehicle name='motorbike' size={30} style={{ marginLeft: '5%' }}></Vehicle>
                <Text style={{ fontSize: 30, marginLeft: '5%' }}>Uber Moto</Text>
                <Text style={{ fontSize: 30, marginLeft: '5%' }}>Fare:{this.state.Motofare}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </RBSheet>

        {/* <Modal
          testID={'modal'}
          isVisible={this.state.check}
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={800}
          backdropTransitionOutTiming={800}>
          <View style={{backgroundColor:'white',height:hp('20%'),
          width:wp('90%')}}>
            <Text>Confirm Dropoff</Text>
            <TouchableOpacity onPress={()=>{this.onPressButton() && this.GetLocation()}}>
              <Text>Submitss</Text>
            </TouchableOpacity>
            
          </View>
        </Modal> */}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },

  map: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },

  locationpickup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },

  inputcontainer1: {
    width: wp('70%'),
    height: hp('6%'),
    backgroundColor: 'white',
    color: '#7c848b',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    borderColor: '#ddd',
    fontSize: wp('4%'),
    marginBottom: wp('2%'),
    paddingLeft: wp('3%'),
    justifyContent: 'flex-end'
    //marginBottom:hp('4%'),
  },

  inputcontainer2: {
    width: wp('70%'),
    height: hp('6%'),
    backgroundColor: 'white',
    color: '#7c848b',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    borderColor: '#ddd',
    fontSize: wp('4%'),
    marginBottom: wp('2%'),
    paddingLeft: wp('3%'),
    marginBottom: hp('4%'),
    justifyContent: 'flex-end'
  },

  footer: {
    backgroundColor: 'white',
    height: hp('10%'),
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center'
  },

  fareContainer: {
    width: wp('78%'),
    height: hp('8%'),
    //backgroundColor:'cyan',
    flexDirection: 'row',
    alignItems: "center"
  },

  gobuttonContainer: {
    width: wp('18%'),
    //backgroundColor:'pink',
    height: hp('8%'),
    alignItems: 'center',

  },
  gobutton:
  {
    height: hp('5%'),
    width: wp('8.2%'),
    justifyContent: 'center',
  },
  Vehicles: {
    backgroundColor: 'white',
    height: hp('9.1%'),
    width: wp('100%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    borderColor: '#ddd',
    marginBottom: hp('1%'),
    alignItems: 'center',
    flexDirection: 'row',

  }
});

export default App;
