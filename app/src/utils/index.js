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

export function truncateText(text) {
    return text.length > 30 ? text.slice(0, 20) + '...' : text;
}

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
};
