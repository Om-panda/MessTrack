import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export const login = (data) => api.post('/auth/login', data)

export const addStudent = (data) => api.post('/students/add', data)
export const studentSelfReport = (data) => api.post('/students/my-report', data)

export const adminDashboard = (data) => api.post('/admin/dashboard', data)
export const getStudentsList = (data) => api.post('/admin/students-list', data)
export const searchStudent = (data) => api.post('/admin/search-student', data)
export const updateStudent = (data) => api.put('/admin/update-student', data)
export const deleteStudent = (data) => api.delete('/admin/delete-student', { data })
export const adminStudentReport = (data) => api.post('/admin/student-report', data)
export const getCaterers = () => api.get('/admin/caterers')
export const addCaterer = (data) => api.post('/admin/add-caterer', data)
export const deleteCaterer = (data) => api.delete('/admin/delete-caterer', { data })

export const setPrice = (data) => api.post('/pricing/set', data)
export const getAllPrices = () => api.get('/pricing/all')

export const blockMeal = (data) => api.post('/block/block', data)

export const catererTodayMeals = () => api.get('/caterer/today-meals')
export const catererMonthlyReport = (data) => api.post('/caterer/monthly-report', data)
export const catererStudentsDashboard = () => api.get('/caterer/students-dashboard')

export default api
