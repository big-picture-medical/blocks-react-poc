import { BlockConfigurationType } from '../models/block-configuration.model';

const rp = require('request-promise');

interface SubmitCompositionRequestBody {
  ehrId: string;
  composition: any;
  blockConfigurationId: string;
  templateId: string;
}

export const atlasUrl = 'https://bpm-atlas-ap2-poc1.poc.bigpicturemedical.com/api';
export const executeWorkflow = async (workflowName: string, options: any = {}) => {
  const { access_token } = JSON.parse(await getToken());
  return await rp({
    method: 'POST',
    uri: `${atlasUrl}/execute-workflow/${workflowName}`,
    headers: {
      ...(options?.headers ?? {}),
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    },
    ...options
  });
}

export const getToken = async () => {
  return await rp({
    method: 'POST',
    uri: `${atlasUrl}/oauth/token`,
    form: {
      client_id: 'bd761e1c-28fa-40ea-a472-2ed25b9f397d',
      client_secret: 'TujqcrJ2ezgNXLHFnKYaiLrVXynLaDtARHnuCTVp',
      grant_type: 'client_credentials'
    }
  });
};


export const getBlockConfigurationsList = async (type?: BlockConfigurationType, templateKey?: string) => {
  return await executeWorkflow('blocks-get-block-configurations', {
    body: JSON.stringify({
      type,
      templateKey
    })
  });
};

export const getBlockTemplates = async () => {
  return await executeWorkflow('blocks-get-blocks-template-list');
};

export const createEhr = async (subjectId: string) => {
  return await executeWorkflow('blocks-create-ehr', {
    body: JSON.stringify({ subjectId })
  });
};

export const fetchBlockConfiguration = async (id: string, version: string) => {
  return await executeWorkflow('blocks-get-block-configuration', {
    body: JSON.stringify({ id, version })
  });
};

export const fetchTerminology = async (query = {}) => {
  return await executeWorkflow('blocks-external-terminology-search', {
    body: JSON.stringify(query)
  });
};

export const fetchComposition = async (compositionId: string) => {
  return await executeWorkflow('blocks-get-ehr-composition', {
    body: JSON.stringify({ compositionId })
  });
};

export const submitComposition = async ({ ehrId, composition, blockConfigurationId, templateId }: SubmitCompositionRequestBody) => {
  return await executeWorkflow('blocks-submit-composition', {
    body: JSON.stringify({ehrId, composition, blockConfigurationId, templateId})
  });
};

// TODO
export const validateComposition = async () => {
  return await executeWorkflow('blocks-validate-composition', {});
};
