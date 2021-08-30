<template>
	<div id="wrapper">
		<div class="header">
			<div class="logo">
				<router-link to="/">
					Learn
					<span class="black">In</span>
				</router-link>
				<p>Навчальна сторінка твого університету</p>
			</div>

			<ul class="nav">
				<li><router-link to="/" exact>Головна сторінка</router-link></li>
				<li><router-link to="/results" exact>Результати навчання</router-link></li>
				<li><router-link to="/materialy" exact>Мої матеріали</router-link></li>

				<li>
					<router-link to="/logout" v-if="user">Вихід</router-link>
					<router-link to="/login" exact v-else>Вхід</router-link>
				</li>
			</ul>
		</div>
		<!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
		<router-view />
	</div>
</template>

<script>
import axios from 'axios'
export default {
	name: 'App',
	data() {
		return {
      user: false
    }
	},
	async mounted() {
		await axios
			.get('/api/user')
			.then((res) => {
				if( res.data.name ){
					this.user = res.data
				}
			})
			.catch(() => {
				this.user = false
			})
	},
}
</script>

<style>
a.router-link-active {
	color: #f66;
}

html {
	background: #e4e4e4 url('assets/bg.jpg') repeat;
	color: #2c3e50;
	font-family: Arial;
	font-size: 12px;
	color: #4b4b4b;
	line-height: 18px;
	text-shadow: 0 1px 0 white;
}

.router-link-exact-active {
	font-weight: 700;
}

* {
	margin: 0;
	padding: 0;
}

#wrapper {
	width: 980px;
	padding: 0 10px;
	margin: 0 auto;
	min-height: 100%;
	position: relative;
}

#app {
	text-align: center;
}

.header {
	border-bottom: 13px solid #a12424;
	padding: 40px 0 0 0;
	overflow: hidden;
}

.logo {
	display: inline-block;
	float: left;
	color: #a12424;
	font-weight: bold;
}

/*Навигация*/
ul.nav {
	margin: 0;
	padding: 20px 0 0 0;
	overflow: hidden;
	float: right;
}

ul.nav li {
	float: left;
	list-style: none;
	padding: 0 0 0 35px;
}

ul.nav li a {
	font-size: 14px;
	font-weight: bold;
	color: white;
	text-decoration: none;
	padding: 0 0 0 35px;
	display: block;
	color: black;
}

ul.nav li a.router-link-exact-active {
	color: #a12424;
}

ul.nav li a:hover {
	color: #a12424;
}

.logo a {
	text-decoration: none;
	font-size: 30px;
}

*:first-child + html .logo a {
	line-height: normal;
}

.logo p {
	margin-top: -3px;
}

.black {
	color: black;
}

.gray {
	color: #a3a3a3;
	font-size: 18px;
}

.logo p {
	font-size: 12px;
}

a {
	color: #b60000;
	text-decoration: underline;
}

p {
	margin-bottom: 10px;
}

h1,
h2,
h3,
h4,
h5,
h6 {
	color: black;
	line-height: normal;
}

h1 {
	font-size: 18px;
}

h2 {
	font-size: 16px;
	margin-top: 15px;
}

h3 {
	font-size: 14px;
}

h1 + p,
h2 + p,
h3 + p {
	margin-top: 3px;
}

a img {
	border: none;
	outline: none;
}

ul,
ol,
dl {
	margin: 0 0 0 30px;
}

dt {
	font-weight: bold;
}

dd {
	font-style: italic;
}

input,
button,
textarea {
	display: inline-block;
}

input[type='text'],
textarea,
select {
	padding: 5px;
	height: auto;
	border: 1px solid #bcbcbc;
}

input[type='text'],
textarea,
button {
	box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15);
	-webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15);
	-moz-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15);
	-webkit-transition: all linear 0.2s;
	-moz-transition: all linear 0.2s;
	-ms-transition: all linear 0.2s;
	-o-transition: all linear 0.2s;
	transition: all linear 0.2s;
}

input[type='checkbox'],
input[type='radio'] {
	margin: 3px 5px 0 0;
	float: left;
}

input[type='text'] {
	width: 200px;
}

select {
	width: 210px;
}

textarea {
	width: 300px;
	height: 100px;
}

label {
	display: block;
	/*vertical-align: middle;*/
	color: black;
}

input:focus,
button:focus,
textarea:focus,
select:focus {
	outline: none;
	border: 1px solid #999999;
	box-shadow: none;
}

input:-moz-placeholder {
	color: #c0c0c0;
}

input::-webkit-input-placeholder {
	color: #c0c0c0;
}

button {
	cursor: pointer;
	color: white;
	font-size: 14px;
	font-weight: bold;
	background-color: #a12424;
	background-repeat: no-repeat;
	background-image: -ms-linear-gradient(top, #b92c2c, #a12424);
	background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#b92c2c), to(#a12424));
	background-image: -webkit-linear-gradient(top, #b92c2c, #a12424);
	background-image: -o-linear-gradient(top, #b92c2c, #a12424);
	/*background-image: linear-gradient(top, #b92c2c, #a12424);*/
	background-image: -moz-linear-gradient(top, #b92c2c, #a12424);
	filter: progid:dximagetransform.microsoft.gradient(startColorstr='#b92c2c', endColorstr='#a12424', GradientType=0);
	border: 1px solid #a12424;
	padding: 8px 20px;
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
	-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
	-moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
	height: 37px;
	text-shadow: none;
}

button:hover {
	background-position: 0 -15px;
}

*:first-child + html button {
	width: 90px;
}

.row {
	overflow: hidden;
	margin: 10px 0;
}

.col {
	float: left;
	margin-right: 15px;
	overflow: hidden;
}

table.bordered {
	margin: 10px 0;
	padding: 0;
	border-collapse: collapse;
	border: 1px solid #bcbcbc;
	width: 100%;
	background-color: white;
}

table.bordered th,
table.bordered td {
	border: 1px solid #bcbcbc;
	padding: 5px;
	vertical-align: top;
}

table.bordered th {
	background-color: #ececec;
	text-align: left;
	font-weight: bold;
	color: black;
}

table.bordered tbody tr:hover {
	background-color: #f2f2f2;
}
</style>
