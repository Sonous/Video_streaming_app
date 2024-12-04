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
        useNativeControls
        onError={(error) => console.log("Video Error:", error)}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>{"<--"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 8,
    padding: 8,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    marginBottom: 16,
  },
});
