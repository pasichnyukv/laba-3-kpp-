const bodyParser = require('body-parser') // body-parser; Библиотека "парсит" параметры запросов
const session = require('cookie-session') // Чтобы сохранять логин при авторизации
const express = require('express') // "движок" API сервера
const busboy = require('connect-busboy')
const fs = require('fs')
const path = require('path')
const history = require('connect-history-api-fallback')
const { MongoClient, ObjectId } = require('mongodb') // mongodb библиотека. Чтобы взаимодействовать с базой MongoDB

const app = express()
let db

const adminPassword = '123456789' // Пароль от электронного деканату

const groupsList = { // Список групп
	'2kn17b': '2КН-17б',
	'2kn18b': '2КН-18б',
	'2kn19b': '2КН-19б',
	'2kn20b': '2КН-20б',

	'2ki19b': '2КІ-19б',
	'2ki20b': '2КІ-20б',
}

app.get('/api/user/downloadMaterial/:id', (req, res) => { // Скачивать "матеарил" по его ИД в базе
	db.collection('materials')
		.findOne({
			_id: ObjectId(req.params.id),
		})
		.then((found) => {
			if (!found) {
				res.status(400).send({ ok: false, err: 'Матеріал не існує!' })
				return
			}
			res.download(__dirname + '/materials/' + found.filename)
		})
})

const staticFiles = express.static(path.join(__dirname + '/frontend/dist')) // Чтобы сервер отправлял билд от VUE (npm run build)

app.use(staticFiles) // Чтобы сервер отправлял билд от VUE (npm run build)
app.use(busboy())
app.use(history()) // Подключаем history, без него не будет нормально работать билд VUE
app.use(bodyParser.json()) // Подключаем body-parser
app.use(bodyParser.urlencoded({ extended: false })) // Подключаем body-parser

app.use(
	session({
		name: 'jetiq user session',
		keys: ['wYAoDRbZ0BZWQFYX1ACN', '1pEtkcdgq0eJIFdmxHJE'],
		maxAge: 24 * 60 * 60 * 1000,
	})
)

async function getUserByID(id) {
	if (id) {
		return await db.collection('users').findOne({
			_id: ObjectId(id),
		})
	} else {
		return false
	}
}

// Чтобы отправлять список дисциплын
app.get('/api/json/subjects', async (req, res) => {
	res.send(await db.collection('subjects').distinct('name'))
})

// Чтобы отправлять список групп
app.get('/api/json/groups', (req, res) => {
	res.send(groupsList)
})

// Чтобы получать информацию об своём аккаунте
app.get('/api/user', async (req, res) => {
	let isAdmin = req.session.adminPassword == adminPassword
	let user

	if (req.session.userid) {
		user = await db.collection('users').findOne(
			{
				_id: ObjectId(req.session.userid),  // Поиск из базы по ID в сохранённой сессии
			},
			{
				projection: { password: 0 }, // Пароль не передавать
			}
		)
	}

	if (user) {
		res.send({
			...user,
			isAdmin,
		})
	} else if (isAdmin) {
		res.send({ isAdmin })
	} else {
		res.status(401).send({ ok: false, err: 'Ви не ввійшли' })
	}
})

// Выход из аккаунта
app.post('/api/user/logout', (req, res) => {
	req.session = null
	res.sendStatus(200)
})

// Вход в аккаунт
app.post('/api/user/login', (req, res) => {
	db.collection('users')
		.findOne({
			login: req.body.login,
			password: req.body.password,
		})
		.then((result) => {
			if (!result) {
				res.status(400).send({ ok: false, err: 'Неправильний логін або пароль' })
			} else {
				req.session.userid = result._id
				res.sendStatus(200)
			}
		})
})

