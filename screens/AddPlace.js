import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PlaceForm from "../components/Places/PlaceForm";
import { insertPlace } from "../components/util/database";

// halaman tambah data
const AddPlace = ({ navigation }) => {
  // mengirim data ke screen AllPlaces.js
  async function createPlaceHandler(place) {
    await insertPlace(place);
    navigation.navigate("AllPlaces"); // tidak perlu kirim data lagi karena ambil data dari database
    // navigation.navigate("AllPlaces", {
    // place: place,
    // });
  }

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
};

export default AddPlace;

const styles = StyleSheet.create({});
