import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ItemsListScreen from './src/screens/ItemsListScreen';
import ItemDetailScreen from './src/screens/ItemDetailScreen';
import CreateItemScreen from './src/screens/CreateItemScreen';
import EditItemScreen from './src/screens/EditItemScreen';
import { AuthProvider } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

const App = () => {
  // @ts-ignore
    // @ts-ignore
    return (
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
            <Stack.Screen name="ItemsList" component={ItemsListScreen} options={{ title: 'Items' }} />
            <Stack.Screen name="ItemDetail" component={ItemDetailScreen} options={{ title: 'Item Details' }} />
            <Stack.Screen name="CreateItem" component={CreateItemScreen} options={{ title: 'Create Item' }} />
            <Stack.Screen name="EditItem" component={EditItemScreen} options={{ title: 'Edit Item' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
  );
};

export default App;
