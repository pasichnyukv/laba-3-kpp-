<template>
	<main></main>
</template>
<script>
import axios from 'axios'

export default {
	async mounted() {
		await axios.post('/api/user/logout').finally(() => {
			this.$router.push('/')
			this.$router.go()
		})
	},
}
</script>
