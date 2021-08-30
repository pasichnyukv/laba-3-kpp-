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
						<th>Назва файлу</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(info, i) in fileList" :key="i">
						<td>{{ i + 1 }}</td>
						<td>
							<a :href="'http://localhost:5000/api/user/downloadMaterial/' + info._id">{{ info.materialName }}</a>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</main>
</template>

<script>
import axios from 'axios'
export default {
	name: 'MaterialViewer',
	data() {
		return {
			fileList: {},
		}
	},
	async mounted() {
		await axios.get('/api/user/materialsBySubject/' + this.$route.params.id).then((res) => {
			this.fileList = res.data
		})
	},
}
</script>
