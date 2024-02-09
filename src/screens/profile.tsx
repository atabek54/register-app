/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import {useUser} from '../context/user_context';

const Profile = () => {
  const {user, setUser} = useUser();
  const [projects, setProjects] = useState<any[]>([]);

  const [skills, setSkills] = useState<any[]>([]);
  const [schoolInfo, setSchoolInfo] = useState<any>({});

  useEffect(() => {
    if (user && user.projects) {
      const parsedProjects = JSON.parse(user.projects);
      setProjects(parsedProjects);
    }
    if (user && user.skills) {
      const parsedSkills = JSON.parse(user.skills);
      setSkills(parsedSkills);
    }

    if (user && user.school_info) {
      const parsedSchoolInfo = JSON.parse(user.school_info);
      setSchoolInfo(parsedSchoolInfo);
    }
  }, [user]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        {user ? (
          <Image source={{uri: user.img_url}} style={styles.profileImage} />
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
        <Text style={styles.fullName}>{user.fullName}</Text>
        <Text style={styles.job}>{user.job}</Text>
        <View
          style={{
            flexDirection: 'row',

            alignItems: 'center',
            marginBottom: 10,
            justifyContent: 'center',
          }}>
          <Image
            style={{width: 15, height: 15, marginRight: 5}}
            source={require('../assets/icons/call.png')}
          />
          <Text style={styles.phoneNumber}>{user.phoneNumber}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',

            alignItems: 'center',
            marginBottom: 10,
            justifyContent: 'center',
          }}>
          <Image
            style={{width: 20, height: 20, marginRight: 5}}
            source={require('../assets/icons/birth.png')}
          />
          <Text style={styles.birthDate}>{user.birthDate}</Text>
        </View>
      </View>
      <View style={styles.additionalInfoContainer}>
        <View>
          <Text style={styles.additionalInfoTitle}>Eğitim Seviyesi</Text>
          <Text style={styles.educationGrade}>{user.education_grade}</Text>
        </View>
        <View style={styles.divider}></View>
        <View>
          <Text style={styles.additionalInfoTitle}>Çalışma Durumu</Text>
          <Text style={styles.workState}> {user.work_state}</Text>
        </View>
        <View style={styles.divider}></View>
        <View>
          <Text style={styles.additionalInfoTitle}>Okul Bilgileri</Text>
          <Text style={styles.additionalInfoText}>
            {schoolInfo.name}, {schoolInfo.branch}, Mezuniyet Tarihi:{' '}
            {schoolInfo.date_of_graduation}
          </Text>
        </View>
        <View style={styles.divider}></View>
        <View>
          <Text style={styles.additionalInfoTitle}>Projeler</Text>

          {projects.map((project, index) => (
            <Text key={index} style={styles.additionalInfoText}>
              {project.name}: {project.description}
            </Text>
          ))}
        </View>
        <View style={styles.divider}></View>
        <View>
          <Text style={styles.additionalInfoTitle}>Beceriler</Text>
          <View>
            {/* Yeteneklerin listesi */}
            {skills.map((skill: any, index: any) => (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: 'gray',
                  padding: 0,
                  marginTop: 0,
                }}
                key={index}>
                <Text style={{color: 'black', fontWeight: '600'}}>
                  {skill.name}
                </Text>
                <Text
                  style={{
                    color: 'gray',
                    fontWeight: '700',
                    marginTop: 10,
                  }}>
                  {Array.from({length: 5}, (_, i) => (
                    <Text key={i} style={{color: 'black'}}>
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
        </View>
      </View>
      <View style={{height: 120}}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  divider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  fullName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  job: {
    fontSize: 16,
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 18,
    marginBottom: 5,
  },
  birthDate: {
    fontSize: 14,
    marginBottom: 5,
  },
  educationGrade: {
    fontSize: 14,
    marginBottom: 5,
  },
  workState: {
    fontSize: 14,
    marginBottom: 5,
  },
  additionalInfoContainer: {
    borderWidth: 0,
    borderColor: '#ccc',
    backgroundColor: 'white',
    elevation: 50,
    padding: 10,
    borderRadius: 10,
  },
  additionalInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  additionalInfoText: {
    fontSize: 14,
    marginBottom: 3,
  },
});

export default Profile;
