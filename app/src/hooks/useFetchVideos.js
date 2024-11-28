import { useState, useEffect } from "react";
import { db } from "../../firebase.config"; // Đảm bảo bạn đã cấu hình Firebase Firestore

const useFetchVideo = () => {
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideosAndUsers = async () => {
      try {
        // Fetch danh sách video từ Firestore
        const snapshot = await db.collection("videos").get();
        const videoData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const video = doc.data();
            // Fetch thông tin người dùng từ Firestore
            const userSnapshot = await db.collection("users").doc(video.userId).get();
            const user = userSnapshot.exists ? userSnapshot.data() : null;
            return {
              id: doc.id,
              url: video.url,
              user,
              description: video.description,
              likes: video.likes,
              comments: video.comments,
            };
          })
        );
        setVideoData(videoData); // Cập nhật dữ liệu video
      } catch (error) {
        console.error("Error fetching video or user data:", error);
        setError(error); // Cập nhật lỗi nếu có
      } finally {
        setLoading(false); // Đánh dấu đã hoàn thành fetching
      }
    };

    fetchVideosAndUsers();
  }, []); // Chỉ fetch 1 lần khi component mount

  return { videoData, loading, error };
};

export default useFetchVideo;
