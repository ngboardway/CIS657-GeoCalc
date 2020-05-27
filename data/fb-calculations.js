import * as firebase from 'firebase';
import 'firebase/database';
import { firebaseConfig } from './fb-credentials';

export function initCalculationDB() {
  firebase.initializeApp(firebaseConfig);
}

export function storeCalculation(item) {
  firebase.database().ref('calculationData/').push(item).then((val) => {
    console.log(val.key);
  });
}

export function setupCalculationListener(updateFunc) {
  console.log('setupCalculationListener called');
  firebase
    .database()
    .ref(`calculationData/`)
    .on('value', (snapshot) => {
      console.log('data listener fires up with: ', snapshot);
      if (snapshot?.val()) {
        const fbObject = snapshot.val();
        const newArr = [];
        Object.keys(fbObject).map((key, index) => {
          console.log(key, '||', index, '||', fbObject[key]);
          newArr.push({ ...fbObject[key], id: key });
        });
        updateFunc(newArr);
      } else {
        updateFunc([]);
      }
    });
}