import React, { Component } from 'react';
import {
  View,
  FlatList,
  StyleSheet
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
// import DeclareCycle from '../Functions/DeclareCycle';
import Function from '../Function/Function';
import { scale } from '../responsive/Responsive';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      userAuth: props.userAuth,
      functions: [
        {
          name: 'DeclareCycle',
          title: 'Khai báo PO CKG',
          imageUrl: require('../../assets/DeclareCycle.png'),
          keyAuth: 'KB_POCKG'
        }
      ]
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        userAuth: nextProps.userAuth,
      })
    }
  }
  render() {
    const { functions } = this.state;
    const { navigation } = this.props;
    return (
      <FlatList
        data={functions}
        numColumns={2}
        renderItem={({ item }) =>
          <View style={styles.container}>
            <Function
              functionProps={item}
              imageSource={item.imageUrl}
              onPress={() => navigation.navigate(item.name)}
            />
          </View>
        }
        keyExtractor={(item, index) => `${index}`}
      />
    );
  };
}

const Stack = createStackNavigator();

export default function Home({ userAuth }) {
  // console.log(userAuth);
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        return {
          headerBackTitle: ' ',
          headerStyle: styles.headerStyle,
          headerTintColor: '#fff',
          headerTitleStyle: Platform.OS == 'ios' ? {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center'
          } : {
              fontWeight: 'bold',
              textAlign: 'center',
              width: route.name == "Home" ? '100%' : '85%',
            },

        }
      }
      }
    >
      <Stack.Screen name="Home" children={(props) => <HomeScreen {...props} />} options={{ title: 'Trang chủ', }} />
      {/* <Stack.Screen name="DeclareCycle" component={DeclareCycle} options={{ title: 'Khai báo PO CKG', }} /> */}
    </Stack.Navigator >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    backgroundColor: '#4169E1',
    height: scale(80),
    borderBottomWidth: scale(3),
    borderBottomColor: '#FB7200',
  }
});