import { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import './App.css';

interface BlockConfiguration {
  id: string;
  external_id: string;
  name: string;
  version: string;
  published_at: string;
  captured_by: string;
  template_key: string;
  type: 'capture' | 'display';
  default_pair_configuration_id: string;
}

interface BlockTemplate {
  id: string;
  user_id: string;
  name: string;
  version: string;
  path: string;
  external_id: string;
  type: string;
  meta: {
    captured_by: 'patient' | 'clinician';
    template_key: string;
  };
  published_for: 'production' | 'testing';
  published_at: string;
  created_at: string;
  updated_at: string;
}

function App() {
  const [blockTemplates, setBlockTemplates] = useState<BlockTemplate[]>([]);
  const [blockTemplateKey, setBlockTemplateKey] = useState(null);
  const [blockConfigurationId, setBlockConfigurationId] = useState(null);
  const [blockConfigurations, setBlockConfigurations] = useState<BlockConfiguration[]>([]);
  const patientId = '80d2d72b-4818-4325-9bdf-98011c7c6b20';

  useEffect(() => {
    const getBlockTemplates = async () => {
      const response = await fetch('http://localhost:4000/block-templates');
      const data = (await response.json())?.[0]?.data;
      setBlockTemplates(Array.isArray(data) ? data : []);
    }
    getBlockTemplates();
  }, []);

  const initBlock = (id: string) => {
    // Delete and recreate div
    if (blockConfigurationId) {
      const element = document.body.querySelector('#block');
      const parent = document.getElementById('block-parent');
      if (element && parent) {
        element.remove();
        const div = document.createElement("div");
        div.id = 'block';
        parent.appendChild(div);
        element.innerHTML = '';
      }
    }
    const selectedBlockConfiguration = blockConfigurations.find((config) => config.external_id === id);
    const block = (window as any).BlockRendererWidget?.init('#block', {
      apiUrl: 'http://localhost:4000',
      blockConfigurationId: id,
      patientId,
      blockConfigurationVersion: selectedBlockConfiguration?.version,
      blockTemplateId: blockTemplateKey,
      composer: {
        id: `blocks-test-page`,
        id_scheme: 'UUID',
        id_namespace: 'block-builder-test-page',
        name: 'BlockBuilder TestPage',
      },
      onReady: () => console.log('mounted'),
      onError: (e: any) => {
        console.log(e);
      }
    });
  }

  const getBlockConfigurations = async (templateKey: string) => {
    const response = await fetch('http://localhost:4000/block-configurations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'capture',
        templateKey
      })
    });
    const data = await response.json();
    setBlockConfigurations(Array.isArray(data) ? data : []);
  }

  const onBlockTemplateChange = async (event: SelectChangeEvent) => {
    await setBlockTemplateKey(event.target.value as string);
    await getBlockConfigurations(event.target.value);
  };

  const onBlockConfigurationChange = async (event: SelectChangeEvent) => {
    await setBlockConfigurationId(event.target.value as string);
    await initBlock(event.target.value);
  };

  return (
    <>
      <h1>Blocks testing</h1>
      <FormControl fullWidth>
        <InputLabel id="block-template-select-label">Template</InputLabel>
        <Select
          labelId="block-template-select-label"
          id="blocktemplate--select"
          value={blockTemplateKey}
          label="Select block template"
          onChange={onBlockTemplateChange}
        >
          {blockTemplates.map(b => (
            <MenuItem value={b.meta?.template_key} key={b.id}>{b.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {blockTemplateKey && (<>
        <FormControl fullWidth style={{ marginTop: '16px' }}>
          <InputLabel id="block-configuration-select-label">Configuration</InputLabel>
          <Select
            labelId="block-configuration-select-label"
            id="block-configuration-select"
            value={blockConfigurationId}
            label="Select block configuration"
            onChange={onBlockConfigurationChange}
          >
            {blockConfigurations.map(b => (
              <MenuItem value={b.external_id} key={b.id}>{b.name}</MenuItem>
            ))}
          </Select>
        </FormControl></>)
      }
      {blockConfigurationId && (<>
        <div id="block-parent">
          <div id="block"/>
        </div>
      </>)
      }
    </>
  )
}

export default App;
