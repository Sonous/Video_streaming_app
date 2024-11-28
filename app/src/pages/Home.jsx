import React from "react";
import { View, StyleSheet, Text } from "react-native";
import VideoList from "../components/VideoList";  // Import component VideoList
import useFetchVideo from "../hooks/useFetchVideos";
export default function Home() {
  const { videoData, loading, error } = useFetchVideo(); // Gọi hook useFetchVideo để lấy dữ liệu

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading videos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoList videoData={videoData} /> {/* Truyền dữ liệu videoData vào VideoList */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
