// can use types, using any for saving time
// was a bit stuck with fetch because we use axios and aware with it's calls
// in working and practical, real projects, we write common get, post, put delete methods

const apiURL = `https://dummy.restapiexample.com/api/v1/`;

export const employeeList = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    fetch(`${apiURL}employees`, options)
      .then(response => response.json())
      .then(result => {
        resolve(result.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const employeeData = (id: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    fetch(`${apiURL}employee/${id}`, options)
      .then(response => response.json())
      .then(result => {
        resolve(result.data);
      })
      .catch(error => reject(error));
  });
};
