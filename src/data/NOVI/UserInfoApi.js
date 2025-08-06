import axios from "axios";

function isResponseValid(response) {
    return response.status >= 200 && response.status <= 299;
}

export async function pullUserInfo(username, token) {
    // Pull info string van cloud
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

    // Als er geen data is of onjuist is, geef standaard/lege user object
    if (!userInfo || !userInfo.starredGarages || !userInfo.defaultFilters) {
        const emptyUserInfo = {
            starredGarages: [],
            defaultFilters: []
        };

        return emptyUserInfo;
    }

    return userInfo;
}

export async function pushUserInfo(username, token, userInfo) {
    // Encode info object naar een string
    const userInfoStringified = JSON.stringify(userInfo);

    // Push info string naar de cloud
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
