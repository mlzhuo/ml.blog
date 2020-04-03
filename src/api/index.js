import axios from "axios";
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
  post("/login", { username, password });
export const Register = ({ username, password }) =>
  post("/register", { username, password });
export const getUserById = user_id => get(`/user/${user_id}`);
export const insertLog = ({ user_id, type }) => post("/log", { user_id, type });
export const getBlog = ({ user_id, category_id, tag_id, page, pagesize }) =>
  get("/blog", { user_id, category_id, tag_id, page, pagesize });
export const getBlogById = blog_id => get(`/blog/${blog_id}`);
export const insertBlog = obj => post("/blog/add", obj);
export const viewBlog = blog_id => get(`/blog/${blog_id}/view`);
export const likeBlog = blog_id => get(`/blog/${blog_id}/like`);
