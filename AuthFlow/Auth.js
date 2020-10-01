import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { SplashScreen, DrawerScreen, SignInScreen } from '.';
import { AuthContext } from './utils';
import { API_USERDETAIL } from '../api/ApiUnlockUser';
import { API_COMPANYCODE, API_PLANTCODE, API_PRODUCTCODE, API_USERNAME } from '../api/Api';

const Stack = createStackNavigator();

export default function Auth() {
  const [valueUserDetail, getUserDetail] = React.useState({});
  const [userAuth, getUserAuth] = React.useState({});
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          if (action.token) {
            AsyncStorage.setItem('userToken', action.token);
          }
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          AsyncStorage.removeItem('userToken');
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      let userDetail;
      let userAuth;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        userDetail = await AsyncStorage.getItem('keyUserDetail');
        userAuth = await AsyncStorage.getItem('userAuth');
        getUserDetail(JSON.parse(userDetail));
        getUserAuth(JSON.parse(userAuth))
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        //Mã công ty
        await fetch(API_COMPANYCODE, {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            pass: data.password
          })
        }).then(res => res.json()).then(async (res) => {
          console.log(res.DATA);
          await AsyncStorage.setItem('listCompanyCode', JSON.stringify(res.DATA.map(({ NAME }) => ({ name: NAME }))));
        }).catch(err => console.log(err));
        //Mã kho
        await fetch(API_PLANTCODE, {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            pass: data.password
          })
        }).then(res => res.json()).then(async (res) => {
          await AsyncStorage.setItem('listPlantCode', JSON.stringify(res.DATA.map(({ NAME }) => ({ name: NAME }))));
        }).catch(err => console.log(err));
        //Mã mặt hàng
        await fetch(API_PRODUCTCODE, {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            pass: data.password
          })
        }).then(res => res.json()).then(async (res) => {
          await AsyncStorage.setItem('listItemCode', JSON.stringify(res.DATA.map(({ NAME }) => ({ name: NAME }))));
        }).catch(err => console.log(err));
        //Tên tài khoản
        await fetch(API_USERNAME, {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            pass: data.password
          })
        }).then(res => res.json()).then(async (res) => {
          await AsyncStorage.setItem('listUserName', JSON.stringify(res.DATA.map(({ NAME }) => ({ name: NAME }))));
        }).catch(err => console.log(err));
        //Thông tin user
        await fetch(API_USERDETAIL, {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: data.username,
            username: data.username,
            pass: data.password
          })
        }).then(res => res.json()).then(async (res) => {
          await AsyncStorage.setItem('userAuth', JSON.stringify(res.E_AUTH))
            .then(() => AsyncStorage.setItem('keyUserDetail', JSON.stringify(res.DATA[0])))
            .then(() => {
              getUserAuth(res.E_AUTH)
              getUserDetail(res.DATA[0])
            });
        }).catch(err => getUserDetail({}))
        data.showLoader(false);
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: async () => {
        await AsyncStorage.removeItem('userAuth');
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userDetail');
        // await AsyncStorage.removeItem('userAuth').then(() =>
        //     AsyncStorage.removeItem('userToken').then(() =>
        //         AsyncStorage.removeItem('userDetail')
        //     )
        // )
        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
                // User is signed in
                <Stack.Screen
                  name="Home"
                  // component={DrawerScreen} 
                  children={(props) => <DrawerScreen {...props} userDetail={valueUserDetail} userAuth={userAuth} />}
                />
              )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider >

  );
}