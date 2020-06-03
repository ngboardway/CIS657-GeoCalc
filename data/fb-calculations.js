import * as firebase from 'firebase';
import 'firebase/database';
import { firebaseConfig } from './fb-credentials';

export function initCalculationDB() {
  firebase.initializeApp(firebaseConfig);
}

export function storeCalculation(item) {
  firebase.database().ref('calculationData/').push(item);
}

export function setupCalculationListener(updateFunc) {
  firebase
    .database()
    .ref(`calculationData/`)
    .on('value', (snapshot) => {
      if (snapshot?.val()) {
        const fbObject = snapshot.val();
        const newArr = [];
        Object.keys(fbObject).map((key, index) => {
          newArr.push({ ...fbObject[key], id: key });
        });
        updateFunc(newArr);
      } else {
        updateFunc([]);
      }
    });
}