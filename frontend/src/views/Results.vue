<template>
	<main>
		<!--Таблица-->
		<center>
			<h2>Поточні результати навчання</h2>
		</center>
		<table class="bordered">
			<thead>
				<tr>
					<th>Дисципліна</th>
					<th>Викладач</th>
					<th>Кількість набраних балів</th>
					<th>Оцінка</th>
				</tr>
			</thead>

			<tbody>
				<tr v-for="(info, i) in results" :key="i">
					<td>{{ info.name }}</td>
					<td>{{ info.teacher }}</td>
					<td>{{ info.rate }}</td>
					<td>{{ info.grade }}</td>
				</tr>
			</tbody>
		</table>

		<!--Формы-->
	</main>
</template>

<script>
import axios from 'axios'

export default {
	name: 'Results',
	data() {
		return {
			results: {},
			gradeList: {
				A: 90,
				B: 82,
				C: 81,
				D: 67,
				E: 60,
				FX: 35,
				F: 1,
			},
		}
	},
	methods: {
		getGrade(rate) {
			let maxScore = 0
			let resultGrade = 'F'
			for (const grade in this.gradeList) {
				let score = this.gradeList[grade]
				if (score > rate) continue

				if (maxScore < score) {
					maxScore = score
					resultGrade = grade
				}
			}

			return resultGrade
		},
	},
	async mounted() {
    let isTeacher = false
    await axios
			.get('/api/user')
			.then((res) => {
				if( res.data.isTeacher ){
          isTeacher = true
        }
			})

    if( isTeacher ){
      this.$router.push( "/rate" )
      return
    }

		await axios.get('/api/user/getMyResults').then((res) => {
			if (res.data.length == 0) {
				this.results = [{ name: 'пусто', teacher: 'пусто', rate: 'пусто', grade: 'пусто' }]
				return
			}

			this.results = res.data
			this.results.forEach((info) => {
				info.grade = this.getGrade(info.rate)
			})
		})
	},
}
</script>
