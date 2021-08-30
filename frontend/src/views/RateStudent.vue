<template>
	<main>
		<form>
			<h2>Оцінка студенту</h2>
			<div class="container">
				<font color="red" size="3" v-if="errorMessage">{{ errorMessage }}</font>
				<div>
					<label><b>ПІБ</b></label>
					<input type="name" placeholder="Введіть ПІБ учня" required v-model="studentName" />
				</div>

				<div>
					<label><b>Оцінка</b></label>
					<input type="number" placeholder="Введіть оцінку" required v-model="rate" />
				</div>

				<select v-model="selectedSubject" required>
					<option v-for="(name, id) in subjects" :value="id" :key="id">{{ name }}</option>
				</select>

				<p />
				<div>
					<button type="submit" @click="doRate">Оцінити</button>
				</div>
			</div>
		</form>
	</main>
</template>

<script>
import axios from 'axios'
export default {
	name: 'RateStudent',
	data() {
		return {
			subjects: {},
			studentName: '',
			rate: undefined,
			selectedSubject: 0,
			errorMessage: '',
		}
	},
	async mounted() {
		let isTeacher = false
		await axios
			.get('/api/user')
			.then((res) => {
				isTeacher = res.data?.isTeacher
			})
			.catch(() => {})

		if (!isTeacher) {
			this.$router.push('/')
			return
		}

		await axios.get('/api/json/subjects').then((res) => {
			this.subjects = res.data
		})
	},
	methods: {
		async doRate() {
            event.preventDefault( )
			await axios
				.post('/api/teacher/rateStudent', {
					studentName: this.studentName,
					subjectName: this.subjects[this.selectedSubject],
					rate: this.rate,
				})
				.then(() => {
					this.$router.go( )
				})
				.catch((err) => {
					this.errorMessage = err.response.data.err
				})
		},
	},
}
</script>
