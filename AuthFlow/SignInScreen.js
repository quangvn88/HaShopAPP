import * as React from 'react';
import {
  TextInput,
  View,
  Dimensions,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';

import { AuthContext } from './utils';

import { BackgroundCurve } from '../components/BackgroundCurve/BackgroundCurve';

import { scale } from '../responsive/Responsive';

import { API_LOGIN } from '../api/Api'
import Loader from '../loading/Loader';

export function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [condition, setCondition] = React.useState('');
  const [isLoading, showLoading] = React.useState(false);
  const [hidePass, showPass] = React.useState(true);

  const passwordRef = React.useRef();

  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <StatusBar backgroundColor="#4169E1" barStyle="light-content" />
      <Loader loading={isLoading} />
      <View style={{ height: scale(240) }}>
        <BackgroundCurve
          style={styles.svg}
          svg={{
            position: 'absolute',
            top: scale(300),
          }}
          viewAbove={{
            backgroundColor: '#FB7200',
            height: scale(340),
          }}
          colorSvg={'#FB7200'}
        />
        <BackgroundCurve
          style={styles.svg}
          svg={{
            position: 'absolute',
            top: scale(295),
          }}
          viewAbove={{
            backgroundColor: '#4169E1',
            height: scale(335),
          }}
          colorSvg={'#4169E1'}
        />
        <View style={styles.headerContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={require('../assets/petrolimex.png')}></Image>
          </View>
          <View>
            <Text style={styles.textHeader}>PETROLIMEX</Text>
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: scale(40) }}>
        <View>
          <MaterialCommunityIcons
            name="account-outline"
            color={'#756c6c'} size={28}
            style={styles.inputIcon}
          />
          <TextInput
            maxLength={30}
            returnKeyType='next'
            style={styles.input}
            // autoFocus={true}
            placeholder="Tên tài khoản"
            onChangeText={setUsername}
            value={username}
            autoCapitalize="none"
            underlineColorAndroid='transparent'
            onSubmitEditing={() => passwordRef.current.focus()}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: scale(18),
              right: scale(20)
            }}
            onPress={() => {
              setUsername('');
            }}
          >
            <Feather
              name={"x-circle"}
              color={'#756c6c'} size={20}
            />
          </TouchableOpacity>
        </View>
        <View>
          <MaterialCommunityIcons
            name="lock-outline"
            color={'#756c6c'} size={28}
            style={styles.inputIcon}
          />
          <TextInput
            maxLength={30}
            ref={passwordRef}
            style={styles.input}
            placeholder="Mật khẩu"
            secureTextEntry={hidePass}
            onChangeText={setPassword}
            value={password}
            autoCapitalize="none"
          />
          {password != '' ? (<TouchableOpacity
            style={{
              position: 'absolute',
              top: scale(18),
              right: scale(70)
            }}
            onPress={() => {
              setPassword('');
            }}
          >
            <Feather
              name={"x-circle"}
              color={'#756c6c'} size={20}
            />
          </TouchableOpacity>) : null}

          <TouchableOpacity
            style={{
              position: 'absolute',
              top: scale(12),
              right: scale(15)
            }}
            onPress={() => {
              showPass(!hidePass);
            }}
          >
            <MaterialCommunityIcons
              name={hidePass ? "eye-outline" : "eye-off-outline"}
              color={'#756c6c'} size={28}
            />
          </TouchableOpacity>
        </View>
        <View >
          <TouchableOpacity
            style={{ justifyContent: 'center' }}
            activeOpacity={0.3}
            onPress={() => {
              if (username == '')
                setCondition('Vui lòng nhập tài khoản');
              else if (password == '')
                setCondition('Vui lòng nhập mật khẩu');
              else {
                showLoading(true);
                fetch(API_LOGIN, {
                  method: 'post',
                  headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ username: username, pass: password })
                }).then(res => res.json()).then((res) => {
                  setTimeout(async () => {
                    if (res.RETURN) {
                      try {
                        await AsyncStorage.setItem('user', username);
                        await AsyncStorage.setItem('pass', password);
                      } catch (error) {
                        // Error saving data
                      }
                      //showloading(false) in AuthFlow
                      signIn({ username, password, showLoader: showLoading.bind(this) });
                    } else {
                      showLoading(false);
                      setCondition('Tài khoản hoặc mật khẩu không chính xác');
                    }
                  }, 500)

                }).catch((error) => {
                  // console.log(error)
                  // setTimeout(() => {
                  showLoading(false);
                  // }, 500)
                  let myError = new Error(error);
                  let messageError = myError.message;
                  if (messageError.includes("SyntaxError"))
                    setCondition('Tài khoản hoặc mật khẩu không chính xác');
                  else if (messageError.includes("TypeError"))
                    setCondition('Lỗi kết nối kiểm tra đường truyền');
                  else
                    setCondition('Lỗi: ' + error);
                });
                setCondition('');

              }
            }}
          >
            <LinearGradient
              start={{ x: 0.0, y: 0.5 }} end={{ x: 0.5, y: 1.0 }}
              colors={['#d47313', '#f74e00', '#f72900', '#f73e00']}
              style={styles.btnLogin}
            >
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>Đăng nhập</Text>
            </LinearGradient>

          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center', marginTop: scale(5) }}>
          <Text style={{ color: '#e3610b' }}>{condition}</Text>
        </View>
      </View>
    </View >
  );
}
const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    top: scale(-200),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginLeft: scale(10),
    marginTop: scale(50)
  },
  textHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  image: {
    width: scale(131),
    height: scale(111),
  },
  imageContainer: {
    width: scale(125),
    height: scale(116),
    borderTopLeftRadius: scale(25),
    borderBottomRightRadius: scale(23),
    backgroundColor: 'white'
  },
  input: {
    borderWidth: scale(1),
    width: '100%',
    height: scale(50),
    borderRadius: scale(25),
    fontSize: 16,
    marginVertical: scale(5),
    paddingLeft: scale(50),
    // paddingRight: scale(125)
  },
  inputIcon: {
    position: 'absolute',
    top: scale(12),
    left: scale(10)
  },
  btnLogin: {
    width: '100%',
    justifyContent: 'center',
    borderWidth: scale(1),
    height: scale(50),
    borderRadius: scale(25),
    marginTop: scale(30),
    borderColor: 'transparent',
    // elevation:1
  },
});