import React from 'react';
import {
  Alert,
  AsyncStorage,
  Button,
  KeyboardAvoidingView,
  TextInput,
  View,
} from 'react-native';

import {getEmployeeList} from '../../services/employee';

// using inline style now, though not recommened, but remove later if time left

type Props = {
  onLoginSuccess: () => void,
};

type State = {
  password: string | Number,
  email: string,
};

export default class Login extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  alert = (title: String, message: string) =>
    Alert.alert(title, message, [{text: 'Cancel'}, {text: 'Ok'}], {
      cancelable: false,
    });

  handleEmailOnChange = (value: string) => {
    this.setState({email: value});
  };

  handlePasswordOnChange = (value: string) => {
    this.setState({password: value});
  };

  checkValidations = () => {
    const {email, password} = this.state;

    if (!email || !password) {
      this.alert('Error', 'Enter Password and email');
      return;
    }

    // use regex here otherwise
    if (!email.includes('@') || !email.includes('.')) {
      this.alert('Enter Correct Format', 'Email should contain @ and .');
      return;
    }

    if (password.length < 6) {
      this.alert('Error', 'Password must be atleast 6 characters long!');
      return;
    }

    return true;
  };

  storeCredentails = () => {
    const {email, password} = this.state;
    const data = JSON.stringify({email, password});

    return AsyncStorage.setItem('user', data);
  };

  onLoginClick = async () => {
    const valid = this.checkValidations();

    if (!valid) return;

    await this.storeCredentails();
    this.props.onLoginSuccess();
  };

  render() {
    return (
      <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center'}}>
        <TextInput
          style={{borderWidth: 2, minHeight: 50, marginBottom: 20}}
          placeholder="Email"
          onChangeText={this.handleEmailOnChange}
        />
        <TextInput
          style={{borderWidth: 2, minHeight: 50}}
          placeholder="Password"
          onChangeText={this.handlePasswordOnChange}
        />
        <Button title="Login" onPress={this.onLoginClick} />
        <TextInput></TextInput>
      </KeyboardAvoidingView>
    );
  }
}
