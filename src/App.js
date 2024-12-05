import { useState } from "react"

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
  return (
    <>
      <div>
        <li style={{
          color: todo.complete ? 'red' : 'black'
        }}>{ todo.title }</li>
        <button onClick={() => deleteTodo(todo.id)}>delete</button>
        <button onClick={() => toggleTodo(todo.id)}>toggle</button>
      </div>
    </>
  )
}

function List({todos, deletTodo, toggleTodo}) {
  return todos.map(todo => <Item key={todo.id} todo={todo} deleteTodo={deletTodo} toggleTodo={toggleTodo} />)
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

export default function TodoList() {
  const [list, setList] = useState([])
  const [filter, setFilter] = useState('')


  function addTodo(title) {
    setList([
      ...list,
      {
        id: Date.now(),
        title: title,
        complete: false
      }
    ])
  }

  function deletTodo(id) {
    setList( list.filter(todo => todo.id !== id) )
  }

  function toggleTodo(id) {
    setList(
      list.map(todo =>
        todo.id === id ? { ...todo, complete: !todo.complete } : todo
      )
    )
  }

  function filterTodo() {
    switch (filter) {
      case 'done':
        return list.filter(todo => todo.complete);
      case 'non':
        return list.filter(todo => !todo.complete);
      default:
        return list;
    }
  }

  return (
    <>
      <h1>Todo List</h1>

      <AddTodo addTodo={addTodo} />

      <List todos={filterTodo(list)} deletTodo={deletTodo} toggleTodo={toggleTodo} />

      <FilterTodo setFilter={setFilter} />
    </>
  )
}
