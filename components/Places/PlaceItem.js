import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

// PlaceItem kompoen dari PlacesList
// PlaceItem ini akan dipanggil di file PlacesList.js
const PlaceItem = ({ place, onSelect }) => {
  //place didapatkan dari placeslist
  return (
    <Pressable onPress={onSelect}>
      <Image source={{ uri: place.imageUri }} />
      <View>
        <Text>{place.title}</Text>
        <Text>{place.address}</Text>
      </View>
    </Pressable>
  );
};

export default PlaceItem;

const styles = StyleSheet.create({});
