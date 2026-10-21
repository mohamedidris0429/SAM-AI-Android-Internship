import React, { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'tasks'

export default function App() {
  const [tasks, setTasks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item))
        }
      }
    } catch {
      // fallback to empty list
    }
    return []
  })

  const [inputVal, setInputVal] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimeoutRef = useRef<number | null>(null)

  // Save tasks to localStorage whenever tasks state changes
  const saveTasks = (newTasks: string[]) => {
    setTasks(newTasks)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks))
    } catch (e) {
      console.error('Failed to save tasks', e)
    }
  }

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }
    setToastMessage(message)
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null)
      toastTimeoutRef.current = null
    }, 2200)
  }

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = inputVal.trim()
    if (!trimmed) {
      showToast('Please enter a task')
      return
    }

    const updated = [...tasks, trimmed]
    saveTasks(updated)
    setInputVal('')
  }

  const handleToggleComplete = (index: number) => {
    const task = tasks[index]
    const updated = [...tasks]
    if (task.startsWith('✓ ')) {
      // Toggle back to incomplete
      updated[index] = task.slice(2)
    } else {
      // Mark as complete
      updated[index] = `✓ ${task}`
    }
    saveTasks(updated)
  }

  const handleDeleteTask = (index: number) => {
    const updated = tasks.filter((_, i) => i !== index)
    saveTasks(updated)
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col justify-between text-slate-800">
      {/* Top Bar / App Header */}
      <header className="bg-[#173B70] text-white shadow-md">
        <div className="max-w-md mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-300 animate-pulse"></div>
            <h1 className="text-lg font-semibold tracking-wide">To-Do List</h1>
          </div>
          <span className="text-xs bg-[#2457A7] px-2.5 py-0.5 rounded-full font-medium text-blue-100">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col">
        {/* Title */}
        <h2 className="text-[26px] font-bold text-[#1E4178] text-center pb-4 tracking-tight">
          My To-Do List
        </h2>

        {/* Task Input Form */}
        <form onSubmit={handleAddTask} className="flex flex-col gap-2.5 mb-2">
          <input
            type="text"
            className="w-full px-4 py-3 text-[16px] bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2457A7] focus:border-[#2457A7] shadow-xs placeholder-slate-400 text-slate-800 transition"
            placeholder="Enter a task"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#2457A7] hover:bg-[#1E4178] active:bg-[#173B70] text-white font-medium text-[16px] rounded-lg shadow-sm transition cursor-pointer"
          >
            Add Task
          </button>
        </form>

        {/* Hint text */}
        <p className="text-[13px] text-slate-500 py-2.5 px-0.5 select-none">
          Tap a task to mark it complete. Use ✕ to delete.
        </p>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto mt-1 space-y-2 pb-6">
          {tasks.length === 0 ? (
            <div className="bg-white/80 rounded-xl border border-slate-200/80 p-8 text-center text-slate-500 text-[16px] shadow-xs">
              <p className="font-medium text-slate-600">No tasks yet.</p>
              <p className="text-sm text-slate-400 mt-1">Add your first task above!</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task, index) => {
                const isComplete = task.startsWith('✓ ')
                return (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2.5 sm:px-3 shadow-xs hover:border-slate-300 transition"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(index)}
                      className={`flex-1 text-left py-2 px-2 text-[17px] cursor-pointer transition select-none truncate ${
                        isComplete
                          ? 'text-gray-400 line-through'
                          : 'text-slate-700 font-normal hover:text-[#1E4178]'
                      }`}
                      title="Tap to toggle completion"
                    >
                      {task}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(index)}
                      className="ml-2 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md text-[17px] font-semibold transition cursor-pointer"
                      title="Delete task"
                      aria-label="Delete task"
                    >
                      ✕
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-3 text-xs text-slate-400 border-t border-slate-200/60 bg-[#F5F8FC]">
        <span>com.samai.todolist</span>
      </footer>

      {/* Android Toast Replica Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-[#323232]/95 text-white text-sm px-4 py-2.5 rounded-full shadow-lg backdrop-blur-xs transition-opacity animate-fade-in"
        >
          {toastMessage}
        </div>
      )}
    </div>
  )
}
