/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// screens/AuthScreen.tsx
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  Button,
  StyleSheet,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from '../components/modals/FormModal';
import {getUser} from '../services/async_storage';
import {getUserByUniqueID} from '../services/database';
import {useUser} from '../context/user_context';

interface AuthScreenProps {
  setUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthScreen: React.FC<AuthScreenProps> = ({setUserLoggedIn}) => {
  const [showModal, setShowModal] = useState(false);
  const [uniqueID, setUniqueID] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const {user, setUser} = useUser();
  useEffect(() => {
    checkUserSession();
    if (!isLoading && user) {
      setUserLoggedIn(true);
    }
  }, [isLoading, user]);

  const handleLogin = (token: any) => {
    getUserByUniqueID(
      token ?? '',
      user => {
        if (user != null) {
          setUser(user);
          setUserLoggedIn(true);
        } else {
          Alert.alert('Kullanıcı Bulunamadı');
        }
      },
      () => {
        console.log('User not found');
      },
    );
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const checkUserSession = async () => {
    // setIsLoading(true);
    try {
      const userData = await getUser();
      if (userData === null) {
        setUserLoggedIn(false);
        handleOpenModal();
        setIsLoading(false);
      } else {
        getUserByUniqueID(
          userData,
          user => {
            setUser(user);
            setUserLoggedIn(true);

            setIsLoading(false); // Kullanıcı oturumu kontrol
            console.log(user);
          },
          () => {
            setIsLoading(false);
          },
        );
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg2.png')}
      style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          {isLoading ? (
            // Yükleme göstergesi
            <ActivityIndicator size="large" color="white" />
          ) : (
            // Normal içerik
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Kimlik Numarası"
                  placeholderTextColor={'gray'}
                  onChangeText={(val: any) => {
                    setUniqueID(val);
                  }}
                  style={[styles.input, styles.transparentInput]}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title="Giriş Yap"
                  onPress={() => handleLogin(uniqueID)}
                  color="white"
                  disabled={!uniqueID}
                />
              </View>
            </>
          )}
        </SafeAreaView>
      </View>
      <CustomModal visible={showModal} onClose={handleCloseModal} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Karartma efekti
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 40,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 10,
    borderRadius: 5,
    color: 'white', // Input metin rengi
    borderBottomWidth: 1,
    borderEndWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  transparentInput: {
    backgroundColor: 'transparent', // Input arkaplan rengi transparan
  },
  buttonContainer: {
    marginBottom: 20,
    backgroundColor: '#0a2f35',
    width: 300,
    padding: 3,
    borderRadius: 7,
  },
});

export default AuthScreen;
