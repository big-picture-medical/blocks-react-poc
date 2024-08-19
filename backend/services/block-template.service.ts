import { atlasUrl, getToken } from './atlas.service';

const rp = require('request-promise');

export const getBlockTemplates = async () => {
  const { access_token } = JSON.parse(await getToken());
  const options = {
    method: 'POST',
    uri: `${atlasUrl}/execute-workflow/blocks-get-blocks-template-list`,
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  };
  return await rp(options);
};
