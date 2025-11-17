import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { PlusIcon, SparkleIcon, SpinnerIcon } from './icons';
import { type Priority } from '../types';

interface TodoFormProps {
  onAddTodo: (text: string, priority: Priority) => void;
  onAddMultipleTodos: (texts: string[]) => void;
}

const priorityColorClasses = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
};

const priorityTooltips = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority',
    null: 'Set Priority'
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo, onAddMultipleTodos }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText) {
      onAddTodo(trimmedText, priority);
      setText('');
      setPriority(null);
    }
  };
  
  const handleAiAssist = async () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setIsLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Break down this task into smaller, actionable sub-tasks: "${trimmedText}".`,
        config: {
            systemInstruction: 'You are an expert project manager. Your responses are always a JSON object with a single key "tasks" that contains an array of sub-task strings.',
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    tasks: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING,
                            description: "A single sub-task."
                        }
                    }
                },
                required: ['tasks']
            }
        },
      });

      const jsonStr = response.text.trim();
      const result = JSON.parse(jsonStr);
      
      if (result.tasks && Array.isArray(result.tasks) && result.tasks.length > 0) {
        onAddMultipleTodos(result.tasks);
        setText('');
        setPriority(null);
      } else {
        // If AI returns no tasks, just add the original text as a single task
        onAddTodo(trimmedText, priority);
        setText('');
        setPriority(null);
      }
    } catch (error) {
      console.error("AI task breakdown failed:", error);
      alert("Sorry, the AI assistant couldn't break down the task. Please try again.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const cyclePriority = () => {
    const priorities: Priority[] = [null, 'low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(priority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    setPriority(priorities[nextIndex]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-4">
       <button
        type="button"
        onClick={cyclePriority}
        className="flex-shrink-0 group relative rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Set priority"
        disabled={isLoadingAi}
      >
        <div className={`w-4 h-4 rounded-full transition-all duration-300 ${priority ? priorityColorClasses[priority] : 'border-2 border-white/50 group-hover:border-white'}`}></div>
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {priorityTooltips[priority || 'null']}
        </span>
      </button>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a new task or a big idea to break down..."
        className="w-full bg-transparent text-white placeholder:text-white/50 text-lg px-4 py-3 rounded-lg border-2 border-transparent focus:outline-none focus:border-white/30 transition-colors duration-300 disabled:opacity-50"
        disabled={isLoadingAi}
      />
      <button
        type="button"
        onClick={handleAiAssist}
        className="flex-shrink-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10"
        aria-label="Break down task with AI"
        disabled={!text.trim() || isLoadingAi}
      >
        {isLoadingAi ? <SpinnerIcon /> : <SparkleIcon />}
      </button>
      <button
        type="submit"
        className="flex-shrink-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:hover:bg-white/10"
        aria-label="Add task"
        disabled={!text.trim() || isLoadingAi}
      >
        <PlusIcon />
      </button>
    </form>
  );
};