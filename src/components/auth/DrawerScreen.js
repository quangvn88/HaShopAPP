import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Alert
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';

import { AuthContext } from './utils';

import { scale } from '../responsive/Responsive';
import Loader from '../loading/Loader';

import NavigationScreen from './NavigationScreen';

import { API_COMPANYCODE, API_PLANTCODE, API_PRODUCTCODE, API_USERNAME } from '../../api/Api';
import { API_USERDETAIL } from '../../api/ApiUnlockUser';
import { SafeAreaView } from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();

export function DrawerScreen(props) {
  const [userDetail, updateUserDetail] = React.useState(props.userDetail);
  const [userAuth, updateUserAuth] = React.useState(props.userAuth);
  const { signOut } = React.useContext(AuthContext);
  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <Drawer.Navigator
      initialRouteName="Feed"
      drawerStyle={styles.drawerStyle}
      drawerContentOptions={{
        activeTintColor: '#4169E1',
        padding: 0,
        itemStyle: styles.itemStyle,
        labelStyle: styles.labelStyle,
      }}
      drawerContent={
        props => <CustomDrawerContent
          {...props}
          signOut={signOut}
          updateUserDetail={updateUserDetail.bind(this)}
          updateUserAuth={updateUserAuth.bind(this)}
        />
      }
    // drawerPosition="right"
    >
      <Drawer.Screen
        name="Home"
        children={(props) => <NavigationScreen {...props} userDetail={userDetail} userAuth={userAuth} />}
        options={{
          drawerLabel: 'Trang chủ',
          drawerIcon: ({ color }) =>
            <MaterialCommunityIcons name="home" color={color} size={30} />,
        }}
      />
    </Drawer.Navigator >
  );
}

function CustomDrawerContent(props) {
  const { navigation, updateUserDetail, updateUserAuth } = props;
  const clearData = async () => {
    await AsyncStorage.removeItem('listCompanyCode').then(() =>
      AsyncStorage.removeItem('listPlantCode').then(() =>
        AsyncStorage.removeItem('listItemCode').then(() =>
          AsyncStorage.removeItem('listUserName').then(() =>
            AsyncStorage.removeItem('keyUserDetail').then(() =>
              AsyncStorage.removeItem('userAuth')
            )))))
  }
  const getData = async (username, password, showLoading) => {
    await fetch(API_COMPANYCODE, {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        pass: password
      })
    }).then(res => res.json()).then(async (res) => {
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
        username: username,
        pass: password
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
        username: username,
        pass: password
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
        username: username,
        pass: password
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
        user: username,
        username: username,
        pass: password
      })
    }).then(res => res.json()).then(async (res) => {
      await AsyncStorage.setItem('userAuth', JSON.stringify(res.E_AUTH));
      await AsyncStorage.setItem('keyUserDetail', JSON.stringify(res.DATA[0]));
      await updateUserAuth(res.E_AUTH);
      await updateUserDetail(res.DATA[0]);
      showLoading(false);
      setTimeout(() => {
        Alert.alert("Kết quả", 'Cập nhật dữ liệu thành công');
      }, 100);

      // await AsyncStorage.setItem('keyUserDetail', JSON.stringify(res.DATA[0]));
    }).catch(err => console.log(err))
  }
  const update = async () => {
    navigation.closeDrawer();
    showLoading(true);
    clearData();
    let username;
    let password;
    await AsyncStorage.getItem('user').then((user) => {
      username = user;
    }).then(() => AsyncStorage.getItem('pass').then((pass) => {
      password = pass;
    })).then(() => {
      getData(username, password, showLoading.bind(this));
    })
  }
  const [loading, showLoading] = React.useState(false);
  const { signOut } = props;
  const signOutApp = async () => {
    // await AsyncStorage.clear();
    signOut();
  };

  return (
    <DrawerContentScrollView {...props}>
      <Loader loading={loading} />
      <StatusBar backgroundColor="#4169E1" barStyle="light-content" />
      <View style={styles.headerDrawer}>
        <View style={styles.wrapLogo}>
          <Image
            style={styles.logo}
            source={require('../../assets/logo.png')}
          />
        </View>
        <View style={styles.wrapTextLogo}>
          <Text style={styles.textLogo}>PETROLIMEX</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label={() => <Text style={styles.labelStyle}>Cập nhật</Text>}
        onPress={update}
        icon={() => <MaterialCommunityIcons color={'#3eb516'} size={30} name="update" />}
        labelStyle={styles.labelStyle}
        style={[styles.itemStyle, { marginTop: 0 }]}
      />
      <DrawerItem
        label={() => <Text style={styles.labelStyle}>Đăng xuất</Text>}
        onPress={signOutApp}
        icon={() => <MaterialCommunityIcons color={'#d11515'} size={30} name="logout" />}
        labelStyle={styles.labelStyle}
        style={[styles.itemStyle, { marginTop: scale(25) }]}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    width: '90%',
    marginLeft: 0,
    borderTopRightRadius: scale(25),
    borderBottomRightRadius: scale(25),
    borderWidth: scale(1),
    borderColor: 'transparent'
  },
  drawerStyle: {
    padding: 0,
    margin: 0,
    width: scale(300),
    borderBottomColor: '#adadad',
    borderBottomWidth: scale(0.5)
  },
  labelStyle: {
    fontSize: 17
  },
  headerDrawer: {
    borderBottomColor: 'orange',
    borderBottomWidth: scale(2),
    padding: scale(4),
    marginBottom: scale(10),
    flexDirection: 'row',
    backgroundColor: '#2962ff',
    marginTop: scale(-5)
  },
  wrapLogo: {
    borderColor: 'white',
    borderWidth: scale(4),
    borderTopLeftRadius: scale(8),
    borderBottomRightRadius: scale(10)
  },
  logo: {
    height: scale(60),
    width: scale(60),
  },
  wrapTextLogo: {
    justifyContent: 'center',
    marginLeft: scale(20)
  },
  textLogo: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  }
});

