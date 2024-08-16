const rp = require('request-promise');

const getToken = async () => {
  return await rp({
    method: 'POST',
    uri: 'https://bpm-atlas-ap2-poc1.poc.bigpicturemedical.com/api/oauth/token',
    form: {
      client_id: 'bd761e1c-28fa-40ea-a472-2ed25b9f397d',
      client_secret: 'TujqcrJ2ezgNXLHFnKYaiLrVXynLaDtARHnuCTVp',
      grant_type: 'client_credentials'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });
}

export const getBlocksList = async () => {
  const { access_token } = JSON.parse(await getToken());
  const options = {
    method: 'POST',
    uri: 'https://bpm-atlas-ap2-poc1.poc.bigpicturemedical.com/api/execute-workflow/blocks-get-block-configurations',
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  };
  return await rp(options);
};
