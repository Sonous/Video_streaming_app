import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { storage, db } from "../../firebase.config";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Home() {
  const [videoData, setVideoData] = useState([]);
  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    const fetchVideosAndUsers = async () => {
      try {
        const listRef = storage.ref("videos");
        const result = await listRef.listAll();
        const urlPromises = result.items.map((itemRef) => itemRef.getDownloadURL());
        const videoUrls = await Promise.all(urlPromises);

        const videoDataPromises = videoUrls.map(async (url, index) => {
          const userSnapshot = await db.collection("users").doc(`user${index + 1}`).get();
          const user = userSnapshot.exists ? userSnapshot.data() : null;
          return {
            id: `video${index + 1}`,
            url,
            user,
            description: `Video #${index + 1}`,
            likes: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 50),
            shares: Math.floor(Math.random() * 20),
          };
        });

        const finalData = await Promise.all(videoDataPromises);
        setVideoData(finalData);
      } catch (error) {
        console.error("Error fetching video or user data:", error);
      }
    };

    fetchVideosAndUsers();
  }, []);

  const onViewableItemsChanged = ({ viewableItems }) => {
    videoRefs.current.forEach((video) => video?.pauseAsync());

    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      videoRefs.current[index]?.playAsync();
      setCurrentIndex(index);
    }
  };

  const viewConfigRef = { viewAreaCoveragePercentThreshold: 80 };
  const onViewRef = useRef(onViewableItemsChanged);

  const handlePress = async (index) => {
    const video = videoRefs.current[index];
    if (video) {
      const status = await video.getStatusAsync();
      if (status.isPlaying) {
        video.pauseAsync();
      } else {
        video.playAsync();
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (currentIndex !== null) {
        videoRefs.current[currentIndex]?.playAsync();
      }

      return () => {
        videoRefs.current.forEach((video) => video?.pauseAsync());
      };
    }, [currentIndex])
  );

  return (
    <FlatList
      data={videoData}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <TouchableWithoutFeedback onPress={() => handlePress(index)}>
          <View style={styles.videoContainer}>
            {/* Video */}
            <Video
              ref={(ref) => (videoRefs.current[index] = ref)}
              style={styles.video}
              source={{ uri: item.url }}
              useNativeControls={false}
              resizeMode={ResizeMode.COVER}
              isLooping
            />
            {/* User Info */}
            <View style={styles.infoContainer}>
              <View style={styles.userContainer}>
                <Image
                  source={{
                    uri: item.user?.profilePicture || "https://example.com/default-avatar.png",
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.username}>{item.user?.username || "Unknown User"}</Text>
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              <View style={styles.actionButton}>
                <Text style={styles.actionText}>❤️</Text>
                <Text style={styles.actionCount}>{item.likes || 0}</Text>
              </View>
              <View style={styles.actionButton}>
                <Text style={styles.actionText}>💬</Text>
                <Text style={styles.actionCount}>{item.comments || 0}</Text>
              </View>
              <View style={styles.actionButton}>
                <Text style={styles.actionText}>🔗</Text>
                <Text style={styles.actionCount}>{item.shares || 0}</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      pagingEnabled
      decelerationRate="fast"
      snapToInterval={height}
      viewabilityConfig={viewConfigRef}
      onViewableItemsChanged={onViewRef.current}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    position: "absolute",
    bottom: 80,
    left: 20,
    width: "70%",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 10,
  },
  actionContainer: {
    position: "absolute",
    right: 20,
    bottom: height / 3, 
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  actionText: {
    fontSize: 24,
    color: "#fff",
  },
  actionCount: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
});
