// utils/videoSdkToken.js
export const generateToken = async () => {
  try {
    const response = await fetch("https://api.videosdk.live/v2/token", {
      method: "POST",
      headers: {
        "Authorization": import.meta.env.VITE_VIDEOSDK_SECRET_KEY, // your secret key
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to generate token: ${data.message}`);
    }

    return data.token;
  } catch (error) {
    console.error("Failed to generate token", error);
    return null;
  }
};
