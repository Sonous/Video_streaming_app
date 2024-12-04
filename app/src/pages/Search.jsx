import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, FlatList, Text, Dimensions, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import useSearchVideos from "../hooks/useSearchVideos";

const { width, height } = Dimensions.get("window");

export default function Search({ navigation }) {
  const [query, setQuery] = useState("");
  const { searchResults, searchVideos, loading, error } = useSearchVideos();

  const handleSearch = () => {
    if (query.trim()) {
      searchVideos(query);
    }
  };

  const groupedResults = [];
  for (let i = 0; i < searchResults.length; i += 2) {
    groupedResults.push(searchResults.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Nhập từ khóa tìm kiếm"
      />
      <Button title="Tìm kiếm" onPress={handleSearch} />

      {loading && <Text style={styles.loading}>Loading...</Text>}
      {error && <Text style={styles.error}>Error: {error.message}</Text>}

      <FlatList
        data={groupedResults}
        keyExtractor={(item, index) => `row-${index}`}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.map((video) => (
              <TouchableOpacity
                style={styles.result}
                key={video.id}
                onPress={() => navigation.navigate("VideoPlayer", { videoUrl: video.url })}
              >
                <Video
                  style={styles.video}
                  source={{ uri: video.url }}
                  resizeMode={ResizeMode.COVER}
                />
                <View style={styles.infoContainer}>
                  <Text style={styles.username}>{video.user?.name || "UserName"}</Text>
                  <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
                    {video.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  loading: {
    textAlign: "center",
    marginVertical: 8,
  },
  error: {
    textAlign: "center",
    color: "red",
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  result: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  video: {
    width: (width - 32) / 2,
    height: height / 3,
  },
  infoContainer: {
    padding: 8,
    backgroundColor: "#111",
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
  },
  description: {
    fontSize: 12,
    color: "#ddd",
    marginTop: 4,
  },
});
