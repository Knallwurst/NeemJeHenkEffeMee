import axios from "axios";

// User info object type:
//
// {
//   "starredGarages": [ 1, 5, 10 ],
//   "defaultFilters": []
// }

// Returns for example: { starredGarages: [1, 3, 5], defaultFilters: [] }
export async function pullUserInfo(username, token) {
    // 1. Pull info string from the cloud
    const response = await axios.get(`https://api.datavortex.nl/neemjehenkffmee/users/${username}/info`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });
    if (response.status !== 200) {
        throw Error("Request to pull user info failed");
    }

    const infoStringified = response.data;

    // If no data was ever stored, infoStringified will be empty. So return empty user info object
    if (infoStringified.length === 0) {
        return {
            starredGarages: [],
            defaultFilters: []
        };
    }

    // 2. Decode info string into an object
    const info = JSON.parse(infoStringified);

    return info;
}

// Will be called with for example: { starredGarages: [1, 3, 4], defaultFilters: [] }
export async function pushUserInfo(username, token, info) {
    // 1. Encode info object into a string
    const infoStringified = JSON.stringify(info);

    // 2. Push info string to the cloud
    const response = await axios.put(`https://api.datavortex.nl/neemjehenkffmee/users/${username}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        data: infoStringified
    });
    if (response.status !== 200) {
        throw Error("Request to push user info failed");
    }
}