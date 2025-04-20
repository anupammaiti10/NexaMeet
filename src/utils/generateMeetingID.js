export const generateMeetingID = () => {
  let meetingID = "";
  const chars = "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < 10; i++) {
    meetingID += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return meetingID;
}