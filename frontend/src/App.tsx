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

  useEffect(() => {
    const getBlockTemplates = async () => {
      const response = await fetch('http://localhost:4000/block-templates');
      const data = (await response.json())?.[0]?.data;
      console.log(data);
      setBlockTemplates(Array.isArray(data) ? data : []);
    }
    getBlockTemplates();
  }, []);

  const getBlockConfigurations = async () => {
    console.log({
      type: 'capture',
      templateKey: blockTemplateKey
    });
    const response = await fetch('http://localhost:4000/block-configurations', {
      method: 'POST',
      body: JSON.stringify({
        type: 'capture',
        templateKey: blockTemplateKey
      })
    });
    const data = await response.json();
    setBlockConfigurations(Array.isArray(data) ? data : []);
  }

  const onBlockTemplateChange = async (event: SelectChangeEvent) => {
    await setBlockTemplateKey(event.target.value as string);
    await getBlockConfigurations();
  };

  const onBlockConfigurationChange = async (event: SelectChangeEvent) => {
    setBlockConfigurationId(event.target.value as string);
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
              <MenuItem value={b.id} key={b.id}>{b.name}</MenuItem>
            ))}
          </Select>
        </FormControl></>)
      }
      {blockConfigurationId && (<>
        BLOCK GOES HERE
      </>)
      }
    </>
  )
}

export default App
