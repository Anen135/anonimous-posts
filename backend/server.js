const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;
const DATA_FILE = path.join(__dirname, 'posts.json');

app.use(cors());
app.use(express.json());

let posts = [];

// Загрузка данных при старте сервера, если файл существует
if (fs.existsSync(DATA_FILE)) {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    posts = JSON.parse(data);
  } catch (err) {
    console.error('Ошибка чтения posts.json:', err);
    posts = [];
  }
}

app.get('/posts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let paginatedPosts = posts.slice().reverse().slice(startIndex, endIndex);
  res.json({
    posts: paginatedPosts,
    total: posts.length,
    page,
    totalPages: Math.ceil(posts.length / limit),
  });
});

app.get('/posts/:id', (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (post) res.json(post);
  else res.status(404).json({ error: 'Пост не найден' });
});

app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  const newPost = { id: uuidv4(), title, content, createdAt: new Date() };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.delete('/posts/:id', (req, res) => {
  const postIndex = posts.findIndex((p) => p.id === req.params.id);
  if (postIndex !== -1) {
    const deletedPost = posts.splice(postIndex, 1);
    res.json(deletedPost[0]);
  } else {
    res.status(404).json({ error: 'Пост не найден' });
  }
});

app.post('/posts/save', (req, res) => {
  fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Ошибка сохранения:', err);
      return res.status(500).json({ error: 'Не удалось сохранить данные' });
    }
    res.json({ message: 'Данные успешно сохранены' });
  });
});

app.post('/posts/load', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка загрузки:', err);
      return res.status(500).json({ error: 'Не удалось загрузить данные' });
    }
    try {
      posts = JSON.parse(data);
      res.json({ message: 'Данные успешно загружены', total: posts.length });
    } catch (err) {
      console.error('Ошибка парсинга данных:', err);
      res.status(500).json({ error: 'Файл повреждён или пустой' });
    }
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
