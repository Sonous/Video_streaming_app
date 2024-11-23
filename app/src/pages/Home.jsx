import React from "react";
import { View, StyleSheet } from "react-native";
import VideoList from "../components/ListVideo";

export default function Home() {

  return (
    <View style={styles.container}>
      <VideoList />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
