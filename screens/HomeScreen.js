import React from 'react';
import {Container,Content,Text ,Button ,Form,Item,Input,Label,View} from "native-base";
import { StyleSheet } from 'react-native';
import PhoneInput from 'react-native-phone-input'
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import register from '../api/register.api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15
  },
  submitButton:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    width: 100,

  }
});
let token="";
export default class HomeScreen extends React.Component {
  constructor(){
    super();
    this.state={
      userInfo:{},
      phone_number:"",
      first_name:"",
      last_name:"",
      pickerData: null,
    };

  }
  componentDidMount() {
      this.registerForPushToken();
  }


  selectCountry=(country)=>{
    this.phone.selectCountry(country.cca2.toLowerCase())
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
        fcm_key: token,
        app_version: Constants.manifest.version,
        device_details: {
            deviceId:Constants.deviceId,
            deviceName: Constants.deviceName,
            deviceYearClass: Constants.deviceYearClass,
            isDevice: Constants.isDevice
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
