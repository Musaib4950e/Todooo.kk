
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { type Todo, type Filter } from './types';
import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';
import { TodoFilter } from './components/TodoFilter';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error("Failed to parse todos from localStorage", error);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if(isMounted) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  const addTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  const editTodo = useCallback((id: string, text: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === id ? { ...todo, text } : todo))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = useMemo(() => todos.filter(todo => !todo.completed).length, [todos]);

  return (
    <div className="min-h-screen flex items-start justify-center p-4 selection:bg-purple-400 selection:text-white">
      <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-16">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <LogoIcon />
             <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">Prism</h1>
          </div>
          <p className="text-xl text-white/80 font-light hidden sm:block">Your Tasks, Crystal Clear</p>
        </header>

        <main className="space-y-4">
            <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
                <TodoForm onAddTodo={addTodo} />
            </div>

            {isMounted && (
                <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 min-h-[64px]">
                    {todos.length > 0 && 
                        <TodoFilter
                            filter={filter}
                            onFilterChange={setFilter}
                            onClearCompleted={clearCompleted}
                            activeCount={activeCount}
                        />
                    }
                    <div className="divide-y divide-white/10">
                    {filteredTodos.map(todo => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onEdit={editTodo}
                        />
                    ))}
                    {filteredTodos.length === 0 && (
                         <p className="text-center text-white/60 p-8">
                           {filter === 'completed' ? 'No completed tasks yet.' : 'No tasks here. Add one above!'}
                         </p>
                    )}
                    </div>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default App;
