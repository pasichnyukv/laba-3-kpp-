<template>
	<main>
		<div class="wrapper">
			<div class="main">
				<center><h2>Матеріали ваших дисциплін</h2></center>
			</div>
      <table class="bordered">
				<thead>
					<tr>
						<th>N</th>
						<th>Назва дисципліни</th>
						<th>Викладач</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(info, subjectName, i) in materials" :key="i">
						<td>{{i + 1}}</td>
						<td><a :href="'/material/'+info.subjectID">{{subjectName}}</a></td>
						<td>{{info.teacherName}}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<form v-if="isTeacher">
			<center><h2>Створити новий матеріал ( Вчитель )</h2></center>
			<div class="container">
				<label for="uname"><b>Назва</b></label>
				<input type="text" placeholder="Введіть назву матеріала" name="uname" v-model="materialName" required />
				<p />

				<label for="uname"><b>Група</b></label>
				<select v-model="selectedGroup">
					<option v-for="(name, id) in groups" :value="id" :key="id">{{ name }}</option>
				</select>

				<p />

				<label for="uname"><b>Дисципліна</b></label>
				<select v-model="selectedSubject" required>
					<option v-for="(name, id) in subjects" :value="id" :key="id">{{ name }}</option>
				</select>

				<p />

				<input type="file" id="file" ref="file" v-on:change="handleFileUpload()" required />
				<p />
				<button v-on:click="uploadMaterial()">Створити</button>
			</div>
		</form>
	</main>
</template>

<script>
import axios from 'axios'
export default {
	name: 'Materialy',
	data() {
		return {
			isTeacher: false,
			file: '',
			materialName: '',
			subjectName: '',

			groups: {},
			subjects: {},

			materials: {},

			selectedGroup: false,
			selectedSubject: false,
		}
	},
	async mounted() {
		await axios.get('/api/user').then((res) => {
			this.isTeacher = res.data.isTeacher
		})

		await axios.get('/api/user/materials').then((res) => {
			//this.materials = res.data

      let result = {}
			for (const key in res.data) {
				const info = res.data[key]
				result[info.subjectName] = {teacherName: info.teacherName, subjectID: info.subjectID}
			}

      this.materials = result
		})

		if (this.isTeacher) {
			await axios.get('/api/json/groups').then((res) => {
				this.groups = res.data
			})

			await axios.get('/api/json/subjects').then((res) => {
				this.subjects = res.data
			})
		}
	},
	methods: {
		handleFileUpload() {
			this.file = this.$refs.file.files[0]
		},
		async uploadMaterial() {
			event.preventDefault()
			if (!this.file) {
				return
			}

			await axios
				.post('/api/teacher/createMaterial', {
					materialName: this.materialName,
					filename: this.file.name,
					subjectName: this.subjects[this.selectedSubject],
					group: this.selectedGroup,
				})
				.then(async (res) => {
					if (!res.data.ok) {
						return
					}

					let formData = new FormData()
					formData.append('file', this.file)

					await axios.post('/api/teacher/uploadFile', formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					})

					this.$router.go()
				})
		},
	},
}
</script>
