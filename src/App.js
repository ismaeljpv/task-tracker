import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer';
import About from './components/About';

function App() {

  const [showAddTask, setShowAddTask] = useState(false)

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  //Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }

  //Fetch task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }

  //Update task
  const updateTask = async (task) => {
    const res = await fetch(`http://localhost:5000/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    return await res.json()
  }

  //Add task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()
    setTasks([...tasks, data])
  }

  //Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  //Toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)

    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    const data = await updateTask(updTask)

    setTasks(tasks.map((task) => task.id === data.id ? {
      ...task,
      reminder: !task.reminder
    } : task
    ))
  }

  const hasTasks = tasks.length > 0

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />

        <Route path="/" exact
          render={(props) => (
            <>
              {showAddTask && <AddTask onAdd={addTask} />}

              {hasTasks ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No tasks to show'}
            </>
          )} />

        <Route path="/about" component={About} />

        <Footer />
      </div>
    </Router>
  );
}

export default App;
