import React, { useRef, useState, useEffect } from "react";
import { FlatList, View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity, TextInput, Modal, Button } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { db } from "../../firebase.config"; 

const { height } = Dimensions.get("window");

export default function VideoList({ videoData }) {
  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState(new Array(videoData.length).fill(false)); 
  const [updatedVideoData, setUpdatedVideoData] = useState(videoData); 
  const [comments, setComments] = useState(new Array(videoData.length).fill([])); 
  const [commentText, setCommentText] = useState(""); 
  const [showModal, setShowModal] = useState(false); 
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null); 

  useEffect(() => {
    setUpdatedVideoData(videoData);
  }, [videoData]);

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

  const onViewableItemsChanged = ({ viewableItems }) => {
    videoRefs.current.forEach((video, index) => {
      if (index !== viewableItems[0]?.index && video) {
        video.pauseAsync();
      }
    });

    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      videoRefs.current[viewableItems[0].index]?.playAsync();
    }
  };

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 80 };
  const viewabilityConfigCallback = useRef(onViewableItemsChanged);

  const toggleLike = async (index) => {
    const updatedLikes = [...likes];
    const currentLikeStatus = updatedLikes[index];
    updatedLikes[index] = !currentLikeStatus; 

    const videoId = updatedVideoData[index].id; 
    const videoRef = db.collection("videos").doc(videoId);
    const currentLikesCount = updatedVideoData[index].likesCount || 0;
    
    try {
      await videoRef.update({
        likesCount: currentLikeStatus ? currentLikesCount - 1 : currentLikesCount + 1, 
      });

      const updatedVideoDataCopy = [...updatedVideoData];
      updatedVideoDataCopy[index].likesCount = currentLikeStatus ? currentLikesCount - 1 : currentLikesCount + 1;
      setUpdatedVideoData(updatedVideoDataCopy);
    } catch (error) {
      console.error("Error updating likes in Firestore:", error);
    }

    setLikes(updatedLikes);
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim() === "") return;

    const newComment = {
      text: commentText,
      userName: `User ${selectedVideoIndex + 1}`, 
      timestamp: new Date(),
    };

    const videoId = updatedVideoData[selectedVideoIndex].id;
    const videoRef = db.collection("videos").doc(videoId);

    try {
      await videoRef.update({
        comments: [...updatedVideoData[selectedVideoIndex].comments, newComment],
      });

      const updatedComments = [...comments];
      updatedComments[selectedVideoIndex] = [...updatedComments[selectedVideoIndex], newComment];
      setComments(updatedComments);

      await videoRef.update({
        commentsCount: updatedComments[selectedVideoIndex].length,
      });

      setShowModal(false);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment to Firestore:", error);
    }
  };

  if (!updatedVideoData || updatedVideoData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No videos available</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={updatedVideoData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableWithoutFeedback onPress={() => handlePress(index)}>
            <View style={styles.videoContainer}>
              {/* Video */}
              <Video
                ref={(ref) => (videoRefs.current[index] = ref)}
                style={styles.video}
                source={{ uri: item.url }}
                resizeMode={ResizeMode.COVER}
                isLooping
              />
              {/* Thông tin video */}
              <View style={styles.infoContainer}>
                <Text style={styles.username}>{item.user?.name || "Unknown User"}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>

              {/* Các nút like, comment */}
              <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => toggleLike(index)} style={styles.actionButton}>
                  <Text style={[styles.actionText, likes[index] && { color: "red" }]}>❤️</Text>
                  <Text style={styles.actionCount}>{item.likesCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedVideoIndex(index);
                    setShowModal(true);
                  }}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionText}>💬</Text>
                  <Text style={styles.actionCount}>{item.commentsCount || 0}</Text>
                </TouchableOpacity>
              </View>

              {/* Hiển thị các comment dưới video */}
              <View style={styles.commentsContainer}>
                {comments[index]?.map((comment, commentIndex) => (
                  <View key={commentIndex} style={styles.comment}>
                    <Text style={styles.commentUser}>{comment.userName}:</Text>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
        pagingEnabled
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={height}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={viewabilityConfigCallback.current}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Modal nhập comment */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Add a comment..."
              style={styles.commentInput}
            />
            <Button title="Post Comment" onPress={handleCommentSubmit} />
            <Button title="Cancel" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  actionContainer: {
    position: "absolute",
    right: 20,
    bottom: 300,
    flexDirection: "column",
    justifyContent: "center",
  },
  actionButton: {
    flexDirection: "column",
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
  commentsContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 10,
    maxHeight: 150,
    overflowY: "scroll",
  },
  comment: {
    marginBottom: 10,
  },
  commentUser: {
    fontWeight: "bold",
    color: "#fff",
  },
  commentText: {
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});

