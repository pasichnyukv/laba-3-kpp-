<template>
	<main>
		<font color="red" size="3" v-if="errorMessage">{{ errorMessage }}</font>
		<form>
			<h2>Створити користовача</h2>
			<div class="container">
				<div>
					<label><b>Ім'я</b></label>
					<input type="name" placeholder="Введіть ім'я" required v-model="name" />

					<label><b>Логін</b></label>
					<input type="login" placeholder="Введіть логін" required v-model="login" />

					<label><b>Пароль</b></label>
					<input type="password" placeholder="Введіть пароль" required v-model="password" />
				</div>

				<!--<input type="checkbox" v-model="isAdmin"/>
				<label for="horns">Вчитель</label> -->

				<select v-model="selectedGroup">
					<option v-for="(name, id) in groups" :value="id" :key="id">{{ name }}</option>
					<option value="teacher">Вчитель</option>
				</select>

				<p />
				<div>
					<button type="submit" @click="createUser">Створити</button>
				</div>
			</div>
		</form>

		<p />
		<hr />
		<p />

		<form>
			<h2>Створити дисципліну</h2>
			<div class="container">
				<div>
					<label><b>Назва дисципліни</b></label>
					<input type="name" placeholder="Введіть назву дисципліни" required v-model="subjectName" />
				</div>
				<p />

				<select v-model="subjectGroup">
					<option v-for="(name, id) in groups" :value="id" :key="id">{{ name }}</option>
				</select>

				<p />
				<div>
					<button type="submit" @click="createSubject">Створити</button>
				</div>
			</div>
		</form>

		<p />
		<hr />
		<p />
	</main>
</template>

<script>
import axios from 'axios'
export default {
	name: 'Admin',
	data() {
		return {
			password: '',
			name: '',
			login: '',
			errorMessage: false,
			selectedGroup: 'teacher',

			subjectName: '',
			subjectGroup: 'teacher',

			groups: {},
		}
	},
	async mounted() {
		await axios
			.get('/api/user')
			.then((res) => {
				if (!res.data.isAdmin) {
					this.$router.push('/admin/login')
					return
				}
			})
			.catch(() => {
				this.$router.push('/admin/login')
			})
		await axios.get('/api/json/groups').then((res) => {
			this.groups = res.data
		})
	},
	methods: {
		createUser() {
			axios
				.post('/api/admin/createUser', {
					name: this.name,
					login: this.login,
					password: this.password,
					group: this.selectedGroup,
				})
				.then(() => {
					this.$router.go()
				})
				.catch((err) => {
					this.errorMessage = err.response.data.err
				})
			event.preventDefault()
		},
		createSubject() {
			axios
				.post('/api/admin/createSubject', {
					name: this.subjectName,
					group: this.subjectGroup,
				})
				.then(() => {
					this.$router.go()
				})
				.catch((err) => {
					this.errorMessage = err.response.data.err
				})
			event.preventDefault()
		},
	},
}
</script>
