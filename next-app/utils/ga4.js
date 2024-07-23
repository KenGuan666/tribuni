import axios from "axios";

const url = `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID}&api_secret=${process.env.GOOGLE_ANALYTICS_MEASUREMENT_API_KEY}`;

export async function sendGA4Events(username, event_name, event_params) {
    if (!event_params) {
        event_params = [{}];
    }
    const payload = {
        client_id: username,
        events: event_params.map((p) => {
            return {
                name: event_name,
                params: p,
            };
        }),
    };
    return await axios.post(url, payload);
}
