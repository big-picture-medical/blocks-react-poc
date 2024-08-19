import { atlasUrl, getToken } from './atlas.service';
import {BlockConfigurationType} from "../models/block-configuration.model";

const rp = require('request-promise');

export const getBlockConfigurationsList = async (type?: BlockConfigurationType, templateKey?: string) => {
  const { access_token } = JSON.parse(await getToken());
  const options = {
    method: 'POST',
    uri: `${atlasUrl}/execute-workflow/blocks-get-block-configurations`,
    headers: {
      Authorization: `Bearer ${access_token}`
    },
    body: JSON.stringify({
      type,
      templateKey
    })
  };
  return await rp(options);
};