// Чтобы получать список материалов
app.get('/api/user/materials', async (req, res) => {
	let match = {}

	let user = await getUserByID(req.session.userid)
	if (!user) {
		return res.status(401).send({ ok: false, err: 'Немає доступу' })
	}

	if (user.isTeacher) {
		match = {
			teacherID: user._id,
		}
	} else {
		match = {
			group: user.group,
		}
	}

	await db
		.collection('materials')
		.aggregate([ // Берёт из разных баз, фильтрует
			{
				$lookup: {
					from: 'subjects',
					as: 'subject',
					localField: 'subjectID',
					foreignField: '_id',
				},
			},
			{
				$lookup: {
					from: 'users',
					as: 'teacher',
					localField: 'teacherID',
					foreignField: '_id',
				},
			},
			{
				$project: {
					subjectID: '$subjectID',
					subjectName: { $arrayElemAt: ['$subject.name', 0] },
					group: { $arrayElemAt: ['$subject.group', 0] },
					teacherName: { $arrayElemAt: ['$teacher.name', 0] },
					teacherID: 1,
					_id: 0,
				},
			},
			{
				$match: match,
			},
			{
				$project: {
					teacherID: 0,
				},
			},
		])
		.toArray()
		.then((results) => {
			if (!results) {
				res.send({})
				return
			}
			res.send(results)
		})
		.catch((err) => {
			res.status(400).send()
		})
})

// Получить список материалов в определённой дисциплине
app.get('/api/user/materialsBySubject/:id', async (req, res) => {
	let user = await getUserByID(req.session.userid)
	if (!user) {
		return res.status(401).send({ ok: false, err: 'Немає доступу' })
	}

	await db
		.collection('materials')
		.find(
			{
				subjectID: ObjectId(req.params.id),
			},
			{
				$project: {
					subjectID: 0,
					teacherID: 0,
					filename: 0,
				},
			}
		)
		.toArray()
		.then((results) => {
			if (!results) {
				res.send({})
				return
			}
			res.send(results)
		})
		.catch((err) => {
			res.status(400).send()
		})
})

// Логин декана
app.post('/api/admin/login', (req, res) => {
	if (req.body.password != adminPassword) {
		res.status(400).send({ ok: false, err: 'Неправильний пароль' })
		return
	}

	req.session.adminPassword = adminPassword
	res.send({ ok: true })
})

// Ограничить доступ ко всем API запросам которые начинаются на /api/admin/
app.use('/api/admin/*', (req, res, next) => {
	if (req.session.adminPassword != adminPassword) {
		res.status(401).send({ ok: false, err: 'Немає доступу' })
		return false
	}
	next()
})

function validNameLength(targetString, requiredLength) {
	return targetString && targetString?.length >= requiredLength
}
async function createUser(name, login, password, group) {
	if (!validNameLength(name, 5)) return { ok: false, err: "Ім'я занадто коротке" }
	if (!validNameLength(login, 5)) return { ok: false, err: 'Логін занадто короткий' }
	if (!validNameLength(password, 5)) return { ok: false, err: 'Пароль занадто короткий' }

	if (!(group in groupsList) && group != 'teacher') return { ok: false, err: 'Недійсна група' }

	return await db
		.collection('users')
		.findOne({
			login,
		})
		.then((found) => {
			if (found) {
				return { ok: false, err: 'Такий логін уже існує' }
			}

			return db
				.collection('users')
				.insertOne({
					login,
					name,
					password,
					isTeacher: group == 'teacher',
					group: group != 'teacher' ? group : undefined,
				})
				.then((result) => {
					if (!result) {
						return { ok: false, err: 'Невідома помилка' }
					}

					return { ok: true }
				})
		})
}

app.post('/api/admin/createUser', async (req, res) => {
	const result = await createUser(req.body.name, req.body.login, req.body.password, req.body.group)

	res.status(result.ok ? 200 : 400).send(result)
})

async function createSubject(name, group) {
	if (!validNameLength(name, 5)) return { ok: false, err: 'Назва дисципліне занадто коротка' }
	if (!(group in groupsList)) return { ok: false, err: 'Недійсна група' }

	return await db
		.collection('subjects')
		.findOne({
			name,
			group,
		})
		.then((found) => {
			if (found) {
				return { ok: false, err: 'Така дисципліна уже існує' }
			}

			return db
				.collection('subjects')
				.insertOne({
					name,
					group,
				})
				.then((result) => {
					if (!result) {
						return { ok: false, err: 'Невідома помилка' }
					}

					return { ok: true }
				})
		})
}
app.post('/api/admin/createSubject', async (req, res) => {
	const result = await createSubject(req.body.name, req.body.group)

	res.status(result.ok ? 200 : 400).send(result)
})

