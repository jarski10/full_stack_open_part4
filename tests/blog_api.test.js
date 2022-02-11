const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Blog = require('../models/blog')
const initialBlogs = [
    {
      title: "Otsikko1",
      author: "Jarkko1",
      url: "abc.www1",
      likes: 100
  },
  {
    title: "Otsikko2",
      author: "Jarkko2",
      url: "abc.www2",
      likes: 200
  }
]
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(2)
})

test('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].title).toBe('Otsikko1')
})

test('a valid note can be added ', async () => {
  const newBlog = {
    "title": "Otsikko15",
    "author": "Jarkko",
    "url": "abc.www",
    "likes": 301
}

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(
    'Otsikko15'
  )
})

afterAll(() => {
  mongoose.connection.close()
})