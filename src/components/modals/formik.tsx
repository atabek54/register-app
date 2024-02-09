/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
  Image,
} from 'react-native';
import {Formik} from 'formik';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker';
import {formatDate} from '../../utils/date';
import * as Yup from 'yup';
import {addUser, updateUserImageUrl} from '../../services/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {saveUserUniqueId} from '../../services/async_storage';

interface CustomFormProps {
  visible: boolean;
  img_url: string;
  step: number;
  onSubmit: () => void;
}
const CustomForm: React.FC<CustomFormProps> = ({
  visible,
  onSubmit,
  img_url,
  step,
}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const showPicker = () => {
    setOpen(true);
  };

  return (
    <Formik
      initialValues={{
        fullName: '',
        uniqueID: '',
        phoneNumber: '',
        birthDate: '', // Initial value set to empty string
        gender: '',
        kvkkAccepted: false,
      }}
      onSubmit={values => {
        if (isValid) {
          addUser(
            {
              birthDate: values.birthDate,
              fullName: values.fullName,
              gender: values.gender,
              kvkkAccepted: values.kvkkAccepted,
              phoneNumber: values.phoneNumber,
              uniqueID: values.uniqueID,
              img_url: img_url, // Eğer img_url değeri formda yoksa, bu kısmı doldurmanıza gerek yok
              work_state: null,
              job: null,
              education_grade: null,
              school_info: null,
              skills: null,
              pdf_url: null,
              projects: null,
            },
            () => {
              saveUserUniqueId(values.uniqueID);
              // Kullanıcı ekleme başarılı
              Alert.alert('Kullanıcı başarıyla oluşturuldu.');
              onSubmit(); // Başarı durumunu geri dön
            },
            () => {
              // Kullanıcı ekleme başarısız
              Alert.alert('Kullanıcı zaten kayıtlı');
              //  onSubmit(); // Başarısızlık durumunu geri dön
            },
          );
        } else {
          console.log('Form validation failed!', values); // Hata durumunda değerleri konsola yazdır
        }
      }}
      validate={values => {
        const errors: any = {};
        if (!values.fullName) {
          errors.fullName = 'Ad Soyad boş olamaz';
        }
        if (!values.uniqueID) {
          errors.uniqueID = 'Kimlik No boş olamaz';
        } else if (values.uniqueID.length !== 11) {
          errors.uniqueID = 'Kimlik No 11 karakter olmalıdır';
        }
        if (!values.phoneNumber) {
          errors.phoneNumber = 'Telefon Numarası boş olamaz';
        } else if (!/^(5(\d{9}))$/.test(values.phoneNumber)) {
          errors.phoneNumber = 'Geçerli bir telefon numarası giriniz';
        }
        if (!values.birthDate) {
          errors.birthDate = 'Doğum Tarihi boş olamaz';
        }
        if (!values.gender) {
          errors.gender = 'Cinsiyet seçilmemiş';
        }
        if (!values.kvkkAccepted) {
          errors.kvkkAccepted = 'Kvkk Metni onaylanmamış';
        }
        setIsValid(Object.keys(errors).length === 0);
        return errors;
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
      }) => (
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              placeholder="Ad Soyad"
              placeholderTextColor={'gray'}
              onChangeText={handleChange('fullName')}
              onBlur={handleBlur('fullName')}
              value={values.fullName}
              style={styles.input}
            />
            <Image
              source={require('../../assets/icons/person.png')}
              style={{marginLeft: 5, width: 20, height: 30, tintColor: 'white'}}
            />
          </View>

          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              placeholder="Kimlik No"
              placeholderTextColor={'gray'}
              onChangeText={handleChange('uniqueID')}
              onBlur={handleBlur('uniqueID')}
              value={values.uniqueID}
              style={styles.input}
            />
            <Image
              source={require('../../assets/icons/uniqcard.png')}
              style={{marginLeft: 5, width: 30, height: 30, tintColor: 'white'}}
            />
          </View>

          {errors.uniqueID && (
            <Text style={styles.errorText}>{errors.uniqueID}</Text>
          )}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              placeholder="Telefon (5--)--- -- --"
              placeholderTextColor={'gray'}
              onChangeText={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
              value={values.phoneNumber}
              style={styles.input}
            />
            <Image
              source={require('../../assets/icons/call.png')}
              style={{marginLeft: 5, width: 30, height: 30, tintColor: 'white'}}
            />
          </View>

          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}

          <TouchableOpacity onPress={showPicker}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                placeholder="Doğum tarihi (seçmek için ikona tıkla)"
                placeholderTextColor={'gray'}
                value={values.birthDate} // Value set to birthDate from Formik values
                style={styles.input}
              />
              <Image
                source={require('../../assets/icons/birth.png')}
                style={{
                  marginLeft: 5,
                  width: 30,
                  height: 30,
                  tintColor: 'white',
                }}
              />
            </View>
          </TouchableOpacity>
          {errors.birthDate && (
            <Text style={styles.errorText}>{errors.birthDate}</Text>
          )}
          {open && (
            <DatePicker
              locale="tr"
              mode="date"
              modal
              open={open}
              date={date}
              onConfirm={selectedDate => {
                setOpen(false);
                setDate(selectedDate);
                setSelectedDate(formatDate(selectedDate)); // Format the selected date
                setFieldValue('birthDate', formatDate(selectedDate)); // Set Formik's birthDate field
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          )}
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 15,
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', marginRight: 10}}>Cinsiyet:</Text>
            <TouchableOpacity
              onPress={() => {
                setFieldValue('gender', 'Erkek');
                setGender('Erkek');
              }}
              style={[
                styles.genderButton,
                gender === 'Erkek' && styles.selectedGender,
              ]}>
              <Text style={styles.genderButtonText}>Erkek</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFieldValue('gender', 'Kadın');
                setGender('Kadın');
              }}
              style={[
                styles.genderButton,
                gender === 'Kadın' && styles.selectedGender,
              ]}>
              <Text style={styles.genderButtonText}>Kadın</Text>
            </TouchableOpacity>
          </View>
          {errors.gender && (
            <Text style={styles.errorText}>{errors.gender}</Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <CheckBox
              disabled={false}
              value={values.kvkkAccepted}
              onValueChange={newValue => {
                setToggleCheckBox(newValue);
                setFieldValue('kvkkAccepted', newValue);
              }}
            />
            <Text style={{marginLeft: 15, color: 'white'}}>
              Kvkk Metnini okudum, onaylıyorum.
            </Text>
          </View>
          {errors.kvkkAccepted && (
            <Text style={styles.errorText}>{errors.kvkkAccepted}</Text>
          )}

          <View
            style={{
              backgroundColor: isValid ? 'black' : 'gray',
              marginTop: 30,
              borderRadius: 3,
            }}>
            <Button
              color={isValid ? 'yellow' : 'gray'}
              title="Devam et"
              onPress={() => {
                handleSubmit();
                updateUserImageUrl(
                  values.uniqueID,
                  img_url,
                  () => {},
                  () => {},
                );
              }}
              disabled={!isValid}
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
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
  genderButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#555',
    marginRight: 10,
  },
  selectedGender: {
    backgroundColor: 'green',
  },
  genderButtonText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
});

export default CustomForm;
