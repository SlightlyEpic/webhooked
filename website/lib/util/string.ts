const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function randomKey(length = 32) {
    let key = '';
    for(let i = 0; i < length; i++) {
        key += charset[Math.floor(Math.random() * charset.length)];
    }
    return key;
}
