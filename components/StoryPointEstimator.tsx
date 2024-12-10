'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, AlertTriangle } from 'lucide-react';

// Type definitions
interface Task {
  id: number;
  name: string;
  estimates: Record<number, number>;
}

interface TeamMember {
  id: number;
  name: string;
}

interface AnimalPoint {
  points: number;
  animal: string;
  emoji: string;
  description: string;
  timeEstimate: string;
}

export function StoryPointEstimator() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const animalPoints: AnimalPoint[] = [
    { 
      points: 1, 
      animal: 'Ant',
      emoji: '🐜',
      description: 'Tiny task, very straightforward',
      timeEstimate: '< 4 hours for one developer'
    },
    { 
      points: 2, 
      animal: 'Mouse',
      emoji: '🐭', 
      description: 'Small task, clear implementation',
      timeEstimate: '1 developer day'
    },
    { 
      points: 3, 
      animal: 'Cat',
      emoji: '🐱',
      description: 'Small task with some complexity',
      timeEstimate: '1-2 developer days'
    },
    { 
      points: 5, 
      animal: 'Dog',
      emoji: '🐕',
      description: 'Medium task, well understood',
      timeEstimate: '3-5 developer days'
    },
    { 
      points: 8, 
      animal: 'Sheep',
      emoji: '🐑',
      description: 'Medium task with some unknowns',
      timeEstimate: '5-10 developer days'
    },
    { 
      points: 13, 
      animal: 'Horse',
      emoji: '🐎',
      description: 'Large task, significant complexity',
      timeEstimate: '2-3 developer weeks'
    },
    { 
      points: 20, 
      animal: 'Elephant',
      emoji: '🐘',
      description: 'Very large task, should consider breaking down',
      timeEstimate: '3-4 developer weeks'
    },
    { 
      points: 40, 
      animal: 'Blue whale',
      emoji: '🐋',
      description: 'Epic-sized task, needs breakdown',
      timeEstimate: '1-2 developer months'
    },
    { 
      points: 100, 
      animal: 'Dinosaur',
      emoji: '🦖',
      description: 'Massive undertaking, must be broken down',
      timeEstimate: '3+ developer months'
    }
  ];

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('storyPointTasks');
    const savedMembers = localStorage.getItem('storyPointMembers');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedMembers) setTeamMembers(JSON.parse(savedMembers));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('storyPointTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('storyPointMembers', JSON.stringify(teamMembers));
  }, [teamMembers]);

  const addTask = (): void => {
    if (newTaskName.trim()) {
      const newTask = {
        id: Date.now(),
        name: newTaskName,
        estimates: {} as Record<number, number>
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      setNewTaskName('');
    }
  };

  const deleteTask = (taskId: number): void => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const addTeamMember = (): void => {
    if (newMemberName.trim()) {
      const newMember: TeamMember = {
        id: Date.now(),
        name: newMemberName
      };
      setTeamMembers(prevMembers => [...prevMembers, newMember]);
      setNewMemberName('');
    }
  };

  const deleteTeamMember = (memberId: number): void => {
    setTeamMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
    // Also remove this member's estimates from all tasks
    setTasks(prevTasks => prevTasks.map(task => {
      const newEstimates = { ...task.estimates };
      delete newEstimates[memberId];
      return { ...task, estimates: newEstimates };
    }));
  };

  const submitEstimate = (taskId: number, memberId: number, points: number): void => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newEstimates = {
            ...task.estimates,
            [memberId]: points
          };
          
          // Check for significant differences in estimates
          const estimateValues = Object.values(newEstimates);
          if (estimateValues.length > 1) {
            const max = Math.max(...estimateValues);
            const min = Math.min(...estimateValues);
            if (max / min > 2) { // More than 2x difference
              setShowAlert(true);
              setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
            }
          }
          
          return {
            ...task,
            estimates: newEstimates
          };
        }
        return task;
      })
    );
  };

  const calculateAverage = (estimates: Record<number, number>): string => {
    const values = Object.values(estimates);
    if (values.length === 0) return '0';
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(1);
  };

  const exportToExcel = (): void => {
    let csvContent = "Task Name,";
    
    teamMembers.forEach(member => {
      csvContent += `${member.name},`;
    });
    csvContent += "Average Points\n";

    tasks.forEach(task => {
      csvContent += `${task.name},`;
      teamMembers.forEach(member => {
        csvContent += `${task.estimates[member.id] || ''},`;
      });
      csvContent += `${calculateAverage(task.estimates)}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'story_points.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Instructions Panel */}
      <div className="bg-blue-50 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">How to Use This Tool</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>First, add all team members who will be participating in the estimation.</li>
          <li>Add each task or user story that needs to be estimated.</li>
          <li>Each team member selects their estimate using the animal-based point system.</li>
          <li>The average score will be calculated automatically.</li>
          <li>Use the Export button to download all estimates to a spreadsheet.</li>
        </ol>
      </div>

      {/* Point Scale Reference */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-md font-medium mb-2">Point Scale Reference</h3>
        
        {/* Important Note About Time Estimates */}
        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">About Time Estimates</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Time estimates shown are for a single developer working alone</li>
            <li>• Multiple developers may reduce calendar time but add coordination overhead</li>
            <li>• Estimates include time for coding, testing, and basic documentation</li>
            <li>• Additional time may be needed for reviews, meetings, and integration</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {animalPoints.map(({ points, animal, emoji, description, timeEstimate }) => (
            <div key={points} className="p-3 bg-white rounded border hover:shadow-md transition-shadow">
              <div className="font-bold text-lg mb-1 flex items-center gap-2">
                <span className="text-2xl">{emoji}</span>
                <span>{points} ({animal})</span>
              </div>
              <div className="text-sm space-y-1">
                <div className="text-gray-600">{description}</div>
                <div className="text-blue-600 font-medium">
                  🕒 {timeEstimate}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Team Size Impact:</strong> These estimates are for individual developer effort. 
            Working with multiple developers might reduce calendar time but can add overhead for coordination, 
            code reviews, and integration. Consider these factors when planning sprints and deadlines.
          </p>
        </div>
      </div>

      {/* Custom Alert without shadcn/ui dependency */}
      {showAlert && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <p className="text-yellow-800">
            Significant difference detected in estimates. Consider discussing these differences with the team.
          </p>
        </div>
      )}
<div className="flex flex-wrap gap-2 mt-2">
  {/* Tooltip for delete functionality */}
  <p className="w-full text-sm text-gray-500 italic mb-2">
    Hover over items to delete them
  </p>
  {teamMembers.map(member => (
    <div key={member.id} className="flex items-center px-3 py-1 bg-blue-100 rounded group">
      <span>{member.name}</span>
      <button
        onClick={() => deleteTeamMember(member.id)}
        className="ml-2 text-blue-600 opacity-25 group-hover:opacity-100 transition-opacity"
        aria-label={`Delete ${member.name}`}
      >
        <X size={16} />
      </button>
    </div>
  ))}
</div>
      {/* Team Member Management */}
      <div className="space-y-2 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium">Step 1: Add Team Members</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="Enter team member name"
            className="flex-1 p-2 border rounded"
          />
          <button 
            onClick={addTeamMember}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Member
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {teamMembers.map(member => (
            <div key={member.id} className="flex items-center px-3 py-1 bg-blue-100 rounded group">
              <span>{member.name}</span>
              <button
                onClick={() => deleteTeamMember(member.id)}
                className="ml-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
{/* Tasks section */}
{tasks.length > 0 && (
  <div className="mt-4">
    {/* Tooltip for delete functionality */}
    <p className="text-sm text-gray-500 italic mb-2">
      Hover over items to delete them
    </p>
    {tasks.map(task => (
      <div key={task.id} className="flex items-center justify-between p-2 hover:bg-gray-50 group">
        <span>{task.name}</span>
        <button
          onClick={() => deleteTask(task.id)}
          className="text-red-500 opacity-25 group-hover:opacity-100 transition-opacity"
          aria-label={`Delete ${task.name}`}
        >
          <X size={16} />
        </button>
      </div>
    ))}
  </div>
)}
      {/* Task Management */}
      <div className="space-y-2 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium">Step 2: Add Tasks</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Enter task description"
            className="flex-1 p-2 border rounded"
          />
          <button 
            onClick={addTask}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>
        {tasks.length > 0 && (
          <div className="mt-4">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-2 hover:bg-gray-50 group">
                <span>{task.name}</span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Modal without shadcn/ui dependency */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Export</h3>
            <p className="mb-4">Are you sure you want to export the current estimates to CSV?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estimation Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Step 3: Estimate Tasks</h3>
          {tasks.length > 0 && (
            <button 
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Download size={16} />
              Export to Excel
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border text-left">Task</th>
                {teamMembers.map(member => (
                  <th key={member.id} className="p-2 border text-center">
                    {member.name}
                  </th>
                ))}
                <th className="p-2 border text-center">Average</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="p-2 border">{task.name}</td>
                  {teamMembers.map(member => (
                    <td key={member.id} className="p-2 border">
                      <select
                        className="w-full p-1 border rounded"
                        value={task.estimates[member.id] || ''}
                        onChange={(e) => submitEstimate(task.id, member.id, Number(e.target.value))}
                      >
                        <option value="">Select</option>
                        {animalPoints.map(({ points, animal, emoji }) => (
                          <option key={points} value={points}>
                            {emoji} {points} ({animal})
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                  <td className="p-2 border text-center font-bold">
                    {calculateAverage(task.estimates)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}