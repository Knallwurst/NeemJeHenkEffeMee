import axios from "axios";

// Check that response is in 2xx range
function isResponseValid(response) {
    return response.status >= 200 && response.status <= 299;
}

// User info object type:
//
// {
//   "starredGarages": [ 1, 5, 10 ],
//   "defaultFilters": [],
// }

// Returns for example: { starredGarages: [1, 3, 5], defaultFilters: [] }
export async function pullUserInfo(username, token) {
    // 1. Pull info string from the cloud
    const response = await axios.get(
        `https://api.datavortex.nl/neemjehenkffmee/users/${username}/info`,
        {
            headers: {
                accept: "*/*",
                Authorization: `Bearer ${token}`,
            }
        }
    );
    if (!isResponseValid(response)) {
        throw Error("Request to pull user info return failed response");
    }

    const userInfo = response.data;

    // If no data or incorrect data was stored, return default/empty user object
    if (!userInfo || !userInfo.starredGarages || !userInfo.defaultFilters) {
        const emptyUserInfo = {
            starredGarages: [],
            defaultFilters: []
        };

        return emptyUserInfo;
    }

    return userInfo;
}

// Will be called with "info" containing for example: { starredGarages: [1, 3, 4], defaultFilters: [] }
export async function pushUserInfo(username, token, userInfo) {
    // 1. Encode info object into a string
    const userInfoStringified = JSON.stringify(userInfo);

    // 2. Push info string to the cloud
    const response = await axios.put(
        `https://api.datavortex.nl/neemjehenkffmee/users/${username}`,
        {
            info: userInfoStringified
        },
        {
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }
    );
    if (!isResponseValid(response)) {
        throw Error("Request to push user info return failed response");
    }
}
