import React, { Component } from 'react';
import { Image, Text, TextInput } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button, View } from 'native-base';

export default class App extends Component {

  constructor(props){
    super(props);
    this.state=({
      data:''
    })
  }

  render(){
    
  return (
    <View style={{flex:1}}>
    <GooglePlacesAutocomplete
      placeholder='Search'
      minLength={2} // minimum length of text to search
      autoFocus={false}
      keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
      listViewDisplayed='auto'    // true/false/undefined
      onChangeText={(place) => this.setState({ place })}
      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
        console.log(data.description,'my jaga');    
      }}
      
      onPress={(data)=>{this.setState({ data })}}

      query={{
        key: "AIzaSyAGKFNn0Gk9EFj35JTLG5G77RQ3XHD8hH8",
        language: 'en', // language of the results
      }}

      styles={{
        textInputContainer: {
          width: '100%',
          height:'20%'
        },

        description: {
          fontWeight: 'bold'
        },

        textInput:{
          height:'80%'
        },

        predefinedPlacesDescription: {
          color: '#1faadb',
        }
      }}
      currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      nearbyPlacesAPI="AIzaSyAGKFNn0Gk9EFj35JTLG5G77RQ3XHD8hH8" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      debounce={0} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
    />
    <Button></Button>
    </View>
  );
  }
}
