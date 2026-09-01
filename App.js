import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/Home";
import PosicaoGPSScreen from "./src/screens/PosicaoGPS";
// import RedesWifi from "./src/screen/RedesWifi";
import RedesWifiScreen from "./src/screens/RedesWifi";

const Stack = createNativeStackNavigator()

export default function App() {
  return (
   <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
      name= "HomeScreen"
      component={HomeScreen}
      options= {{headerShown:false}}
      />

      <Stack.Screen
      name= "PosicaoGPSScreen"
      component={PosicaoGPSScreen}
      options= {{title: 'Posição Atual'}}
      />

      <Stack.Screen
      name= "RedesWifiScreen"
      component={RedesWifiScreen}
      options= {{title: 'Redes Wifi'}}
      />
    </Stack.Navigator>
   </NavigationContainer>
  );
}

