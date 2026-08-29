import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import Footer from './components/Footer/Footer';
import PostList from './pages/PostList/PostList';
import PostDetail from './pages/PostDetail/PostDetail';

function App() {
  return (
    <>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MainContent>
      <Footer />
    </>
  );
}

export default App;
