import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Alert } from "react-native";
import IconButton from "../components/UI/IconButton";

// implementasi expo react native maps
const Map = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState();

  const region = {
    latitude: 37.78,
    longitude: -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event) {
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({ lat: lat, lng: lng });
  }

  // Mengambil titik lokasi yang dipilih
  // bungkus fungsi dengan useCallback untuk menghindari infinite loop, agar fungsi berjalan berdasarkan dependencynya
  const savePickedLocationHandler = useCallback(() => {
    // jika tidak ada lokasi yang dipilih
    if (!selectedLocation) {
      Alert.alert("No location picked!", "You have to pick a location first!");
      return;
    }
    // jika sudah ambil lokasi, kembali ke halaman AddPlace sekaligus kirimkan lokasi yang diambil
    navigation.navigate("AddPlace", {
      pickedLat: selectedLocation.lat,
      pickedLng: selectedLocation.lng,
    });
  }, [navigation, selectedLocation]);

  // Logo save pada headerRight akan muncul ketika membuka halaman pick location
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          name="save"
          size={24}
          color="black"
          onPress={savePickedLocationHandler}
        />
      ),
    });
  }, [navigation, savePickedLocationHandler]);

  return (
    // MapView merupakan component react-native-maps
    <MapView
      style={styles.map}
      initialRegion={region}
      onPress={selectLocationHandler}
    >
      {/* membuat Marker atau penanda titik lokasi */}
      {selectedLocation && (
        <Marker
          title="Picked Location"
          coordinate={{
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
          }}
        />
      )}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
