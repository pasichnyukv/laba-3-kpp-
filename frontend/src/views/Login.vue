<template>
	<main>
		<h2>Вхід у систему</h2>

		<form>
			<div class="container">
				<label for="uname"><b>Логін</b></label>
				<input type="text" placeholder="Введіть логін" name="uname" v-model="login" required />

				<label for="psw"><b>Пароль</b></label>
				<input type="password" placeholder="Введіть пароль" name="psw" v-model="password" required />

				<button type="submit" @click="doLogin">Увійти</button>
			</div>
			<font color="red" size="3" v-if="errorMessage">{{ errorMessage }}</font>

			<div class="container" style="background-color:#f1f1f1">
				<center>
					<router-link to="/admin" tag="button" class="adminbtn">Електронний деканат</router-link>
				</center>
			</div>
		</form>
	</main>
</template>

<script>
import axios from 'axios'
export default {
	name: 'Login',
	data() {
		return {
			login: '',
			password: '',
			errorMessage: false,
		}
	},
	methods: {
		async doLogin() {
			event.preventDefault()
			axios
				.post('/api/user/login', {
					login: this.login,
					password: this.password,
				})
				.then(() => {
					this.$router.push('/')
					this.$router.go()
				})
				.catch((err) => {
					this.errorMessage = err.response.data.err
				})
		},
	},
}
</script>

<style>
body {
	font-family: Arial, Helvetica, sans-serif;
}
form {
	border: 3px solid #f1f1f1;
}

input[type='text'],
input[type='password'] {
	padding: 12px 20px;
	margin: 8px 0;
	display: inline-block;
	border: 1px solid #ccc;
	box-sizing: border-box;
}

button {
	background-color: #4caf50;
	color: white;
	padding: 14px 20px;
	margin: 8px 0;
	border: none;
	cursor: pointer;
}

button:hover {
	opacity: 0.8;
}

.adminbtn {
	width: auto;
	padding: 10px 18px;
	background-color: #f44336;
}

.container {
	padding: 16px;
}

span.psw {
	float: right;
	padding-top: 16px;
}

@media screen and (max-width: 300px) {
	span.psw {
		display: block;
		float: none;
	}
	.cancelbtn {
		width: 100%;
	}
}
</style>
