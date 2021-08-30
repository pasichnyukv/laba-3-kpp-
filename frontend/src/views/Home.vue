<template>
	<main>
		<div class="content">
			<div class="rightCol">
				<ul class="rightNav">
					<li><a href="#">Корисна інформація для першокурсників</a></li>
					<li><a href="#">Для студентів які проживають у гуртожитках</a></li>
					<li><a href="#">Важливі новини щодо навчання</a></li>
					<li><a href="#">Список боржників по навчанню</a></li>
				</ul>
				<div class="block">
					<h3>Інформація щодо нового навчального року</h3>
					<p>
						<i>
							В новому 2021-2022 році планується змішане навчання , але для того щоб не заплутатись радимо вам слідкувати за новинами нашого університету.
						</i>
					</p>
				</div>
			</div>
			<div class="main">
				<h1>Для чого потрібен наш сайт ?</h1>
				<p>
					Даний сайт допоможе вам зручно дізнаватись всі новини нашого університету , комунікувати з викладачами , переглядати ваш розклад матеріали ваших дисциплін , та ваші результати
					навчання .
				</p>
				<!--Изображения-->
				<h2>Ректор університету</h2>
				<!--Списки и определения-->
				<p>
					<img src="../assets/img1.png" />
					<img src="../assets/img2.png" />
				</p>
				<div class="row">
					<ol>
						<h3>
							Джеффрі Престон Безос - ректор університету . Займає посаду з 2009 року , є всесвітньо відомим підприємцем , відомим інвестором та філантропом . Завжди радий бачити наших
							студентів , надихнути їх та допомогти у навчанні та пошуку для них роботи.
						</h3>
					</ol>
				</div>
			</div>
			<!--
      <h2>Останні результати виконання робіт</h2>
			<table class="bordered">
				<thead>
					<tr>
						<th>Дисципліна</th>
						<th>Вид роботи</th>
						<th>Викладач</th>
						<th>Оцінка</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Алгоритмізація</td>
						<td>Тестування</td>
						<td>Назарина О.Я</td>
						<td>3</td>
					</tr>
					<tr>
						<td>Філософія</td>
						<td>Колоквіум</td>
						<td>Шевченко А.О</td>
						<td>4</td>
					</tr>
					<tr>
						<td>Практика</td>
						<td>ККР</td>
						<td>Гегедош Ф.Д</td>
						<td>4</td>
					</tr>
					<tr>
						<td>Психологія</td>
						<td>Колоквіум</td>
						<td>Розумний Д.І</td>
						<td>5</td>
					</tr>
				</tbody>
			</table>
      
			<h2>Надіслати викладачу повідомлення</h2>
			<form>
				<div class="row">
					<label>Ім'я та ініціали викладача</label>
					<input type="text" placeholder="" />
				</div>
				<div class="row">
					<label>Оберіть вид повідомлення</label>
					<select>
						<option>Щодо виконання робіт</option>
						<option>Особисте повідомлення</option>
						<option>Запитання щодо сессії</option>
						<option>Колоквіуми/контрольні</option>
					</select>
				</div>
				<div>
					<label>Введіть ваше повідомлення</label>
					<textarea></textarea>
				</div>
				<div class="row">
					<button type="submit">Надіслати</button>
				</div>
			</form>
      -->
		</div>
	</main>
</template>

<script>
export default {
	name: 'Home',
}
</script>

<style>
.rightCol {
	float: right;
	margin-left: 20px;
	width: 220px;
}

/*Контент*/
.content {
	padding: 20px 0;
}
.block {
	margin: 0 0 20px 0;
	border: 1px solid #a12424;
	background-color: #ececec;
}

.block > h3 {
	padding: 8px 10px;
	color: white;
	background-color: #a12424;
	text-shadow: none;
}

.block p {
	color: black;
	margin: 0;
	padding: 10px 10px 0;
}

.block a.more {
	padding-bottom: 10px;
	display: block;
}

.main {
	overflow: hidden;
}

.main img {
	margin-right: 15px;
	border: 10px solid #cfcfcf;
}

ul.rightNav {
	margin: 0 0 20px 0;
	padding: 0;
	border: 1px solid #bcbcbc;
	background-color: #ececec;
}

ul.rightNav li {
	list-style: none;
}

ul.rightNav li a {
	color: black;
	text-decoration: none;
	padding: 8px 10px 8px 30px;
	display: block;
	border-top: 1px solid #bcbcbc;
	background: url('../assets/arrow-right.png') 13px 50% no-repeat;
}

ul.rightNav li:first-child a {
	border-top: none;
}

ul.rightNav li a:hover {
	background-color: white;
}
</style>
