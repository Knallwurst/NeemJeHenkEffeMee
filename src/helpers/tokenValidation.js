function isTokenValid(decodedToken) {
    const currentTime = Date.now() / 1000;

    return decodedToken.exp > currentTime;
}

export default isTokenValid;