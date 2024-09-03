import { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
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
  const [captureConfigurationId, setCaptureConfigurationId] = useState(null);
  const [blockConfigurations, setBlockConfigurations] = useState<BlockConfiguration[]>([]);
  const [isBlockReady, setIsBlockReady] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [block, setBlock] = useState(null);
  const [compositionId, setCompositionId] = useState('');
  const [isSuccessNotificationDisplayed, setSuccessNotificationDisplay] = useState(false);
  const patientId = '80d2d72b-4818-4325-9bdf-98011c7c6b20';
  const compositionType = 'event';

  useEffect(() => {
    const getBlockTemplates = async () => {
      const response = await fetch('http://localhost:4000/block-templates');
      const data = (await response.json())?.[0]?.data;
      setBlockTemplates(Array.isArray(data) ? data : []);
    }
    getBlockTemplates();
  }, []);

  const initBlock = (id: string) => {
    resetBlockDiv();
    const selectedBlockConfiguration = blockConfigurations.find((config) => config.external_id === id);
    setBlock((window as any).BlockRendererWidget?.init('#block', {
      apiUrl: 'http://localhost:4000',
      blockConfigurationId: id,
      patientId,
      compositionType,
      blockConfigurationVersion: selectedBlockConfiguration?.version,
      composer: {
        id: `blocks-test-page`,
        id_scheme: 'UUID',
        id_namespace: 'block-builder-test-page',
        name: 'BlockBuilder TestPage',
      },
      onReady: () => {
        setIsBlockReady(true);
      },
      onError: (e: any) => {
        console.log(e);
      }
    }));
  }

  const resetBlockDiv = () => {
    setIsBlockReady(false);
    // Delete and recreate div
    if (captureConfigurationId) {
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
  };

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
    resetBlockDiv();
    await setCaptureConfigurationId(null);
    await setBlockTemplateKey(event.target.value as string);
    await getBlockConfigurations(event.target.value);
  };

  const onBlockConfigurationChange = async (event: SelectChangeEvent) => {
    await setCaptureConfigurationId(event.target.value as string);
    await initBlock(event.target.value);
  };

  const submit = async () => {
    setSaving(true);
    const response = await block?.save();
    setCompositionId(response.id);
    setSuccessNotificationDisplay(true);
    setSaving(false);
    console.log('Composition saved', response);
  };

  return (
    <>
      <h1>Blocks testing</h1>
      <Grid container spacing={2}>
        <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={6}>
          {blockTemplateKey && (<>
            <FormControl fullWidth>
              <InputLabel id="capture-configuration-select-label">Capture</InputLabel>
              <Select
                labelId="capture-configuration-select-label"
                id="capture-configuration-select"
                value={captureConfigurationId}
                label="Select capture configuration"
                onChange={onBlockConfigurationChange}
              >
                {blockConfigurations.map(b => (
                  <MenuItem value={b.external_id} key={b.id}>{b.name}</MenuItem>
                ))}
              </Select>
            </FormControl></>)
          }
        </Grid>
      </Grid>
      <div id="block-parent" style={{marginTop: '16px'}}>
        <div id="block"/>
        {isBlockReady && block && (<Button disabled={saving} variant="contained" style={{marginTop: '16px'}} onClick={submit}>Submit</Button>)}
      </div>
      <Snackbar open={isSuccessNotificationDisplayed} autoHideDuration={6000} onClose={() => setSuccessNotificationDisplay(false)}>
        <Alert
          onClose={() => setSuccessNotificationDisplay(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Composition {compositionId} successfully saved
        </Alert>
      </Snackbar>
    </>
  )
}

export default App;
