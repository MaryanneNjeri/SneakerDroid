import React from 'react';
import {Container,Content,Text ,Button ,Form,Item,Input,Label,View} from "native-base";
import {AsyncStorage, StyleSheet,NetInfo} from 'react-native';
import PhoneInput from 'react-native-phone-input'
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import register from '../api/register.api';
import dataUpload from '../api/dataupload.api';

import moment from 'moment'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
      justifyContent: 'center'
  },
  submitButton:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    width: 100,

  }
});
let token="";
let connection={};
export default class HomeScreen extends React.Component {
  constructor(){
    super();
    this.state={
      userInfo:{},
      phone_number:"",
      first_name:"",
      last_name:"",
      pickerData: null,
        connection:{}
    };
  }

   componentDidMount() {
       this.registerForPushToken();
       console.log('hello' ,moment().format('YYYY-MM-DD hh:mm:ss [+HHMM|-HHMM]'))
       NetInfo.getConnectionInfo().then(connectionInfo => {
           connection = connectionInfo;


       if (connectionInfo.type === 'wifi') {

           setTimeout(function () {
                   let data = {
                       app_version: 500,
                       participant_id: 19, // the data from the response returns participant-details thus returning an error.
                       probes_data: [
                           {
                               data: {
                                   name: Constants.name,
                                   is_system: false,
                                   is_installed: true
                               },
                               logged_time: moment().format('YYYY-MM-DD hh:mm:ss Z'),
                               probe: 2

                           }
                       ]
                   };
                   dataUpload(data);
               },
               20000)
       } else {
           console.log('No internet connection')
       }
   })

  }


  selectCountry=(country)=>{
    this.phone.selectCountry(country.cca2.toLowerCase());
    this.setState({cca2: country.cca2
    });

  };
  registerForPushToken=async ()=>{
      const { status: exstingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS,
      );
      // only ask if permissions have not already been determined, because ios wont
      // prompt the user a second time
      let finalStatus = exstingStatus;
      if (exstingStatus !== 'granted') {
          // this will only work on ios  as permission is android are  already granted
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
      }
      // stop here if the user did not grant any permission
      if (finalStatus !== 'granted') {
          return;
      }
      // get the token that uniquely identifies this device
      const push = await Notifications.getExpoPushTokenAsync();
      token = push ;



  };
  submit=()=>{
    const { first_name,last_name } = this.state;

    let user={
        first_name:first_name,
        last_name:last_name,
        phone_number: this.phone.getValue(),
        //unfortunately expo ios does not fcm its only supports expo android am using expo push token to identify the device
        fcm_key: token,
        app_version: 500,
        device_details: {
            device_model:Constants.platform.ios.model,
            device_id:Constants.deviceId,
            device_type:Constants.platform.ios.platform,
            hardware:Constants.platform.ios.systemVersion,
             manufacturer:'Apple',

        },
        project_code:'DROID7'

    };
    register(user)
  };

  render() {
    return (
       <Container>
         <Content contentContainerStyle={styles.container}>

           <Text>User Registration</Text>
          <Form>
            <Item floatingLabel>
              <Label>First Name</Label>
              <Input
                  onChangeText={first_name=>this.setState({first_name})}
              />
            </Item>
            <Item floatingLabel>
              <Label>Last Name</Label>
              <Input
                  onChangeText={last_name=>this.setState({last_name})}
              />
            </Item>
          </Form>
           <Text>{" "}</Text>
           <Text>Enter Phone number</Text>
           <PhoneInput
               ref={(ref)=>{this.phone = ref;}}
           />
           <View style={styles.submitButton}>
           <Button warning onPress={this.submit}><Text> Submit </Text></Button>
           </View>
         </Content>
       </Container>
    );
  }
}
