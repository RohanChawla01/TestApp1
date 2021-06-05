import React, {useEffect, useState} from 'react';
import {AsyncStorage, Button, Picker, Text, View} from 'react-native';

import {employeeList, employeeData} from '../../services/employee';
// using inline style now, though not recommened, but remove later if time left

type Props = {
  logout: () => void,
};

type State = {
  isLoading: Boolean,
  isEmpDataLoading: Boolean,
  list: Array,
  selectedEmpId: string,
  selectedEmpData: Object,
  error?: boolean,
};

export default class Home extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isEmpDataLoading: true,
      list: [],
      password: '',
    };
  }

  componentDidMount() {
    employeeList()
      .then(list => {
        // sometimes list is coming undefined from open source API
        if (list) {
          const selectedElement = list[0];
          this.setState({
            list,
            isLoading: false,
            selectedEmpData: selectedElement,
            selectedEmpId: selectedElement.id,
            isEmpDataLoading: false,
          });
        } else {
          this.setState({isLoading: false, error: true});
        }
      })
      .catch(err => {
        this.setState({isLoading: false, isEmpDataLoading: false, error: true});
      }); // display this error appropriately
  }

  displayPickerValues = () => {
    // we can use loader in real cases in render
    return this.state.list.map(employee => (
      <Picker.Item
        key={employee.id}
        label={`${employee.employee_name}- ${employee.employee_age}`}
        value={employee.id.toString()}
      />
    ));
  };

  setselectedEmpData = id => {
    this.setState({isEmpDataLoading: true});

    employeeData(id)
      .then(data => {
        this.setState({
          selectedEmpData: data,
          isEmpDataLoading: false,
        });
      })
      .catch(err => {}); // display this error appropriately
  };

  setSelectedEmployeeId = id => {
    this.setState({selectedEmpId: id}, () => this.setselectedEmpData(id));
  };

  displayEmpData = () => {
    const {selectedEmpData, isEmpDataLoading} = this.state; //destructuring

    // just wrote return with if, else
    if (isEmpDataLoading) {
      return <Text>Getting Employee Data</Text>;
    }

    const isDataAvailable =
      selectedEmpData && Object.keys(selectedEmpData).length;
    const keysArr = isDataAvailable && Object.keys(selectedEmpData);
    return (
      <View>
        {isDataAvailable ? (
          keysArr.map((key, i) => (
            <Text key={`custom-${i}`}>
              {`${[key]} : ${selectedEmpData[key]}` + ' '}
            </Text>
          ))
        ) : (
          <Text>Getting Employee Data Error</Text>
        )}
      </View>
    );
  };

  onLogout = async () => {
    await AsyncStorage.removeItem('user');
    this.props.logout();
  };

  render() {
    const {selectedEmpId, list, isLoading, error} = this.state;
    const isListAvailable = list.length > 0;

    if (error) {
      return <Text>Something Went Wrong!</Text>;
    }
    return (
      <>
        {isLoading ? (
          <Text>Loading</Text>
        ) : (
          <>
            <Picker
              selectedValue={selectedEmpId}
              style={{flex: 1}}
              onValueChange={this.setSelectedEmployeeId}>
              {isListAvailable ? this.displayPickerValues() : <View />}
            </Picker>
            <View
              style={{
                flex: 1,
                marginTop: 20,
                justifyContent: 'center',
              }}>
              {this.displayEmpData()}
            </View>
            <Button title="LogOut" onPress={this.onLogout} />
          </>
        )}
      </>
    );
  }
}
