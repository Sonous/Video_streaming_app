export function formatViews(views) {
    if (views < 1000) return views.toString();
    if (views < 1_000_000) return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    if (views < 1_000_000_000) return (views / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    return (views / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
}

export function maskPhoneNumber(phone) {
    // Giả định số điện thoại có ít nhất 4 chữ số
    return phone.slice(0, 2) + '*****' + phone.slice(-2);
}

export function maskEmail(email) {
    const [localPart, domain] = email.split('@');
    // Lấy ký tự đầu và ký tự cuối của phần local
    const maskedLocal = localPart[0] + '***' + localPart.slice(-1);
    return maskedLocal + '@' + domain;
}

export function truncateText(text, size = 30) {
    return text.length > size ? text.slice(0, size - 10) + '...' : text;
}

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
};

export function generateRandomString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function createTokenWithCode(code) {
    const url = `https://github.com/login/oauth/access_token?client_id=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}&client_secret=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET}&code=${code}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

export function getRoomId(uid1, uid2) {
    const sortedId = [uid1, uid2].sort();

    return sortedId.join('-');
}

export function formatTimestamp(timestamp) {
    // Chuyển đổi Timestamp sang Date
    const date = timestamp.toDate();

    // Lấy ngày hiện tại
    const today = new Date();

    // Kiểm tra nếu ngày trùng với ngày hôm nay
    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    // Định dạng giờ và phút
    const timeString = `${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

    if (isToday) {
        return `${timeString} Today`;
    } else {
        // Định dạng ngày, tháng, năm nếu không phải ngày hôm nay
        const dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${date.getFullYear()}`;
        return `${timeString} ${dateString}`;
    }
}
