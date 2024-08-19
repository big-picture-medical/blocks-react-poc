const rp = require('request-promise');

export const atlasUrl = 'https://bpm-atlas-ap2-poc1.poc.bigpicturemedical.com/api';

export const getToken = async () => {
  return await rp({
    method: 'POST',
    uri: `${atlasUrl}/oauth/token`,
    form: {
      client_id: 'bd761e1c-28fa-40ea-a472-2ed25b9f397d',
      client_secret: 'TujqcrJ2ezgNXLHFnKYaiLrVXynLaDtARHnuCTVp',
      grant_type: 'client_credentials'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });
};