// Ограничить доступ ко всем API запросам которые начинаются на /api/teacher/
app.use('/api/teacher/*', async (req, res, next) => {
	let user = await getUserByID(req.session.userid)

	if (!user || !user.isTeacher) {
		return res.status(401).send({ ok: false, err: 'Тільки вчитель!' })
	}

	next()
})

// Чтобы положить материал в базу
app.post('/api/teacher/createMaterial', async (req, res) => {
	if (!groupsList[req.body.group]) return res.status(400).send({ ok: false, err: 'Недійсна група' })
	let teacher = await getUserByID(req.session.userid)
	let subject = await db.collection('subjects').findOne({
		name: req.body.subjectName,
		group: req.body.group,
	})

	if (!subject) {
		return res.status(400).send({ ok: false, err: 'Недійсна група' })
	}

	db.collection('materials')
		.insertOne({
			subjectID: subject._id,
			teacherID: teacher._id,
			filename: req.body.filename,
			materialName: req.body.materialName,
		})
		.then(() => {
			res.send({ ok: true })
		})
})

// Чтобы сохранить файл от учителя
app.post('/api/teacher/uploadFile', async (req, res) => {
	if (req.busboy) {
		req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
			var saveTo = path.join('./materials', filename)
			file.pipe(fs.createWriteStream(saveTo))
		})

		req.busboy.on('finish', function () {
			res.writeHead(200, { Connection: 'close' })
			res.end()
		})
		return req.pipe(req.busboy)
	}
})

// Оценить студента
app.post('/api/teacher/rateStudent', async (req, res) => {
	if (!req.body.rate || req.body.rate < 0 || req.body.rate > 100) {
		return res.status(400).send({ ok: false, err: 'Неправильна оцінка' })
	}

	let student = await db.collection('users').findOne({ name: req.body.studentName })

	if (!student) {
		return res.status(400).send({ ok: false, err: 'Студента з такими ініціалами не знайдено' })
	}

	let subject = await db.collection('subjects').findOne({ name: req.body.subjectName, group: student.group })
	if (!subject) {
		return res.status(400).send({ ok: false, err: 'Дисципліну не знайдено' })
	}

	await db.collection('results').deleteOne({
		subjectID: subject._id,
		studentID: student._id,
	})

	await db
		.collection('results')
		.insertOne({
			subjectID: subject._id,
			studentID: student._id,
			teacherID: ObjectId(req.session.userid),
			rate: parseInt(req.body.rate),
		})
		.then((result) => {
			res.send({ ok: true })
		})
		.catch((err) => {
			res.status(500).send({ ok: false, err: 'Невідома помилка' })
		})
})

// Получить свои результаты
app.get('/api/user/getMyResults', async (req, res) => {
	let user = await getUserByID(req.session.userid)

	if (!user) {
		return res.status(401).send()
	}
	await db
		.collection('results')
		.aggregate([
			{
				$match: {
					studentID: user._id,
				},
			},
			{
				$lookup: {
					from: 'subjects',
					as: 'subject',
					localField: 'subjectID',
					foreignField: '_id',
				},
			},
			{
				$lookup: {
					from: 'users',
					as: 'teacher',
					localField: 'teacherID',
					foreignField: '_id',
				},
			},
			{
				$project: {
					teacher: { $arrayElemAt: ['$teacher.name', 0] },
					name: { $arrayElemAt: ['$subject.name', 0] },
					rate: '$rate',
					_id: 0,
				},
			},
		])
		.toArray()
		.then((results) => {
			if (!results) {
				res.send({})
				return
			}
			res.send(results)
		})
		.catch((err) => {
			res.status(400).send()
		})
})

// Чтобы сервер отправлял билд от VUE (npm run build)
app.use(staticFiles)
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/frontend/dist/index.html')
})

// Подключение к MongoDB
MongoClient.connect('mongodb://localhost:27017/').then((client) => {
	db = client.db('jetiq')

	app.listen(5000)

	console.log('Сервер працює!')
})
