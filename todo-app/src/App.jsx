import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const addTodo = () => {
    if (todo.trim() === "") {
      alert("Please enter a task");
      return;
    }
    setTodos([...todos, todo]);
    setTodo("");
  }

  const deleteTodo = (index) => {
    const updatedTodos = todos.filter((todo , item) => item !== index);
    setTodos(updatedTodos);
  }
  return (
    <div className="app">
      <h1>Todo App</h1>
      <div className="Todo input">
        <input
          type="text"
          placeholder="Add a new task"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <div className = "todo-list">
        {todos.map((item , index) => (
          <div className = "todo" key = {index}>
            <span>{item}</span>
            <button onClick={() => deleteTodo(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
