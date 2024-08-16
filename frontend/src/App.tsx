import { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import './App.css';

function App() {
  const [blocks, setBlocks] = useState([]);
  const [block, setBlock] = useState(null);

  useEffect(() => {
    const getBlocks = async () => {
      const response = await fetch('http://localhost:4000/blocks')
      const data = await response.json()
      setBlocks(data)
    }
    getBlocks()
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setBlock(event.target.value as string);
  };

  return (
    <>
      <h1>Blocks testing</h1>
      <FormControl fullWidth>
        <InputLabel id="block-select-label">Block</InputLabel>
        <Select
          labelId="block-select-label"
          id="block-select"
          value={block}
          label="Select block"
          onChange={handleChange}
        >
          {blocks.map(b => (
            <MenuItem value={b.id} key={b.id}>{b.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
