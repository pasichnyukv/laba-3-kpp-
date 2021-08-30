import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('../views/Login.vue'),
	},
	{
		path: '/results',
		name: 'Results',
		component: () => import('../views/Results.vue'),
	},
	{
		path: '/rate',
		name: 'RateStudent',
		component: () => import('../views/RateStudent.vue'),
	},
	{
		path: '/materialy',
		name: 'materialy',
		component: () => import('../views/Materialy.vue'),
	},
	{
		path: '/admin',
		name: 'Admin',
		component: () => import('../views/Admin.vue'),
	},
	{
		path: '/admin/login',
		name: 'AdminLogin',
		component: () => import('../views/AdminLogin.vue'),
	},
	{
		path: '/logout',
		name: 'LogOut',
		component: () => import('../views/LogOut.vue'),
	},
	{
		path: '/material/:id',
		name: 'MaterialViewer',
		component: () => import('../views/MaterialViewer.vue'),
	},
]

const router = new VueRouter({
	routes,
	mode: 'history',
})

export default router
