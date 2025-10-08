import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import ChartPanel from './components/ChartPanel.jsx';
import TablePanel from './components/TablePanel.jsx';
import { SAMPLE_DATA } from './data/sampleData.js';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 10,
  },
}));

const App = () => {
  const [activeTab, setActiveTab] = useState('chart');

  const [rows, setRows] = useState(
    SAMPLE_DATA.map((row) => ({
      ...row,
      id: crypto.randomUUID(),
      selected: false,
    }))
  );
  
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeToggle = (event) => {
    setTheme(event.target.checked ? 'dark' : 'light');
  };

  return (
    <div className="transition-all duration-500 ease-in-out bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen p-6 flex flex-col">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-center items-center mb-6 relative">
          <h1 className="text-4xl font-bold transition-colors duration-500">
            Dashboard Overview
          </h1>

          {/* Theme Switch */}
          <div className="absolute right-0">
            <MaterialUISwitch
              checked={theme === 'dark'}
              onChange={handleThemeToggle}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 gap-4 transition-all duration-500">
          {['chart', 'table'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div>
          {activeTab === 'chart' && <ChartPanel data={rows} theme={theme} />}
          {activeTab === 'table' && <TablePanel rows={rows} setRows={setRows} theme={theme} />}
        </div>
      </div>
    </div>
  );
};

export default App;
