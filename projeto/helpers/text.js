export const urlValida = (url) => {
  if (typeof url !== "string") {
    return false;
  }

  const urlRegex =
    /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)*$/i;

  return urlRegex.test(url);
};
