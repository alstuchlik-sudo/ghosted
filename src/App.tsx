import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './store/store'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { PipelineForm } from './pages/PipelineForm'
import { PipelineDetail } from './pages/PipelineDetail'
import { Profile } from './pages/Profile'

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pipeline/new" element={<PipelineForm />} />
            <Route path="/pipeline/:id" element={<PipelineDetail />} />
            <Route path="/pipeline/:id/edit" element={<PipelineForm />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
