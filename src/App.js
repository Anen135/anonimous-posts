import ParticlesBackground from './ParticlesBackground';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import ExpandingTextarea from './ExpandingTextarea';

const API_URL = 'http://localhost:5001/posts';

function Home() {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const postsPerPage = 5; // Количество постов на странице

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${API_URL}?page=${currentPage}&limit=${postsPerPage}`)
      .then((res) => {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setIsLoading(false));
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div>
      <div> <ParticlesBackground /> </div>
    <div className="relative p-4 max-w-xl mx-auto">

      <div className='App bg-opacity-30 backdrop-blur-lg p-6 rounded-lg shadow-lg'>
        <h1 className="text-2xl text-orange-200 font-bold mb-4">Анонимные посты</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const title = e.target.elements.title.value;
            const content = e.target.elements.content.value;
            if (title && content) {
              axios.post(API_URL, { title, content }).then((res) => {
                setPosts([res.data, ...posts]);
              });
              e.target.reset();
            }
          }}
          className="mb-4"
        >
          <input
            name="title"
            placeholder="Заголовок"
            className="w-full p-2 border rounded mb-2"
          />
          <ExpandingTextarea
            name="content"
            placeholder="Поделитесь своими мыслями..."
          ></ExpandingTextarea>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Опубликовать
          </button>
        </form>

        {isLoading ? (
          <div>Загрузка...</div>
        ) : (
          <div className="space-y-2">
            {/* Добавляем проверку на наличие данных */}
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <Link
                  to={`/post/${post.id}`}
                  key={post.id}
                  className="block p-4 border rounded hover:bg-gray-50 bg-orange-50"
                >
                  <h2 className="font-bold truncate">{post.title}</h2> {/* Заголовок поста */}
                  <p className='truncate'>{post.content}</p>
                </Link>
              ))
            ) : (
              <div className='text-white'>Нет постов</div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Назад
          </button>
          <div className='text-white'>Страница {currentPage} из {totalPages}</div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Вперед
          </button>

        </div>
      </div>
    </div>
    </div>
  );
}

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/${id}`).then((res) => setPost(res.data));
  }, [id]);

  if (!post) return <div className="p-6 text-center text-gray-500">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-white p-6">
      <div className="max-w-2xl mx-auto">
      <Link
  to="/"
  className="inline-flex items-center gap-2 text-purple-700 bg-purple-100 hover:bg-purple-200 transition px-4 py-2 rounded-full text-sm font-medium shadow-sm"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
  Назад
</Link>

        <div className="bg-white shadow-xl rounded-2xl p-6 border border-purple-200">
          <h2 className="text-2xl font-semibold text-purple-900 mb-4 break-words">
            {post.title}
          </h2>

          <div className="text-gray-800 whitespace-pre-line break-words leading-relaxed">
            {post.content}
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-4 text-right italic">
          Анонимное откровение
        </div>
      </div>
    </div>
  );
}


function ParticlesPage() {
  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <ParticlesBackground />
      <div className='Z1'>
      <div style={{ position: 'absolute', zIndex: 1 }}>
        <h1 style={{ color: 'white', textAlign: 'center' }}>
          Добро пожаловать на сайт!
        </h1>
      </div>
    </div>

      </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/particles" element={<ParticlesPage />} />
      </Routes>
    </Router>
  );
}
