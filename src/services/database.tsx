/* eslint-disable @typescript-eslint/no-unused-vars */
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite, {SQLTransaction, SQLError} from 'react-native-sqlite-2';
import {deleteUser} from './async_storage';

export const db = SQLite.openDatabase('test.db', '1.0', '', 1);

export const initializeDatabase = () => {
  // db.transaction(
  //   tx => {
  //     tx.executeSql(`DROP TABLE IF EXISTS Users;`, [], () =>
  //       console.log(`users tablosu başarıyla silindi.`),
  //     );
  //   },
  //   (error: SQLError) => console.error('Transaksiyon hatası:', error),
  // );
  // deleteUser();
  db.transaction(
    tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          birthDate TEXT,
          fullName TEXT,
          gender TEXT,
          kvkkAccepted INTEGER,
          phoneNumber TEXT,
          uniqueID TEXT,
          img_url TEXT,
          work_state TEXT,
          job TEXT,
          education_grade TEXT,
          school_info TEXT,
          skills TEXT ,
          pdf_url TEXT,
          projects TEXT
        );`,
        [],
        () => console.log('Kullanıcı tablosu başarıyla oluşturuldu.'),
      );
    },
    (error: SQLError) => console.error('Transaksiyon hatası:', error),
  );

  //clearUsersTable();
  db.transaction(
    tx => {
      tx.executeSql(`SELECT * FROM Users;`, [], (_, {rows}) => {
        const users = [];
        for (let i = 0; i < rows.length; i++) {
          users.push(rows.item(i));
        }
      });
    },
    (error: SQLError) => console.error('Transaksiyon hatası:', error),
  );
};

export const clearUsersTable = () => {
  db.transaction(
    tx => {
      tx.executeSql(`DELETE FROM Users;`, [], () =>
        console.log('Users tablosunun içeriği başarıyla silindi.'),
      );
    },
    (error: SQLError) => console.error('Transaksiyon hatası:', error),
  );
};

export const addUser = (
  userData: UserData,
  onSuccess: () => void,
  onError: () => void,
) => {
  db.transaction(
    tx => {
      tx.executeSql(
        `SELECT COUNT(*) AS count FROM Users WHERE uniqueID = ?;`,
        [userData.uniqueID],
        (_, {rows}) => {
          const existingUserCount = rows.item(0).count;
          if (existingUserCount === 0) {
            tx.executeSql(
              `INSERT INTO Users (birthDate, fullName, gender, kvkkAccepted, phoneNumber, uniqueID, img_url)
                VALUES (?, ?, ?, ?, ?, ?, ?);`,
              [
                userData.birthDate,
                userData.fullName,
                userData.gender,
                userData.kvkkAccepted ? 1 : 0,
                userData.phoneNumber,
                userData.uniqueID,
                userData.img_url,
              ],
              () => {
                console.log('Kullanıcı başarıyla eklendi.');
                onSuccess(); // Başarı durumunu geri dön
              },
            );
          } else {
            console.log('Bu uniqueID ile zaten bir kullanıcı mevcut.');
            onError(); // Başarısızlık durumunu geri dön
          }
        },
      );
    },
    (error: SQLError) => {
      console.error('Transaksiyon hatası:', error);
      onError(); // Başarısızlık durumunu geri dön
    },
  );
};

export const getUserByUniqueID = (
  uniqueID: string,
  onSuccess: (user: UserData | any) => void,
  onError: () => void,
) => {
  db.transaction(
    tx => {
      tx.executeSql(
        `SELECT * FROM Users WHERE uniqueID = ?;`,
        [uniqueID],
        (_, {rows}) => {
          if (rows.length > 0) {
            const userData = rows.item(0);
            const user: UserData = {
              birthDate: userData.birthDate,
              fullName: userData.fullName,
              gender: userData.gender,
              kvkkAccepted: !!userData.kvkkAccepted,
              phoneNumber: userData.phoneNumber,
              uniqueID: userData.uniqueID,
              img_url: userData.img_url,
              work_state: userData.work_state,
              job: userData.job,
              education_grade: userData.education_grade,
              school_info: userData.school_info,
              skills: userData.skills,
              pdf_url: userData.pdf_url,
              projects: userData.projects,
            };
            onSuccess(user); // Kullanıcıyı başarıyla bulundu, geri dön
          } else {
            onSuccess(null); // Kullanıcı bulunamadı, null geri dön
          }
        },
      );
    },
    (error: SQLError) => {
      console.error('Transaksiyon hatası:', error);
      onError(); // Başarısızlık durumunu geri dön
    },
  );
};
export const updateUserWorkAndJob = (
  uniqueID: string,
  workState: string,
  job: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  db.transaction(
    tx => {
      tx.executeSql(
        `UPDATE Users SET work_state = ?, job = ? WHERE uniqueID = ?;`,
        [workState, job, uniqueID],
        () => {
          console.log('Kullanıcının iş durumu ve işi başarıyla güncellendi.');
          onSuccess(); // Başarı durumunu geri dön
        },
      );
    },
    (error: SQLError) => {
      console.error('Transaksiyon hatası:', error);
      onError(); // Başarısızlık durumunu geri dön
    },
  );
};
export const updateUserEducationInfo = (
  uniqueID: string,
  educationGrade: string,
  schoolInfo: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  db.transaction(
    tx => {
      tx.executeSql(
        `UPDATE Users SET education_grade = ?, school_info = ? WHERE uniqueID = ?;`,
        [educationGrade, JSON.stringify(schoolInfo), uniqueID],
        () => {
          console.log('Kullanıcının eğitim bilgileri başarıyla güncellendi.');
          onSuccess(); // Başarı durumunu geri dön
        },
      );
    },
    (error: SQLError) => {
      console.error('Transaksiyon hatası:', error);
      onError(); // Başarısızlık durumunu geri dön
    },
  );
};
export const updateUserSkills = (
  uniqueID: string,
  skills: any,
  onSuccess: () => void,
  onError: () => void,
) => {
  db.transaction(
    tx => {
      tx.executeSql(
        `UPDATE Users SET skills = ? WHERE uniqueID = ?;`,
        [JSON.stringify(skills), uniqueID],
        () => {
          console.log('Kullanıcının yetenekleri başarıyla güncellendi.');
          onSuccess(); // Başarı durumunu geri dön
        },
      );
    },
    (error: SQLError) => {
      console.error('Transaksiyon hatası:', error);
      onError(); // Başarısızlık durumunu geri dön
    },
  );
};
export const updateUserPdfUrl = (
  uniqueID: string,
  pdfUrl: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  db.transaction(
    tx => {
      tx.executeSql(
        `UPDATE Users SET pdf_url = ? WHERE uniqueID = ?;`,
        [pdfUrl, uniqueID],
        () => {
          console.log("Kullanıcının PDF URL'si başarıyla güncellendi.");
          onSuccess(); // Başarı durumunu geri dön
        },
      );
    },
    (error: SQLError) => {
      console.error('Transaksiyon hatası:', error);
      onError(); // Başarısızlık durumunu geri dön
    },
  );
};
export const updateUserProjects = (
  uniqueID: string,
  projects: any,
  onSuccess: () => void,
  onError: () => void,
) => {
  db.transaction(
    tx => {
      tx.executeSql(
        `UPDATE Users SET projects = ? WHERE uniqueID = ?;`,
        [JSON.stringify(projects), uniqueID], // Projeleri JSON formatında kaydetmek için stringify kullanın
        () => {
          console.log('Kullanıcının projeleri başarıyla güncellendi.');
          onSuccess(); // Başarı durumunu geri dön
        },
      );
    },
    (error: SQLError) => {
      console.error('Transaksiyon hatası:', error);
      onError(); // Başarısızlık durumunu geri dön
    },
  );
};
export const updateUserImageUrl = (
  uniqueID: string,
  imgUrl: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  db.transaction(
    tx => {
      tx.executeSql(
        `UPDATE Users SET img_url = ? WHERE uniqueID = ?;`,
        [imgUrl, uniqueID],
        () => {
          console.log("Kullanıcının resim URL'si başarıyla güncellendi.");
          onSuccess(); // Başarı durumunu geri dön
        },
      );
    },
    (error: SQLError) => {
      console.error('Transaksiyon hatası:', error);
      onError(); // Başarısızlık durumunu geri dön
    },
  );
};

export interface UserData {
  birthDate: string;
  fullName: string;
  gender: string;
  kvkkAccepted: boolean;
  phoneNumber: string;
  uniqueID: string;
  img_url: string;
  work_state: any;
  job: any;
  education_grade: any;
  school_info: any;
  skills: any;
  pdf_url: any;
  projects: any;
}
