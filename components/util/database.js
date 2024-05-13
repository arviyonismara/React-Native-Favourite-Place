import * as SQLite from "expo-sqlite/legacy";
import * as FileSystem from "expo-file-system";
import { Place } from "../../model/place";

const database = SQLite.openDatabase("places.db");

// inisialisasi file db jika belum punya
export function init() {
  // init akan mereturn promise yang berisi query database
  //   fungsi init akan dipanggil di file App.js karena dipanggil diawal user membuka aplikasi
  const promise = new Promise((resolve, reject) => {
    // struktur database
    database.transaction((tx) => {
      //transaction seperti query, tx sudah otomatis didapatkan
      //cek jika database places ada atau tidak
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS places (
              id INTEGER PRIMARY KEY NOT NULL,
              title TEXT NOT NULL,
              imageUri TEXT NOT NULL,
              address TEXT NOT NULL,
              lat REAL NOT NULL,
              lng REAL NOT NULL
              )`,
        [], // variabel/parameter/value untuk tambah data. kosongkan jika tidak ada data  yang ditambahkan
        () => {
          resolve();
        }, // callback ketika sukses
        (_, error) => {
          reject(error);
        } // callback ketika gagal/error
      );
    });
  });

  return promise;
}

// insert data
// fungsi insertPlace akan dipanggil di file AddPlace.js karena tambah data
export function insertPlace(place) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?,?,?,?,?)`,
        [
          place.title,
          place.imageUri,
          place.address,
          place.location.lat,
          place.location.lng,
        ], // place berasal dari class Place
        (_, result) => {
          //   console.log(result);
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

// mengambil data dari database
// fungsi ini akan dipanggil di file AllPlaces.js
export function fetchPlaces() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM places",
        [],
        (_, result) => {
          //   resolve(result);
          //   console.log(result);
          const places = [];
          for (const dp of result.rows._array) {
            places.push(
              new Place(
                dp.title,
                dp.imageUri,
                {
                  address: dp.address,
                  lat: dp.lat,
                  lng: dp.lng,
                },
                dp.id
              )
            );
          }
          resolve(places);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

// fetch data untuk placeDetails
export function fetchPlaceDetails(id) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM places WHERE id = ?",
        [id],
        (_, result) => {
          const dbPlace = result.rows._array[0];
          const place = new Place(
            dbPlace.title,
            dbPlace.imageUri,
            {
              lat: dbPlace.lat,
              lng: dbPlace.lng,
              address: dbPlace.address,
            },
            dbPlace.id
          );
          //   console.log(result);
          resolve(place);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}
