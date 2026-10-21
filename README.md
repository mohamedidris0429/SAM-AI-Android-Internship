# To-Do List (React)

A React application ported from the original SAM-AI Android To-Do List app (`com.samai.todolist`), faithfully preserving all original core features, styling, and behavior.

## Features
- **Task Management**: Enter tasks, add them to the list, or clear the input.
- **Visual Completion**: Tap any task to mark it complete (displays checkmark `✓` and strike-through). Tap again to toggle back.
- **Delete Tasks**: Click `✕` to remove any task from the list.
- **Persistent Storage**: Tasks are automatically saved to `localStorage` under the `tasks` key as a JSON array, mirroring SharedPreferences persistence.
- **Input Validation**: Displays an Android-style toast notification when attempting to add an empty task.
- **Responsive Layout**: Designed to mirror the Android application theme (`#173B70`, `#1E4178`, `#2457A7`, `#F5F8FC`).

## Tech Stack
- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4

## Running Locally
```bash
npm install
npm run dev
```
The app will run on `http://localhost:3000`.
