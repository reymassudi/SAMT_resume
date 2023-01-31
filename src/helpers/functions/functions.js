export const validateIP = (ip) => {
  let regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
}

export const validateNumber = (ssw) => {
  let regex = /^([0-9]*)$/;
  return regex.test(ssw);
}