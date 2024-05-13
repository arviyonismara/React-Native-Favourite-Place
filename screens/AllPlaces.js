import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import PlacesList from "../components/Places/PlacesList";
import { useIsFocused } from "@react-navigation/native";
import { fetchPlaces } from "../components/util/database";

const AllPlaces = ({ route }) => {
  const [loadedPlace, setLoadedPlace] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadPlaces() {
      const places = await fetchPlaces();
      setLoadedPlace(places);
    }

    // if (isFocused && route.params) {
    if (isFocused) {
      loadPlaces();
      // setLoadedPlace((curPlaces) => [...curPlaces, route.params.place]);
    }
  }, [isFocused, route]);

  return <PlacesList places={loadedPlace} />;
};

export default AllPlaces;

const styles = StyleSheet.create({});
