import axios from 'axios';
function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export const Login = ({ username, password }) =>
  post('api/login', { username, password });
export const Register = ({ username, password }) =>
  post('api/register', { username, password });
export const getUserById = user_id => get(`api/user/${user_id}`);
export const insertLog = ({ user_id, type }) =>
  post('api/log', { user_id, type });
export const getCategory = user_id => get(`api/blog/category/${user_id}`);
export const getBlog = ({ user_id, category_id, tag_id, page, pagesize }) =>
  get('api/blog', { user_id, category_id, tag_id, page, pagesize });
export const getBlogById = blog_id => get(`api/blog/${blog_id}`);
export const insertBlog = obj => post('api/blog/add', obj);
