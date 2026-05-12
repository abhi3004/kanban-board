import { Provider } from 'react-redux'
import './App.css'
import { KanbanApp } from './components/KanbanApp'
import { ThemeProvider } from './context/ThemeProvider'
import { store } from './store/store'

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <KanbanApp />
      </ThemeProvider>
    </Provider>
  )
}

export default App
