<p align="center">
  <a href="https://www.uit.edu.vn/" title="Trường Đại học Công nghệ Thông tin" style="border: none;">
    <img src="https://i.imgur.com/WmMnSRt.png" alt="Trường Đại học Công nghệ Thông tin | University of Information Technology">
  </a>
</p>

<h1 align="center"><b>Công nghệ lập trình đa nền tảng cho ứng dụng di động - IE307.P13.CNCL</b></h1>

## GIỚI THIỆU MÔN HỌC

- **Tên môn học:** Công nghệ lập trình đa nền tảng cho ứng dụng di động
- **Mã môn học:** IE307
- **Mã lớp:** IE307.P13.CNCL
- **Năm học:** HK1 (2024 - 2025)

## GIỚI THIỆU ĐỒ ÁN

- **Đề tài:** # 🎬 Video Streaming App

Ứng dụng chia sẻ video ngắn tương tự TikTok, được xây dựng bằng React Native và Firebase. Cho phép người dùng đăng tải video, tương tác (like, comment), theo dõi người dùng, chat realtime và nhiều tính năng thú vị khác.

[![Demo Video](https://img.shields.io/badge/📺_Demo-Video-red?style=for-the-badge)](https://drive.google.com/drive/folders/1etC1d4VKC_4VNORGNljO3pqJV3EM1HK8?usp=sharing)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Sonous/Video_streaming_app)

---

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cấu trúc Database](#-cấu-trúc-database)
- [Cài đặt](#-cài-đặt)
- [Cấu hình Firebase](#-cấu-hình-firebase)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Screenshots](#-screenshots)
- [Tác giả](#-tác-giả)

---

## ✨ Tính năng

### 🔐 Xác thực & Quản lý người dùng

- ✅ Đăng ký/Đăng nhập bằng Email
- ✅ Đăng nhập bằng GitHub OAuth
- ✅ Quên mật khẩu qua Email
- ✅ Cập nhật thông tin cá nhân (Avatar, Bio, Name)
- ✅ Đổi Email và Password
- ✅ Trạng thái Online/Offline

### 🎥 Video & Tương tác

- ✅ Xem video dạng vertical scroll (TikTok-style)
- ✅ Upload video từ thiết bị
- ✅ Thêm mô tả và thumbnail cho video
- ✅ Like/Unlike video
- ✅ Comment và Reply (phân cấp)
- ✅ Dislike comment
- ✅ Bookmark video để xem lại sau
- ✅ Chia sẻ video

### 👥 Mạng xã hội

- ✅ Follow/Unfollow người dùng
- ✅ Xem danh sách Followers/Following
- ✅ Danh sách bạn bè (Friend List)
- ✅ Gợi ý bạn bè (Suggested Friends)
- ✅ Tìm kiếm người dùng
- ✅ Xem profile và video của người khác

### 💬 Chat Realtime

- ✅ Chat 1-1 realtime
- ✅ Gửi text message
- ✅ Gửi ảnh và video
- ✅ Danh sách phòng chat
- ✅ Hiển thị trạng thái online
- ✅ Tin nhắn chưa đọc

### 📱 Giao diện

- ✅ Responsive UI/UX
- ✅ Dark mode cho video player
- ✅ Bottom navigation
- ✅ Material top tabs
- ✅ Loading animations (Lottie)
- ✅ Gesture handling

---

## 🛠 Công nghệ sử dụng

### Frontend

```json
{
  "framework": "React Native 0.76.5",
  "ui-framework": "Expo ~52.0.20",
  "styling": "NativeWind (TailwindCSS)",
  "navigation": "React Navigation 7.x",
  "state-management": "React Context API",
  "animations": "Lottie, Reanimated"
}
```

### Backend & Database

- **Firebase Authentication**: Xác thực người dùng (Email/Password, GitHub OAuth)
- **Cloud Firestore**: NoSQL database cho Users, Videos, Comments
- **Firebase Storage**: Lưu trữ video, ảnh, avatar
- **Firebase Cloud Messaging**: Thông báo push
- **Firebase Realtime Database**: Chat realtime

### Thư viện chính

| Thư viện                    | Mục đích                   |
| --------------------------- | -------------------------- |
| `@react-navigation/native`  | Điều hướng ứng dụng        |
| `expo-av` & `expo-video`    | Video player               |
| `expo-image-picker`         | Chọn ảnh/video từ thư viện |
| `@gorhom/bottom-sheet`      | Bottom sheet modal         |
| `lottie-react-native`       | Animation                  |
| `firebase`                  | Backend services           |
| `react-native-vector-icons` | Icons                      |

---

## 📁 Cấu trúc dự án

```
Video_streaming_app/
├── app/
│   ├── src/
│   │   ├── apis/              # API calls
│   │   │   ├── authApi.js     # Authentication APIs
│   │   │   ├── dbApi.js       # Firestore APIs
│   │   │   └── storageApi.js  # Storage APIs
│   │   │
│   │   ├── components/        # Reusable components
│   │   │   ├── Video.jsx      # Video player component
│   │   │   ├── Comment.jsx    # Comment component
│   │   │   ├── UserCard.jsx   # User card
│   │   │   └── ...
│   │   │
│   │   ├── pages/             # Screen components
│   │   │   ├── Home/          # Home screen (video feed)
│   │   │   ├── Search/        # Search users
│   │   │   ├── Upload/        # Upload video
│   │   │   ├── Inbox/         # Chat inbox
│   │   │   ├── Profile/       # User profile
│   │   │   ├── ChatRoom/      # Chat screen
│   │   │   ├── Follow/        # Follow management
│   │   │   ├── Account/       # Account settings
│   │   │   └── Setting/       # App settings
│   │   │
│   │   ├── navigates/         # Navigation config
│   │   │   ├── index.jsx      # Main navigator
│   │   │   ├── BottomNav.jsx  # Bottom tab navigator
│   │   │   └── ...
│   │   │
│   │   ├── context/           # React Context
│   │   │   └── UserProvider.jsx
│   │   │
│   │   ├── hooks/             # Custom hooks
│   │   │   ├── useFetchVideos.js
│   │   │   ├── useSearchVideos.js
│   │   │   └── useDebounce.js
│   │   │
│   │   ├── layouts/           # Layout components
│   │   │   ├── MainLayout.jsx
│   │   │   ├── ProfileLayout.jsx
│   │   │   └── ...
│   │   │
│   │   └── utils/             # Utility functions
│   │       └── index.js
│   │
│   ├── assets/                # Static assets
│   │   ├── images/
│   │   └── videos/
│   │
│   ├── firebase.config.js     # Firebase configuration
│   ├── App.js                 # Root component
│   ├── package.json           # Dependencies
│   └── tailwind.config.js     # TailwindCSS config
│
└── README.md
```

---

## 🗄 Cấu trúc Database

### Firestore Collections

#### 1. **Users** Collection

```javascript
{
  userId: string,
  email: string,
  displayName: string,
  bio: string,
  photoURL: string,
  followers: [userId1, userId2, ...],
  following: [userId1, userId2, ...],
  friends: [userId1, userId2, ...],
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. **Videos** Collection

```javascript
{
  videoId: string,
  userId: string,
  videoUrl: string,
  thumbnailUrl: string,
  description: string,
  likes: [userId1, userId2, ...],
  marks: [userId1, userId2, ...],
  commentCount: number,
  viewCount: number,
  createdAt: timestamp
}
```

#### 3. **Comments** Collection

```javascript
{
  commentId: string,
  videoId: string,
  userId: string,
  content: string,
  parentCommentId: string | null,  // null nếu là comment gốc
  dislikes: [userId1, userId2, ...],
  replyCount: number,
  createdAt: timestamp
}
```

#### 4. **Rooms** Collection (Chat)

```javascript
{
  roomId: string,
  members: [userId1, userId2],
  lastMessage: {
    content: string,
    senderId: string,
    timestamp: timestamp
  },
  unreadCount: {
    userId1: number,
    userId2: number
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 5. **Messages** Collection (Realtime Database)

```javascript
{
  messageId: string,
  roomId: string,
  senderId: string,
  content: string,
  type: 'text' | 'image' | 'video',
  mediaUrl: string,
  isRead: boolean,
  timestamp: timestamp
}
```

---

## 🚀 Cài đặt

### Yêu cầu hệ thống

- Node.js >= 18.x
- npm hoặc yarn
- Expo CLI
- Android Studio (cho Android) hoặc Xcode (cho iOS)
- Tài khoản Firebase

### Các bước cài đặt

1. **Clone repository**

```bash
git clone https://github.com/Sonous/Video_streaming_app.git
cd Video_streaming_app/app
```

2. **Cài đặt dependencies**

```bash
npm install
# hoặc
yarn install
```

3. **Cấu hình biến môi trường**

Tạo file `.env` trong thư mục `app/`:

```env
EXPO_PUBLIC_API_KEY=your_firebase_api_key
EXPO_PUBLIC_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_APP_ID=your_firebase_app_id
EXPO_PUBLIC_MEASUREMENT_ID=your_measurement_id
```

---

## 🔥 Cấu hình Firebase

### 1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới
3. Thêm ứng dụng Web vào project

### 2. Kích hoạt các dịch vụ

#### Authentication

- Email/Password
- GitHub (cấu hình OAuth App)

#### Firestore Database

Tạo các collection: `users`, `videos`, `comments`, `rooms`

#### Storage

Tạo các folder:

- `/avatars` - Lưu avatar người dùng
- `/videos` - Lưu video upload
- `/thumbnails` - Lưu thumbnail video
- `/chat-media` - Lưu ảnh/video trong chat

#### Realtime Database

Tạo node `messages` cho chat realtime

---

## ▶ Chạy ứng dụng

### Development mode

```bash
# Khởi động Expo
npm start
# hoặc
expo start --tunnel

# Chạy trên Android
npm run android

# Chạy trên iOS
npm run ios

# Chạy trên Web
npm run web
```

### Build Production

**Android APK:**

```bash
expo build:android2
```

**iOS:**

```bash
expo build:ios
```
