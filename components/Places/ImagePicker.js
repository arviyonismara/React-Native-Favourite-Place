// Expo Image Picker
import { StyleSheet, Text, View, Button, Alert, Image } from "react-native";
import React, { useState } from "react";

// meluncurkan camera hp dan menunggu kita untuk mengambil gambar
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";

// compoenent akan dipanggil di file PlaceForm.js
const ImagePicker = ({ onTakeImage }) => {
  // preview gambar
  const [pickedImage, setPickedImage] = useState();
  // menkontrol izin/permission camera
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  async function verifyPermissions() {
    // validasi untuk menunggu permission
    // untuk android opsional karena android sudah otomatis akan meminta permission
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }
    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app."
      );
      return false;
    }
    return true;
  }

  async function takeImageHandler() {
    // tunggu sampai permission diterima
    const haspermission = await verifyPermissions();
    // kembalikan jika tidak diterima
    if (!haspermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true, //mengizinkan pengguna untuk mengedit foto sebelum confirm
      aspect: [16, 9], //menentukan ukuran gambar yang diambil
      quality: 0.5, //menentukan kualitas gambar upscale/downscale
    });
    // console.log(image.assets[0].uri);
    setPickedImage(image.assets[0].uri);
    onTakeImage(image.assets[0].uri);
  }

  //   preview gambar
  let imagePreview = <Text>No image taken yet.</Text>;
  if (pickedImage) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      {/* <Button title="Take Image" onPress={takeImageHandler} /> */}
      <OutlinedButton icon="camera" onPress={takeImageHandler}>
        Take image
      </OutlinedButton>
    </View>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
