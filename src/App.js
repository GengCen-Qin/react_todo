import { createContext, useContext, useEffect, useReducer, useState } from "react";

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        list: [
          ...state.list,
          {
            id: Date.now(),
            title: action.payload,
            complete: false
          }
        ]
      };
    case 'DELETE_TODO':
      return {
        ...state,
        list: state.list.filter(todo => todo.id !== action.payload)
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        list: state.list.map(todo =>
          todo.id === action.payload ? { ...todo, complete: !todo.complete } : todo
        )
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    case 'SET_LIST':
      return {
        ...state,
        list: action.payload
      };
    default:
      return state;
  }
}

function AddTodo({addTodo}) {
  const [title, setTitle] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (title.trim() === '') {
      return
    }
    addTodo(title.trim())
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /> Todo Title
      <button type="submit">提交按钮</button>
    </form>
  )
}

function Item({todo,deleteTodo, toggleTodo}) {
  const theme = useContext(ThemeContext);

  return (
    <>
      <div style={{ backgroundColor: theme === 'light' ? 'white' : 'black', color: theme === 'light' ? 'black' : 'white' }}>
        <li style={{
          color: todo.complete ? 'red' : 'black'
        }}>{ todo.title }</li>
        <button onClick={() => deleteTodo(todo.id)}>delete</button>
        <button onClick={() => toggleTodo(todo.id)}>toggle</button>
      </div>
    </>
  )
}

function List({todos, deleteTodo, toggleTodo}) {
  return todos.map(todo => <Item key={todo.id} todo={todo} deleteTodo={deleteTodo} toggleTodo={toggleTodo} />)
}

function FilterTodo({ setFilter }) {
  return (
    <>
      <button onClick={() => setFilter('all')}>all</button>
      <button onClick={() => setFilter('done')}>done</button>
      <button onClick={() => setFilter('non')}>non</button>
    </>
  )
}

const ThemeContext = createContext()

export default function TodoList() {
  const [state, dispatch] = useReducer(todoReducer, {
    list: [],
    filter: 'all',
    theme: 'light'
  });

  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem('todoList'));
    if (savedList.length !== 0) {
      dispatch({ type: 'SET_LIST', payload: savedList });
    }
  }, []);

  useEffect(() => {
    if (state.list.length !== 0) {
      localStorage.setItem('todoList', JSON.stringify(state.list));
    }
  }, [state.list]);

  function addTodo(title) {
    dispatch({ type: 'ADD_TODO', payload: title });
  }

  function deleteTodo(id) {
    dispatch({ type: 'DELETE_TODO', payload: id });
  }

  function toggleTodo(id) {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  }

  function filterTodo() {
    switch (state.filter) {
      case 'done':
        return state.list.filter(todo => todo.complete);
      case 'non':
        return state.list.filter(todo => !todo.complete);
      default:
        return state.list;
    }
  }

  return (
    <ThemeContext.Provider value={state.theme}>
      <h1>Todo List</h1>

      <button onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' })}>
        Toggle Theme
      </button>

      <AddTodo addTodo={addTodo} />

      <List todos={filterTodo()} deleteTodo={deleteTodo} toggleTodo={toggleTodo} />

      <FilterTodo setFilter={(filter) => dispatch({ type: 'SET_FILTER', payload: filter })} />
    </ThemeContext.Provider>
  );
}
