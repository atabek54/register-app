/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import DocumentPicker from 'react-native-document-picker';

import ImagePicker from 'react-native-image-crop-picker';
import {SelectList} from 'react-native-dropdown-select-list';

import CustomForm from './formik';
import {
  fetchCityByCountry,
  fetchCountryData,
} from '../../services/country_service';
import CheckBox from '@react-native-community/checkbox';
import {getUser} from '../../services/async_storage';
import {
  getUserByUniqueID,
  updateUserEducationInfo,
  updateUserImageUrl,
  updateUserPdfUrl,
  updateUserProjects,
  updateUserSkills,
  updateUserWorkAndJob,
} from '../../services/database';
import {formatDate} from '../../utils/date';
import FormDescView from '../form_desx';
import {SafeAreaView} from 'react-native-safe-area-context';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

const CustomModal: React.FC<ModalProps> = ({visible, onClose}) => {
  const [avatar, setAvatar] = useState<string | any>(null);

  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState();
  const [cities, setCities] = useState<string[]>([]); // Ülkenin şehirlerini tutacak state
  const [userToken, setUserToken] = useState<any>();
  const [selectedWorkState, setSelectedWorkState] = useState<any>();
  const [job, setJob] = useState<any>();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedGradDate, setSelectedGradDate] = useState('');

  const [eduLevel, setEduLevel] = useState<any>();
  const [schoolInfo, setSchoolInfo] = useState<any>({
    name: null,
    branch: null,
    date_of_graduation: null,
  });
  const [skills, setSkills] = useState<any>([]); // Kullanıcının yeteneklerini içerecek liste
  const [skillName, setSkillName] = useState(''); // Yetenek adı
  const [skillLevel, setSkillLevel] = useState(0); //
  const [rating, setRating] = useState(0); // Derecelendirme
  const [selectedPDFFile, setSelectedPDFFile] = useState<any>();
  const [projects, setProjects] = useState<any>([]);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [step, setStep] = useState(1);

  // Derecelendirme işlevi

  const addSkill = (name: any, level: any) => {
    setSkills((prevSkills: any) => [...prevSkills, {name, level}]);
  };
  const addProject = () => {
    if (projectName.trim() === '' || projectDescription.trim() === '') {
      // Proje adı veya açıklaması boş ise eklenmesine izin verme
      return;
    }
    // Yeni projeyi projeler listesine ekleyerek state'i güncelle
    setProjects([
      ...projects,
      {name: projectName, description: projectDescription},
    ]);
    // Inputları sıfırla
    setProjectName('');
    setProjectDescription('');
  };
  const showPicker = () => {
    setOpen(true);
  };

  const work_type_datas = [
    {key: '1', value: 'Öğrenci'},
    {key: '2', value: 'Çalışan'},
    {key: '3', value: 'İşsiz'},
  ];
  const edu_types = [
    {key: '1', value: 'Ilkokul'},
    {key: '2', value: 'Lise'},
    {key: '3', value: 'Üniversite'},
  ];
  useEffect(() => {
    const getToken = async () => {
      const token = await getUser();
      console.log(token);
      if (token != null) {
        setUserToken(token);
        getUserByUniqueID(
          token,
          user => {
            if (user !== null) {
              //    console.log('Kullanıcı bulundu:', user);
              // Kullanıcı bulunduysa userToken'i ayarla

              // if (
              //   user.job != null &&
              //   user.work_state != null &&
              //   user.education_grade == null &&
              //   user.school_info == null
              // ) {
              //   const newStep = step + 2;
              //   setStep(newStep);
              //   console.log(newStep);
              // } else if (
              //   user.education_grade != null &&
              //   user.school_info != null &&
              //   user.skills == null
              // ) {
              //   const newStep = step + 3;
              //   setStep(newStep);
              //   console.log(newStep);
              // } else if (user.skills != null && user.pdf_url == null) {
              //   const newStep = step + 4;
              //   setStep(newStep);
              //   console.log(newStep);
              // } else if (user.pdf_url != null) {
              //   onClose();
              // } else {
              //   const newStep = step + 1;
              //   setStep(newStep);
              // }
              setUserToken(user);
            } else {
              console.log('Kullanıcı bulunamadı.');
            }
          },
          () => {
            console.error('Kullanıcı sorgusu başarısız oldu.');
          },
        );
      }
    };
    getToken();
    if (step == 1) {
      fetchCountryData()
        .then(data => {
          setCountries(data);
        })
        .catch(error => {
          console.error('Error setting country data:', error);
        });
      if (selectedCountry) {
        fetchCityByCountry(selectedCountry)
          .then(cities => {
            setCities(cities);
          })
          .catch(error => {
            console.error('Error setting city data:', error);
          });
      }
    }
  }, [selectedCountry]);
  useEffect(() => {});
  const countryData = countries.map((country, index) => ({
    key: index.toString(),
    value: country,
  }));
  const selectImage = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image): any => {
      console.log(image.path);
      setAvatar(image.path);
    });
  };

  const selectPDFFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf], // Sadece PDF dosyalarını seçmek için
      });
      console.log('Seçilen PDF dosyası:', res);
      setSelectedPDFFile(res);
      const token = await getUser();
      updateUserPdfUrl(
        token ?? '',
        res[0].uri,
        () => {
          console.log("Kullanıcının PDF URL'si başarıyla güncellendi.");
        },
        () => {
          console.log(
            "Kullanıcının PDF URL'si güncellenirken bir hata oluştu.",
          );
        },
      );
      // Seçilen PDF dosyasını işlemek için gerekli adımları burada gerçekleştirin
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // Kullanıcı seçim işlemi iptal etti
        console.log('PDF dosya seçme işlemi iptal edildi.');
      } else {
        // Bir hata oluştu
        console.log('PDF dosya seçme işlemi sırasında bir hata oluştu:', err);
      }
    }
  };
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <SafeAreaView style={styles.modalContainer}>
        {step == 1 && (
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalText}>Kişisel Bilgiler</Text>
              {/* 1. Adım  */}

              <TouchableOpacity onPress={selectImage}>
                {avatar ? (
                  <Image source={{uri: avatar}} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarPlaceholderText}>Resim Seç</Text>
                  </View>
                )}
              </TouchableOpacity>

              <SelectList
                boxStyles={{
                  borderTopWidth: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  width: 300,
                  marginBottom: 5,
                }}
                placeholder="Ülke Seç"
                searchPlaceholder="Ara"
                notFoundText="Ülke Bulunamadı"
                inputStyles={{color: 'white'}}
                dropdownItemStyles={{}}
                dropdownTextStyles={{
                  color: 'white',
                }}
                dropdownStyles={{
                  width: 300,
                  borderTopWidth: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: 'white', // Alt çizgi rengi
                  backgroundColor: '#0a2f35', // Dropdown arkaplan rengi
                }}
                setSelected={(val: any) => {
                  fetchCityByCountry(val);
                  setSelectedCountry(val);
                }}
                onSelect={() => {
                  fetchCityByCountry(selectedCountry);
                }}
                data={countryData}
                save="value"
              />

              {selectedCountry && (
                <SelectList
                  boxStyles={{
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    width: 300,
                    marginBottom: 5,
                  }}
                  placeholder="İl Seç"
                  searchPlaceholder="Ara"
                  notFoundText="İl Bulunamadı"
                  inputStyles={{color: 'white'}}
                  dropdownItemStyles={{}}
                  dropdownTextStyles={{
                    color: 'white',
                  }}
                  dropdownStyles={{
                    width: 300,
                    borderTopWidth: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: 'white', // Alt çizgi rengi
                    backgroundColor: '#0a2f35', // Dropdown arkaplan rengi
                  }}
                  setSelected={(val: any) => console.log(val)}
                  data={cities}
                  save="value"
                />
              )}

              <CustomForm
                step={step}
                img_url={avatar}
                visible={false}
                onSubmit={() => {
                  console.log('Submit Success ');
                  const newStep = step + 1;

                  setStep(newStep);
                }}
              />
            </ScrollView>
          </View>
        )}
        {/* 2. Adım  */}
        {step == 2 && (
          <View style={styles.modalContent}>
            <ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.modalText}>Çalışma Hayatı</Text>
                <Button
                  color={'yellow'}
                  title="Devam"
                  onPress={async () => {
                    const token = await getUser();
                    updateUserWorkAndJob(
                      token ?? '',
                      selectedWorkState,
                      job,
                      () => {
                        console.log(
                          'Kullanıcının iş durumu ve işi başarıyla güncellendi.',
                        );
                        const newStep = step + 1;
                        setStep(newStep);
                      },
                      () => {
                        console.log(
                          'Kullanıcının iş durumu ve işi güncellenirken bir hata oluştu.',
                        );
                      },
                    );
                  }}
                  disabled={!selectedWorkState || !job}
                />
              </View>
              <FormDescView
                text={
                  'Çalışma hayatını merak ediyoruz \nŞu anki çalışma durumunu ve mesleğini bizimle paylaş'
                }
                marginVertical={30}
                fontSize={19}
              />
              <SelectList
                boxStyles={{
                  borderTopWidth: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  width: 300,
                  marginBottom: 5,
                }}
                placeholder="Çalışma durumunu seç"
                searchPlaceholder="Ara"
                notFoundText="Ülke Bulunamadı"
                inputStyles={{color: 'white'}}
                dropdownItemStyles={{}}
                dropdownTextStyles={{
                  color: 'white',
                }}
                dropdownStyles={{
                  width: 300,
                  borderTopWidth: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: 'white', // Alt çizgi rengi
                  backgroundColor: '#0a2f35', // Dropdown arkaplan rengi
                }}
                setSelected={(val: any) => {
                  setSelectedWorkState(val);
                }}
                onSelect={() => {}}
                data={work_type_datas}
                save="value"
              />
              <TextInput
                placeholder="Meslek"
                placeholderTextColor={'gray'}
                onChangeText={val => {
                  setJob(val);
                }}
                style={styles.input}
              />

              <View
                style={{
                  backgroundColor: selectedWorkState && job ? 'black' : 'gray',
                  marginTop: 15,
                  borderRadius: 7,
                }}>
                {/* <Button
                color={'yellow'}
                title="Devam"
                onPress={async () => {
                  const token = await getUser();
                  updateUserWorkAndJob(
                    token ?? '',
                    selectedWorkState,
                    job,
                    () => {
                      console.log(
                        'Kullanıcının iş durumu ve işi başarıyla güncellendi.',
                      );
                      const newStep = step + 1;
                      setStep(newStep);
                    },
                    () => {
                      console.log(
                        'Kullanıcının iş durumu ve işi güncellenirken bir hata oluştu.',
                      );
                    },
                  );
                }}
                disabled={!selectedWorkState || !job}
              /> */}
              </View>
            </ScrollView>
          </View>
        )}
        {/* 3. Adım  */}
        {step == 3 && (
          <View style={styles.modalContent}>
            <ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.modalText}>Eğitim Bilgileri</Text>
                <Button
                  color={'yellow'}
                  title="Devam"
                  onPress={async () => {
                    const token = await getUser();

                    updateUserEducationInfo(
                      token ?? '',
                      eduLevel, // Güncellenecek eğitim bilgisi
                      schoolInfo, // Güncellenecek okul bilgisi
                      () => {
                        console.log(
                          'Kullanıcının eğitim bilgileri başarıyla güncellendi.',
                        );
                        const newStep = step + 1;
                        setStep(newStep);
                        // Başarı durumunda yapılacak işlemler
                      },
                      () => {
                        console.log(
                          'Kullanıcının eğitim bilgileri güncellenirken bir hata oluştu.',
                        );
                        // Hata durumunda yapılacak işlemler
                      },
                    );
                  }}
                  disabled={
                    !eduLevel ||
                    !schoolInfo.name ||
                    !schoolInfo.branch ||
                    !schoolInfo.date_of_graduation
                  }
                />
              </View>
              <FormDescView
                text={
                  'Harika ilerliyorsun! \nEğitim seviyen ve okuduğun okul bilgisi seni tanımamıza yardımcı olacak'
                }
                marginVertical={30}
                fontSize={19}
              />
              <SelectList
                boxStyles={{
                  borderTopWidth: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  width: 300,
                  marginBottom: 5,
                }}
                placeholder="Eğitim seviyeni seç"
                searchPlaceholder="Ara"
                notFoundText=""
                inputStyles={{color: 'white'}}
                dropdownItemStyles={{}}
                dropdownTextStyles={{
                  color: 'white',
                }}
                dropdownStyles={{
                  width: 300,
                  borderTopWidth: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: 'white', // Alt çizgi rengi
                  backgroundColor: '#0a2f35', // Dropdown arkaplan rengi
                }}
                setSelected={(val: any) => {
                  setEduLevel(val);
                }}
                onSelect={() => {}}
                data={edu_types}
                save="value"
              />
              <TextInput
                placeholder="Okul Adı"
                placeholderTextColor={'gray'}
                onChangeText={val => {
                  setSchoolInfo((prevState: any) => ({
                    ...prevState, // Önceki state'in tüm değerlerini kopyalayın
                    name: val, // Sadece name değerini güncelleyin
                  }));
                }}
                style={styles.input}
              />
              <TextInput
                placeholder="Bölüm"
                placeholderTextColor={'gray'}
                onChangeText={val => {
                  setSchoolInfo((prevState: any) => ({
                    ...prevState, // Önceki state'in tüm değerlerini kopyalayın
                    branch: val, // Sadece name değerini güncelleyin
                  }));
                }}
                style={styles.input}
              />
              <TouchableOpacity onPress={showPicker}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    placeholder="Mezuniyet Tarihi"
                    placeholderTextColor={'gray'}
                    value={selectedGradDate}
                    onChangeText={val => {
                      setSchoolInfo((prevState: any) => ({
                        ...prevState, // Önceki state'in tüm değerlerini kopyalayın
                        date_of_graduation: val, // Sadece name değerini güncelleyin
                      }));
                      setSelectedGradDate(val);
                    }}
                    style={styles.input}
                  />
                  <Image
                    source={require('../../assets/icons/d_picker.png')}
                    style={{
                      marginLeft: 5,
                      width: 30,
                      height: 30,
                      tintColor: 'white',
                    }}
                  />
                </View>
              </TouchableOpacity>

              {open && step == 3 && (
                <DatePicker
                  locale="tr"
                  mode="date"
                  modal
                  open={open}
                  date={date}
                  onConfirm={selectedDate => {
                    setOpen(false);
                    setSchoolInfo((prevState: any) => ({
                      ...prevState, // Önceki state'in tüm değerlerini kopyalayın
                      date_of_graduation: formatDate(selectedDate), // Sadece name değerini güncelleyin
                    }));
                    // setSelectedDate(formatDate(selectedDate)); // Format the selected date
                    setSelectedGradDate(formatDate(selectedDate));
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              )}
              <View
                style={{
                  backgroundColor:
                    eduLevel &&
                    schoolInfo.name &&
                    schoolInfo.branch &&
                    schoolInfo.date_of_graduation
                      ? 'black'
                      : 'gray',
                  marginTop: 15,
                  borderRadius: 7,
                }}>
                {/* <Button
                color={'yellow'}
                title="Devam"
                onPress={async () => {
                  const token = await getUser();

                  updateUserEducationInfo(
                    token ?? '',
                    eduLevel, // Güncellenecek eğitim bilgisi
                    schoolInfo, // Güncellenecek okul bilgisi
                    () => {
                      console.log(
                        'Kullanıcının eğitim bilgileri başarıyla güncellendi.',
                      );
                      const newStep = step + 1;
                      setStep(newStep);
                      // Başarı durumunda yapılacak işlemler
                    },
                    () => {
                      console.log(
                        'Kullanıcının eğitim bilgileri güncellenirken bir hata oluştu.',
                      );
                      // Hata durumunda yapılacak işlemler
                    },
                  );
                }}
                disabled={
                  !eduLevel ||
                  !schoolInfo.name ||
                  !schoolInfo.branch ||
                  !schoolInfo.date_of_graduation
                }
              /> */}
              </View>
            </ScrollView>
          </View>
        )}
        {/* 4. Adım  */}
        {step == 4 && (
          <View style={styles.modalContent}>
            <ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.modalText}>Yetkinlikler</Text>

                <Button
                  title="Devam et"
                  color={'yellow'}
                  onPress={async () => {
                    const token = await getUser();
                    updateUserSkills(
                      token ?? '',
                      skills, // Güncellenmiş yetenekler
                      () => {
                        console.log(
                          'Kullanıcının yetenekleri başarıyla güncellendi.',
                        );
                        const newStep = step + 1;
                        setStep(newStep);
                        // Başarı durumunda yapılacak işlemler
                      },
                      () => {
                        console.log(
                          'Kullanıcının yetenekleri güncellenirken bir hata oluştu.',
                        );
                        // Hata durumunda yapılacak işlemler
                      },
                    );
                  }}
                />
              </View>

              <FormDescView
                text={
                  'Herkesin kendi becerileri vardır. \nPeki senin yetkinliklerin neler ? derecelerini girmeyi unutma'
                }
                marginVertical={30}
                fontSize={19}
              />
              {/* Yeni yetenek eklemek için giriş alanları */}
              <TextInput
                style={{...styles.input, marginTop: 40}}
                placeholder="Yetkinlik adını girin"
                placeholderTextColor={'gray'}
                value={skillName}
                onChangeText={text => setSkillName(text)}
              />
              <View style={styles.container}>
                {/* Derecelendirme kutuları */}
                <Text style={{color: 'white', fontSize: 19}}>Seviye:</Text>
                {[1, 2, 3, 4, 5].map((level, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setRating(level)}>
                    <View
                      style={[styles.star, rating >= level && styles.selected]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View
                style={{
                  marginTop: 30,
                  borderRadius: 9,
                }}>
                <Button
                  title="Ekle"
                  color={'orange'}
                  disabled={!skillLevel && !rating}
                  onPress={() => {
                    addSkill(skillName, rating); // Yetenek adı ve seviyesini parametre olarak geçirin
                    const newSkillName = '';
                    setSkillName(newSkillName);
                    setRating(0);
                  }}
                />
              </View>
              <View>
                {/* Yeteneklerin listesi */}
                {skills.map((skill: any, index: any) => (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: 'gray',
                      padding: 10,
                      marginTop: 10,
                    }}
                    key={index}>
                    <Text style={{color: 'white', fontWeight: '600'}}>
                      {skill.name}
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: '300',
                        marginTop: 10,
                      }}>
                      Seviye:{' '}
                      {Array.from({length: 5}, (_, i) => (
                        <Text key={i} style={{color: 'white'}}>
                          {i < skill.level ? '■' : '□'}
                        </Text>
                      ))}
                    </Text>
                  </View>
                ))}

                <View
                  style={{
                    marginTop: 30,
                    backgroundColor: 'black',
                    borderRadius: 9,
                  }}>
                  {/* <Button
                  title="Devam et"
                  color={'yellow'}
                  onPress={async () => {
                    const token = await getUser();
                    updateUserSkills(
                      token ?? '',
                      skills, // Güncellenmiş yetenekler
                      () => {
                        console.log(
                          'Kullanıcının yetenekleri başarıyla güncellendi.',
                        );
                        const newStep = step + 1;
                        setStep(newStep);
                        // Başarı durumunda yapılacak işlemler
                      },
                      () => {
                        console.log(
                          'Kullanıcının yetenekleri güncellenirken bir hata oluştu.',
                        );
                        // Hata durumunda yapılacak işlemler
                      },
                    );
                  }}
                /> */}
                </View>
              </View>
            </ScrollView>
          </View>
        )}
        {step == 5 && (
          <SafeAreaView style={styles.modalContent}>
            <ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.modalText}>Kariyer Geçmişi</Text>

                <Button
                  title="Kaydol"
                  color={'yellow'}
                  onPress={async () => {
                    console.log(projects);
                    try {
                      const token = await getUser();
                      updateUserProjects(
                        token ?? '',
                        projects,
                        () => {
                          console.log('Başarıyla eklendi');
                          Alert.alert(
                            'Aramıza Hoşgeldin',
                            'Artık Giriş yapmaya hazırsın',

                            [
                              {
                                text: 'Giriş Yap',
                                onPress: async () => {
                                  onClose();
                                },
                              },
                            ],
                          );
                        },

                        () => {
                          console.log('Başarısız');
                        },
                      ); // Veritabanı işlemlerini gerçekleştiren fonksiyon çağrısı
                      console.log('Projeler başarıyla güncellendi.'); // Başarı durumunda konsola yazdırma
                    } catch (error) {
                      console.error('Projeleri güncelleme hatası:', error); // Hata durumunda konsola yazdırma
                    }
                  }}
                />
              </View>
              <FormDescView
                text={
                  'Tebrikler! Son bir adım kaldı, \nBize özgeçmişini ve yaptığın projeleri açıklamasıyla birlikte ekle'
                }
                marginVertical={30}
                fontSize={19}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 0,
                  alignItems: 'center',
                }}>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/images/cv.png')}
                  style={{
                    tintColor: 'white',
                    width: 75,
                    height: 75,
                  }}
                />
                <Button onPress={selectPDFFile} title="Öz geçmiş yükle" />
                <Text style={{color: 'gray'}}>
                  {selectedPDFFile
                    ? selectedPDFFile[0].name.toString()
                    : 'Seçili dosya yok'}
                </Text>
              </View>
              <View style={{marginTop: 30}}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    color: 'white',
                  }}>
                  Projeler
                </Text>
                {/* Proje ekleme formu */}
                <View style={{marginBottom: 10}}>
                  <TextInput
                    placeholder="Proje adını gir"
                    placeholderTextColor={'gray'}
                    onChangeText={text => setProjectName(text)}
                    value={projectName}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Proje açıklamasını gir.."
                    placeholderTextColor={'gray'}
                    onChangeText={text => setProjectDescription(text)}
                    value={projectDescription}
                    multiline
                    style={{
                      ...styles.input,
                      borderTopWidth: 1,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      borderEndWidth: 1,
                      height: 75,
                    }}
                  />
                  <Button title="Proje Ekle" onPress={addProject} />
                </View>
                {/* Eklenen projelerin listesi */}
                <View>
                  {projects.map((project: any, index: any) => (
                    <View
                      key={index}
                      style={{
                        marginBottom: 25,
                        borderBottomWidth: 1,
                        borderColor: 'gray',
                      }}>
                      <Text style={{fontWeight: 'bold', color: 'white'}}>
                        {project.name}
                      </Text>
                      <Text
                        style={{marginTop: 7, color: 'gray', marginBottom: 7}}>
                        {project.description}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  star: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
    backgroundColor: 'gray',
    borderRadius: 20,
  },
  selected: {
    backgroundColor: 'yellow',
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
    marginTop: 10,
  },
  transparentInput: {
    backgroundColor: 'transparent', // Input arkaplan rengi transparan
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop: 50,
  },
  modalContent: {
    backgroundColor: '#0a2f35',
    marginTop: Dimensions.get('screen').height / 7,
    marginBottom: 50,
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: Dimensions.get('screen').height,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'gray',
  },
  avatarPlaceholder: {
    backgroundColor: 'black',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatarPlaceholderText: {
    color: '#fff',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default CustomModal;
