import React, { useState } from 'react';
import { GroupData, MetricType, MouseData } from '../types';
import { COLORS } from '../constants';

interface DataInputProps {
  groups: GroupData[];
  setGroups: React.Dispatch<React.SetStateAction<GroupData[]>>;
}

const DataInput: React.FC<DataInputProps> = ({ groups, setGroups }) => {
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const [inputBuffer, setInputBuffer] = useState<string>('');
  const [targetMetric, setTargetMetric] = useState<MetricType>(MetricType.TOTAL_DISTANCE);

  const activeGroup = groups[activeGroupIndex];

  const handleAddGroup = () => {
    const newGroup: GroupData = {
      id: `g-${Date.now()}`,
      name: `Group ${groups.length + 1}`,
      color: COLORS[groups.length % COLORS.length],
      mice: []
    };
    setGroups([...groups, newGroup]);
    setActiveGroupIndex(groups.length);
  };

  const handleRemoveGroup = (index: number) => {
    const newGroups = groups.filter((_, i) => i !== index);
    setGroups(newGroups);
    if (activeGroupIndex >= newGroups.length) {
      setActiveGroupIndex(Math.max(0, newGroups.length - 1));
    }
  };

  const handleNameChange = (index: number, name: string) => {
    const newGroups = [...groups];
    newGroups[index].name = name;
    setGroups(newGroups);
  };

  // Batch Input Logic
  const handleBatchInput = (mode: 'fill_column' | 'append_rows') => {
    if (!inputBuffer.trim()) return;

    // Split by newlines, commas, or spaces
    const values = inputBuffer.split(/[\n,\s]+/).map(v => parseFloat(v)).filter(v => !isNaN(v));

    if (values.length === 0) return;

    const newGroups = [...groups];
    const currentGroup = newGroups[activeGroupIndex];

    // mode === 'fill_column': Start from index 0 (update existing mice first, then create if needed)
    // mode === 'append_rows': Start from end of list (always create new mice)
    const startIndex = mode === 'append_rows' ? currentGroup.mice.length : 0;

    values.forEach((val, i) => {
      const targetIndex = startIndex + i;
      
      if (currentGroup.mice[targetIndex]) {
        // Update existing mouse (Merge data)
        currentGroup.mice[targetIndex].values[targetMetric] = val;
      } else {
        // Create new mouse
        const newMouse: MouseData = {
          id: `${currentGroup.id}-m${Date.now()}-${i}`,
          values: {
            [MetricType.TOTAL_DISTANCE]: 0,
            [MetricType.CENTER_TIME]: 0,
            [MetricType.CENTER_ENTRIES]: 0,
            [MetricType.VELOCITY]: 0,
            [MetricType.REARING]: 0,
          }
        };
        newMouse.values[targetMetric] = val;
        currentGroup.mice[targetIndex] = newMouse;
      }
    });

    setGroups(newGroups);
    setInputBuffer('');
  };

  const handleClearColumn = () => {
    if (!window.confirm(`确定要清空 ${activeGroup.name} 的 "${targetMetric}" 列数据吗？`)) return;
    const newGroups = [...groups];
    newGroups[activeGroupIndex].mice.forEach(mouse => {
      mouse.values[targetMetric] = 0;
    });
    setGroups(newGroups);
  };

  // Single Row Operations
  const handleValueChange = (mouseIndex: number, metric: MetricType, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return; 

    const newGroups = [...groups];
    newGroups[activeGroupIndex].mice[mouseIndex].values[metric] = numValue;
    setGroups(newGroups);
  };

  const handleDeleteMouse = (mouseIndex: number) => {
    const newGroups = [...groups];
    newGroups[activeGroupIndex].mice.splice(mouseIndex, 1);
    setGroups(newGroups);
  };

  const handleAddSingleMouse = () => {
    const newGroups = [...groups];
    const newMouse: MouseData = {
      id: `${activeGroup.id}-m${Date.now()}`,
      values: {
        [MetricType.TOTAL_DISTANCE]: 0,
        [MetricType.CENTER_TIME]: 0,
        [MetricType.CENTER_ENTRIES]: 0,
        [MetricType.VELOCITY]: 0,
        [MetricType.REARING]: 0,
      }
    };
    newGroups[activeGroupIndex].mice.push(newMouse);
    setGroups(newGroups);
  };

  const clearGroupData = () => {
    if(!window.confirm("确定要清空当前组的所有数据吗？此操作无法撤销。")) return;
    const newGroups = [...groups];
    newGroups[activeGroupIndex].mice = [];
    setGroups(newGroups);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
      <style>{`
        /* Hide spinner for input[type=number] */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
        <h2 className="font-bold text-slate-700 flex items-center gap-2">
          <i className="fas fa-edit text-blue-500"></i> 数据录入与管理
        </h2>
        <button 
          onClick={handleAddGroup}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors shadow-sm"
        >
          <i className="fas fa-plus mr-1"></i> 新增实验组
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Left: Group List */}
        <div className="w-full md:w-1/3 border-r border-slate-100 overflow-y-auto p-2 bg-slate-50/50">
          {groups.map((group, idx) => (
            <div 
              key={group.id}
              onClick={() => setActiveGroupIndex(idx)}
              className={`p-3 mb-2 rounded-lg cursor-pointer border transition-all ${
                activeGroupIndex === idx 
                  ? 'bg-white border-blue-400 shadow-md transform scale-[1.02]' 
                  : 'bg-white border-slate-200 hover:border-blue-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div 
                  className="w-3 h-3 rounded-full mt-1.5" 
                  style={{ backgroundColor: group.color }}
                ></div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemoveGroup(idx); }}
                  className="text-slate-400 hover:text-red-500 text-xs px-2"
                  disabled={groups.length <= 1}
                  title="删除组"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              
              <input 
                type="text" 
                value={group.name}
                onChange={(e) => handleNameChange(idx, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-sm font-medium bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none text-slate-700"
                placeholder="组名 (例如: Control)"
              />
              <div className="text-xs text-slate-500 mt-1 flex justify-between">
                <span>样本量 (n): {group.mice.length}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Data Editor */}
        <div className="w-full md:w-2/3 flex flex-col h-full overflow-hidden">
          {activeGroup ? (
            <>
              {/* 1. Batch Input Area */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 shrink-0">
                <div className="flex justify-between items-end mb-2">
                   <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                     <i className="fas fa-paste text-slate-400"></i> Excel 数据粘贴
                   </div>
                   <div className="text-[10px] text-slate-400">当前目标列: <span className="font-bold text-blue-600">{targetMetric}</span></div>
                </div>
                
                <div className="flex gap-2 mb-2">
                  <select 
                    value={targetMetric}
                    onChange={(e) => setTargetMetric(e.target.value as MetricType)}
                    className="flex-1 p-2 border border-blue-200 bg-blue-50/30 rounded text-sm focus:border-blue-500 outline-none font-medium text-slate-700"
                  >
                    {Object.values(MetricType).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleClearColumn}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 rounded text-xs transition-colors"
                    title="清空当前选中列的所有数据"
                  >
                    <i className="fas fa-eraser"></i> 清列
                  </button>
                </div>
                <textarea 
                  value={inputBuffer}
                  onChange={(e) => setInputBuffer(e.target.value)}
                  className="w-full h-20 p-2 border border-slate-300 rounded text-sm font-mono focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none mb-2"
                  placeholder="在此处粘贴整列数据..."
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBatchInput('fill_column')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm transition-colors shadow-sm font-medium"
                    title="将数据填入第1行、第2行... (适合录入同一批小鼠的新指标)"
                  >
                    <i className="fas fa-pen-to-square mr-1"></i> 填充/更新此列数据 (Fill Column)
                  </button>
                  <button 
                    onClick={() => handleBatchInput('append_rows')}
                    className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 py-2 rounded text-sm transition-colors font-medium"
                    title="在表格末尾新增小鼠 (适合增加样本量)"
                  >
                    <i className="fas fa-plus mr-1"></i> 追加新样本 (Append Rows)
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                  <i className="fas fa-info-circle mr-1"></i>
                  提示：若要给现有小鼠录入新指标(如速度)，请选好指标后点左侧 <b>"填充"</b> 按钮。
                </p>
              </div>

              {/* 2. Editable Table Area */}
              <div className="flex-1 overflow-auto p-4 bg-white">
                <div className="flex justify-between items-center mb-2 sticky left-0">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block shadow-sm" style={{background: activeGroup.color}}></span>
                    {activeGroup.name} 数据表
                    <span className="text-xs font-normal text-slate-400 ml-1">(n={activeGroup.mice.length})</span>
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={handleAddSingleMouse} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors font-medium">
                      <i className="fas fa-plus mr-1"></i> 手动增加一行
                    </button>
                    <button onClick={clearGroupData} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 transition-colors">
                      <i className="fas fa-trash-alt mr-1"></i> 清空
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto border rounded-lg border-slate-200 shadow-sm">
                  <table className="w-full text-xs text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-3 w-12 text-center text-slate-400 font-normal">#</th>
                        {/* Headers are clickable to select column */}
                        <th 
                          onClick={() => setTargetMetric(MetricType.TOTAL_DISTANCE)}
                          className={`p-3 min-w-[80px] text-center cursor-pointer hover:bg-blue-100 transition-colors ${targetMetric === MetricType.TOTAL_DISTANCE ? 'bg-blue-50 text-blue-700 border-b-2 border-b-blue-400' : ''}`}
                        >
                          总距离
                        </th>
                        <th 
                          onClick={() => setTargetMetric(MetricType.CENTER_TIME)}
                          className={`p-3 min-w-[80px] text-center cursor-pointer hover:bg-blue-100 transition-colors ${targetMetric === MetricType.CENTER_TIME ? 'bg-blue-50 text-blue-700 border-b-2 border-b-blue-400' : ''}`}
                        >
                          中央时间
                        </th>
                        <th 
                          onClick={() => setTargetMetric(MetricType.VELOCITY)}
                          className={`p-3 min-w-[80px] text-center cursor-pointer hover:bg-blue-100 transition-colors ${targetMetric === MetricType.VELOCITY ? 'bg-blue-50 text-blue-700 border-b-2 border-b-blue-400' : ''}`}
                        >
                          速度
                        </th>
                        <th className="p-3 w-12 text-center text-slate-400 font-normal">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeGroup.mice.length === 0 ? (
                        <tr><td colSpan={5} className="p-10 text-center text-slate-400">暂无数据。请粘贴 Excel 数据并点击“填充”或“追加”。</td></tr>
                      ) : (
                        activeGroup.mice.map((mouse, i) => (
                          <tr key={mouse.id} className="hover:bg-slate-50 group border-b border-slate-100 last:border-0">
                            <td className="p-2 text-center text-slate-400 font-mono text-[10px] bg-slate-50/30">
                              {i + 1}
                            </td>
                            {/* Editable Cells */}
                            <td className={`p-0 border-r border-slate-100 ${targetMetric === MetricType.TOTAL_DISTANCE ? 'bg-blue-50/20' : ''}`}>
                              <input 
                                type="number" 
                                className="w-full h-full p-2.5 text-center bg-transparent outline-none focus:bg-blue-100/50 focus:text-blue-700 transition-colors font-mono text-slate-700"
                                value={mouse.values[MetricType.TOTAL_DISTANCE]}
                                onChange={(e) => handleValueChange(i, MetricType.TOTAL_DISTANCE, e.target.value)}
                              />
                            </td>
                            <td className={`p-0 border-r border-slate-100 ${targetMetric === MetricType.CENTER_TIME ? 'bg-blue-50/20' : ''}`}>
                              <input 
                                type="number" 
                                className="w-full h-full p-2.5 text-center bg-transparent outline-none focus:bg-blue-100/50 focus:text-blue-700 transition-colors font-mono text-slate-700"
                                value={mouse.values[MetricType.CENTER_TIME]}
                                onChange={(e) => handleValueChange(i, MetricType.CENTER_TIME, e.target.value)}
                              />
                            </td>
                            <td className={`p-0 border-r border-slate-100 ${targetMetric === MetricType.VELOCITY ? 'bg-blue-50/20' : ''}`}>
                              <input 
                                type="number" 
                                className="w-full h-full p-2.5 text-center bg-transparent outline-none focus:bg-blue-100/50 focus:text-blue-700 transition-colors font-mono text-slate-700"
                                value={mouse.values[MetricType.VELOCITY]}
                                onChange={(e) => handleValueChange(i, MetricType.VELOCITY, e.target.value)}
                              />
                            </td>
                            <td className="p-2 text-center">
                              <button 
                                onClick={() => handleDeleteMouse(i)}
                                className="text-slate-300 hover:text-red-500 hover:bg-red-50 w-6 h-6 rounded transition-all opacity-0 group-hover:opacity-100"
                                title="删除此样本"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50/50">
                <div className="text-center">
                    <i className="fas fa-arrow-left text-2xl mb-2 text-slate-300"></i>
                    <p>请先在左侧选择一个实验组</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataInput;