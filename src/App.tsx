import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import Footer from './components/Footer/Footer';
import Forbidden from './components/Forbidden/Forbidden';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PostList from './pages/PostList/PostList';
import PostDetail from './pages/PostDetail/PostDetail';
import PostCreate from './pages/PostCreate/PostCreate';
import PostEdit from './pages/PostEdit/PostEdit';
import AdminArea from './pages/AdminArea/AdminArea';
import LoginPage from './pages/Login/Login';

function App() {
  return (
    <>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <PostList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="PROFESSOR">
                <AdminArea />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/create"
            element={
              <ProtectedRoute requiredRole="PROFESSOR">
                <PostCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <ProtectedRoute requiredRole="PROFESSOR">
                <PostEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id"
            element={
              <ProtectedRoute>
                <PostDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MainContent>
      <Footer />
    </>
  );
}

export default App;
