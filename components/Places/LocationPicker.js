import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import OutlinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import { Alert } from "react-native";
import { getAddress, getMapPreview } from "../util/location";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

// component ini akan dipanggil di file PlaceForm.js
const LocationPicker = ({ onPickLocation }) => {
  const [pickedLocation, setPickedLocation] = useState();

  // hook useIsFocused mereturn boolean. bernilai true ketika screen(AddPlace) sedang aktif
  // dan ketika halaman dibuka(masuk ke map) isFocused bernilai false
  const isFocused = useIsFocused();

  const navigation = useNavigation();
  // reminder, useRoute() digunakan untuk mengambil parameter dari component screen lain seperti Map.js
  const route = useRoute();

  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  // menampilkan preview
  useEffect(() => {
    // ketika isFocused bernilai true dan route.params ada
    if (isFocused && route.params) {
      const mapPickedLocation = route.params && {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      }; //pickedlat dan pickedlng diambil dari Map.js
      setPickedLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  // eksekusi setiap kali pickedLocation berubah
  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        const address = await getAddress(
          pickedLocation.lat,
          pickedLocation.lng
        );
        // menambahkan data address kedalam pcikedLocation
        onPickLocation({ ...pickedLocation, address: address });
      }
    }
    handleLocation();
  }, [pickedLocation, onPickLocation]);

  // validasi permission untuk menggunakan maps
  async function verifyPermission() {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }
    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this app."
      );
      return false;
    }
    return true;
  }

  async function getLocationHandler() {
    // tunggu sampai permission diterima
    const haspermission = await verifyPermission();

    if (!haspermission) {
      return;
    }

    const location = await getCurrentPositionAsync(); //bisa juga set configurasi(optional)
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
    console.log(location); //jalankan console.log untuk melihat latitude dan longitude dan property lainnya
  }

  function pickOnMapHandler() {
    navigation.navigate("Map");
  }

  let locationPreview = <Text>No location picked yet.</Text>;
  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.image}
        // getMapPreview diambil dari util/location
        source={{ uri: getMapPreview(pickedLocation.lat, pickedLocation.lng) }}
      />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
