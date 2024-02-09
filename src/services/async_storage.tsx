import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserUniqueId = async (uniqueID: string) => {
  try {
    await AsyncStorage.setItem('userUniqId', uniqueID);
    console.log('uniqueID başarıyla kaydedildi.');
  } catch (error) {
    console.error('uniqueID kaydı başarısız:', error);
  }
};
export const getUser = async () => {
  const userToken = await AsyncStorage.getItem('userUniqId');
  return userToken;
};
export const deleteUser = async () => {
  await AsyncStorage.removeItem('userUniqId');
};
