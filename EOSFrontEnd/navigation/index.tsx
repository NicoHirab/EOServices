/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import * as React from 'react';
import { ActivityIndicator, ColorSchemeName, Pressable, View } from 'react-native';

import Firebase from '../config/firebase';
import Colors from '../constants/Colors';
import ServerConstants from '../constants/Server';
import { User } from '../interfaces/User';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { PrivateProfile } from '../screens/PrivateProfile';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import GetFormatedDate from '../services/DateFormater';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import { AuthenticatedUserContext } from './AuthenticatedUserProvider';
import AuthStack from './AuthStack';
import AddPostScreen from '../screens/AddPostScreen';
import { PublicProfile } from '../screens/PublicProfile';
import PostDetailsScreen from '../screens/PostDetailsScreen';
import { LinkWallet } from '../screens/LinkWallet';
import { CreateWalletTutorial } from '../screens/CreateWalletTutorial';

const auth = Firebase.auth();

async function checkUser(user: any) {

  try {
    const res = await axios.get<any>(ServerConstants.prod + 'auth', { params: { uid: user.uid } });
    // if user exists, return user

    if (res.data){
      console.log("user exists", res.data);
      delete res.data._id;
      return [res.data, false];
    }

    // add user to mongodb
    console.log("user does not exists", res.data);
    const newUsr: User = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      joinedDate: GetFormatedDate(new Date())
    };
    await axios.post(ServerConstants.prod + 'auth', newUsr);

    return [newUsr, true];    
  } catch (err) {
    console.log('checkuser')
    console.log(err);
  }
}

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const { user, setUser, isNewUser, setIsNewUser } =  React.useContext(AuthenticatedUserContext);
  //const { isNewUser, setIsNewUser } =  React.useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(async (authenticatedUser: any) => {
      try {
        if (authenticatedUser) {
          var response = await checkUser(authenticatedUser);
          authenticatedUser = response[0];
          setIsNewUser(response[1]);
        }
        
        // setUser to either null or return value of checkUser
        if (setUser) await setUser(authenticatedUser);
        else throw new Error('setUser undefined');

        setIsLoading(false);
      } catch (error) {
        console.log('onAuthChanged')
        console.log(error);
      }
    });

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    )
  }

  return (
    <NavigationContainer>
      {user ? <BottomTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

const TabOneStack = createNativeStackNavigator();
function TabOneStackScreen() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen name="Root" component={TabTwoScreen} options={{ headerShown: false }} />
      <TabOneStack.Screen name="AddPost" component={AddPostScreen} />
      <TabOneStack.Screen name="PostDetails" component={PostDetailsScreen} options={{headerShown: false}}/>
    </TabOneStack.Navigator>
  )
}

const TabTwoStack = createNativeStackNavigator();
function TabTwoStackScreen() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen name="Root" component={TabOneScreen} options={{ headerShown: false }} />
      <TabTwoStack.Screen name="Link" component={LinkWallet} options={{ headerShown: false }} />
      <TabTwoStack.Screen name="CreateWalletTutorial" component={CreateWalletTutorial} options={{ headerShown: false }} />
      <TabTwoStack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <TabOneStack.Screen name="PostDetails" component={PostDetailsScreen} options={{headerShown: false}}/>
      <TabTwoStack.Group screenOptions={{ presentation: 'modal' }}>
        <TabTwoStack.Screen name="Modal" component={ModalScreen} />
      </TabTwoStack.Group>
    </TabTwoStack.Navigator>
  )
}

const TabThreeStack = createNativeStackNavigator();
function TabThreeStackScreen() {
  return (
    <TabThreeStack.Navigator>
      <TabThreeStack.Screen name="Root" component={TabTwoScreen} options={{ headerShown: false }} />
    </TabThreeStack.Navigator>
  )
}

const TabFourStack = createNativeStackNavigator();
function TabFourStackScreen() {
  return (
    <TabFourStack.Navigator>
      <TabFourStack.Screen name="Root" component={PrivateProfile} options={{ headerShown: false }} />
      <TabFourStack.Screen name="PublicProfile" component={PublicProfile} options={{ headerShown: false }} />
    </TabFourStack.Navigator>
  )
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        headerShown: false,
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={TabOneStackScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoStackScreen}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <TabBarIcon name="explore" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabThree"
        component={TabThreeStackScreen}
        options={{
          title: 'Message',
          tabBarIcon: ({ color }) => <TabBarIcon name="chat-bubble" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabFour"
        component={TabFourStackScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={30} style={{ marginBottom: -3 }} {...props} />;
}
