import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';

const COLORS = ['#6366F1', '#06B6D4', '#F97316', '#EF4444', '#10B981'];

const ChartPanel = ({ title = 'Chart overview', data, theme }) => {
  const [chartType, setChartType] = useState('line');
  const [stacked, setStacked] = useState(false);
  const [showPV, setShowPV] = useState(true);
  const [showUV, setShowUV] = useState(true);

  const [start, setStart] = useState(() => sessionStorage.getItem('chartStart') || '');
  const [end, setEnd] = useState(() => sessionStorage.getItem('chartEnd') || '');

  React.useEffect(() => {
    sessionStorage.setItem('chartStart', start);
    sessionStorage.setItem('chartEnd', end);
  }, [start, end]);

  const memoData = useMemo(() => {
    if (!start && !end) return data;
    const startIdx = parseInt(start) || 0;
    const endIdx = parseInt(end) || data.length;
    return data.slice(startIdx, endIdx);
  }, [data, start, end]);

  const uvData = useMemo(
    () => memoData.map((d) => ({ name: d.name, value: d.uv })),
    [memoData]
  );
  const pvData = useMemo(
    () => memoData.map((d) => ({ name: d.name, value: d.pv })),
    [memoData]
  );

  const gridColor = theme === 'dark' ? '#444' : '#e5e7eb';
  const axisColor = theme === 'dark' ? '#ddd' : '#374151';
  const tooltipBg = theme === 'dark' ? '#1f2937' : '#fff';
  const tooltipText = theme === 'dark' ? '#f9fafb' : '#111827';

  const maxUV = useMemo(() => Math.max(...memoData.map(d => d.uv)), [memoData]);
  const minUV = useMemo(() => Math.min(...memoData.map(d => d.uv)), [memoData]);
  const maxPV = useMemo(() => Math.max(...memoData.map(d => d.pv)), [memoData]);
  const minPV = useMemo(() => Math.min(...memoData.map(d => d.pv)), [memoData]);

  return (
    <div className="p-4 rounded-2xl shadow-sm transition-colors duration-300 bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">
            Interactive chart panel.
          </p>
        </div>

        {/* Top controls */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
            {['line', 'bar', 'pie'].map((t) => (
              <button
                key={t}
                onClick={() => setChartType(t)}
                className={`px-3 py-1 text-sm rounded ${
                  chartType === t
                    ? 'bg-white dark:bg-gray-800 shadow'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Additional options */}
          <div className="flex items-center gap-2 ml-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={showUV}
                onChange={(e) => setShowUV(e.target.checked)}
                className="w-4 h-4"
              />
              UV
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={showPV}
                onChange={(e) => setShowPV(e.target.checked)}
                className="w-4 h-4"
              />
              PV
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={stacked}
                onChange={(e) => setStacked(e.target.checked)}
                className="w-4 h-4"
              />
              Stack bars
            </label>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="h-72 w-full">
        {/* Line Chart */}
        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={memoData}
              margin={{ top: 12, right: 16, left: 0, bottom: 6 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: tooltipBg,
                  color: tooltipText,
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              {showUV && (
                <Line
                  type="monotone"
                  dataKey="uv"
                  name="UV"
                  stroke={COLORS[0]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
              {showPV && (
                <Line
                  type="monotone"
                  dataKey="pv"
                  name="PV"
                  stroke={COLORS[1]}
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Bar Chart */}
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={memoData}
              margin={{ top: 12, right: 16, left: 0, bottom: 6 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip
              contentStyle={{
                  backgroundColor: tooltipBg,
                  color: tooltipText,
                  border: 'none',
                  borderRadius: '8px',
                }}
                />
              <Legend />
              {showUV && (
                <Bar
                  dataKey="uv"
                  name="UV"
                  stackId={stacked ? 'a' : undefined}
                  fill={COLORS[0]}
                />
              )}
              {showPV && (
                <Bar
                  dataKey="pv"
                  name="PV"
                  stackId={stacked ? 'a' : undefined}
                  fill={COLORS[1]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Pie Chart */}
        {chartType === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                {showPV && (
                  <Pie data={pvData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                    {pvData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                )}
                {showUV && (
                  <Pie data={uvData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100}>
                    {uvData.map((_, i) => (
                      <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                )}

                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    color: tooltipText,
                    border: 'none',
                    borderRadius: '8px',
                }} />
                {memoData.length <= 10 && <Legend />}
                
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <div>Data points: {memoData.length}</div>

        <div className="flex items-center gap-2 text-xs">
          {/* Range */}
          <label>Start:</label>
          <input
            type="number"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="e.g., 10"
            className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                      focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
          <label>End:</label>
          <input
            type="number"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            placeholder="e.g., 20"
            className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                      focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
        </div>

        <div className="flex items-center gap-2">
          {/* Export CSV */}
          <button
            onClick={() => {
              const rows = memoData
                .map((r) => `${r.name},${r.uv},${r.pv}`)
                .join('\n');
              const csv = `name,uv,pv\n${rows}`;
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'chart-data.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-3 py-1 rounded bg-indigo-600 text-white text-xs
             hover:bg-indigo-700 dark:hover:bg-indigo-500
             hover:text-white dark:hover:text-white
             transition-colors duration-200"
          >
            Export CSV
          </button>

          {/* Quick toggle */}
          <button
            onClick={() =>
              setChartType((prev) => (prev === 'line' ? 'bar' : prev==='bar' ? 'pie' : 'line'))
            }
            className="px-3 py-1 rounded border text-xs dark:text-gray-300 
             hover:bg-gray-200 dark:hover:bg-gray-700 
             hover:text-black dark:hover:text-white transition-colors duration-200"
          >
            Quick toggle
          </button>
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        {showUV && (
          <div className="flex-1 p-4 bg-indigo-100 dark:bg-indigo-800 rounded-2xl shadow-md transition-colors">
            <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-200 mb-1">UV Stats</h4>
            <p className="text-sm text-gray-700 dark:text-gray-100">Min: {minUV}</p>
            <p className="text-sm text-gray-700 dark:text-gray-100">Max: {maxUV}</p>
          </div>
        )}

        {showPV && (
          <div className="flex-1 p-4 bg-green-100 dark:bg-green-800 rounded-2xl shadow-md transition-colors">
            <h4 className="text-sm font-semibold text-green-700 dark:text-green-200 mb-1">PV Stats</h4>
            <p className="text-sm text-gray-700 dark:text-gray-100">Min: {minPV}</p>
            <p className="text-sm text-gray-700 dark:text-gray-100">Max: {maxPV}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartPanel;

