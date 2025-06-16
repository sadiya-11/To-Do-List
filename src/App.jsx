import { Check, Edit2, Plus, Save, Trash2, X } from "lucide-react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };

      setTodos([todo, ...todos]);
      setNewTodo("");
    }
  };

  const deleteTodo = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      setTodos(todos.filter((todo) => todo.id !== id));
      setDeletingId(null);
    }, 300);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    if (editingText.trim() !== "") {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editingText.trim() } : todo
        )
      );
      setEditingId(null);
      setEditingText("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
            Todo Master
          </h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>

        {/* Add Todo Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 transform hover:scale-[1.01] transition-transform duration-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={addTodo}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-lg transform hover:scale-105 transition-all duration-200">
            <div className="text-2xl font-bold text-gray-800">
              {todos.length}
            </div>
            <div className="text-gray-600 text-sm">Total</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg transform hover:scale-105 transition-all duration-200">
            <div className="text-2xl font-bold text-orange-500">
              {activeCount}
            </div>
            <div className="text-gray-600 text-sm">Active</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg transform hover:scale-105 transition-all duration-200">
            <div className="text-2xl font-bold text-green-500">
              {completedCount}
            </div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
        </div>

       {/* Filter Buttons */}
<div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-lg">
  {["all", "active", "completed"].map((filterType) => {
    // Emoji map for each filter type
    const emojiMap = {
      all: "📋",         // All tasks
      active: "✅",      // Active tasks
      completed: "✔️",   // Completed tasks
    };

    return (
      <button
        key={filterType}
        onClick={() => setFilter(filterType)}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
          filter === filterType
            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        {/* Add emoji and capitalize first letter */}
        {emojiMap[filterType]}{" "}
        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
      </button>
    );
  })}
</div>


        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <div className="text-gray-400 text-lg mb-2"></div>
              <p className="text-gray-500">
                {filter === "completed"
                  ? "No completed tasks yet"
                  : filter === "active"
                  ? "No active tasks"
                  : "No tasks yet. Add one above!"}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className={`bg-white rounded-xl p-4 shadow-lg transform transition-all duration-300 ${
                  deletingId === todo.id
                    ? "animate-slide-out"
                    : "animate-slide-in hover:scale-[1.01]"
                }`}
                style={{
                  animationDelay:
                    deletingId === todo.id ? "0ms" : `${index * 50}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      todo.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {todo.completed && <Check size={14} />}
                  </button>

                  {editingId === todo.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && saveEdit(todo.id)
                        }
                        className="flex-1 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="text-green-600 hover:bg-green-100 p-1 rounded-lg transition-colors duration-200"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors duration-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`flex-1 transition-all duration-200 ${
                          todo.completed
                            ? "text-gray-500 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {todo.text}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditing(todo.id, todo.text)}
                          className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors duration-200"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          disabled={deletingId === todo.id}
                          className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            {completedCount > 0 && (
              <p className="animate-pulse">
                🎉 Great job! You've completed {completedCount} task
                {completedCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-out {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
        }

        .animate-slide-out {
          animation: slide-out 0.3s ease-in-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default App;