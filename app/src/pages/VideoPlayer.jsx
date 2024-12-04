import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import { Video, ResizeMode } from "expo-av";

const { width, height } = Dimensions.get("window");

export default function VideoPlayer({ route, navigation }) {
  const { videoUrl } = route.params;

  return (
    <View style={styles.container}>
      <Video
        style={styles.video}
        source={{ uri: videoUrl }}
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        shouldPlay
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{"<--"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    width: width,
    height: height,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
