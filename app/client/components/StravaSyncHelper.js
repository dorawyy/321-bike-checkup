import axios from 'axios';
import PushNotification from 'react-native-push-notification';

const SyncStrava = (userId) => {
  console.log('post user id', userId);
  axios
    .post(
      'http://' +
        global.serverIp +
        ':5000/strava/' +
        userId +
        '/connectedStrava',
      {
        _id: userId,
      },
    )
    .then((resp) => {
      console.log('Successfully sent user tokens');
      PushNotification.configure({
        onRegister: (tokenData) => {
          console.log('Remote notification token: ', tokenData);
          tokenData = JSON.parse(tokenData);
          axios
            .post('http://' + global.serverIp + ':5000/user/registerDevice', {
              userId: userId,
              token: tokenData.token,
            })
            .then((res) => {
              console.log('Registered device');
            })
            .catch((err) => {
              console.log('Failed to register device: ', err);
            });
        },

        onNotification: (notification) => {
          console.log('Remote notification received: ', notification);
        },
        senderID: senderID,
        popInitialNotification: false,
        requestPermissions: true,
      });
    });
};

module.exports = SyncStrava;
