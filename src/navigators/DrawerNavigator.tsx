/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {ContactStackNavigator} from './StackNavigator';
import TabNavigator from './TabNavigator';
import ImagePicker from 'react-native-image-crop-picker';
import {useUser} from '../context/user_context';
import {updateUserImageUrl} from '../services/database';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  const [avatar, setAvatar] = useState<string | any>(null);
  const {user, setUser} = useUser();
  const selectImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      console.log(image.path);
      const path = image.path;
      setAvatar(path);
      updateUserImageUrl(
        user.uniqueID,
        image.path,
        () => {},
        () => {},
      );
    } catch (error) {
      console.log('Resim seçme hatası:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{alignItems: 'center', marginTop: 20}}>
        {/* Avatar */}
        <TouchableOpacity onPress={selectImage}>
          {user.img_url ? (
            <Image
              source={{uri: user.img_url}}
              style={{width: 120, height: 120, borderRadius: 60}}
            />
          ) : (
            <View
              style={{
                backgroundColor: 'black',
                width: 120,
                height: 120,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 60,
                alignSelf: 'center',
                marginBottom: 20,
              }}>
              <Text style={{color: 'white'}}>Resim Seç</Text>
            </View>
          )}
        </TouchableOpacity>
        {/* Kullanıcı Bilgileri */}
        <Text style={{marginTop: 10, marginBottom: 5}}>{user.fullName}</Text>
        <Text style={{color: 'gray', marginBottom: 10}}>
          {user.phoneNumber}
        </Text>

        <Text style={{color: 'gray'}}>{user.job}</Text>
      </View>
      {/* Diğer Navigasyon Öğeleri */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const screenOptionStyle = {
    headerStyle: {
      backgroundColor: '#0a2f35',
    },
    headerTintColor: 'white',
    headerBackTitle: 'Back',
  };

  return (
    <Drawer.Navigator
      screenOptions={screenOptionStyle}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        options={{headerTitle: ''}}
        name="Anasayfa"
        component={TabNavigator}
      />
      <Drawer.Screen name="Profil" component={ContactStackNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
