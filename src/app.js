import { format, differenceInDays } from 'date-fns'
import { ru } from 'date-fns/locale'
import Swal from 'sweetalert2'

let tours = []
let currentTour
let filterTours = []


// Задаем асинхронную функцию для подгрузки данных с бэкенда
async function loadTours() {
    const response = await fetch('https://www.bit-by-bit.ru/api/student-projects/tours')
    const jsonData = await response.json()

    return jsonData
}

// Не показываем города со значением null
function getCity(tour) {
	let city
	if (tour.city === null) {
		city = ''
	} else {
		city = tour.city
	}
	return city
}

// Диманически добавляем данные на сайт
function renderTours(tours) {
    document.getElementById('container__with_tours').innerHTML = ''

    tours.forEach((tour) => {

        const duration = differenceInDays(new Date(tour.endTime), new Date(tour.startTime))

        document.getElementById('container__with_tours').innerHTML += `
            <div class="content_card">
                <img class="h-80 rounded-tl-2xl rounded-tr-2xl" src="${tour.image}"/>

                <div class="flex justify-between items-center px-3 py-5">
                    <p class="text-2xl">${tour.country}</p>
                    <p class="text-xl italic rounded-full p-3 bg-sky-300">${tour.rating}</p>
                </div>

                <p class="text-2xl italic px-3">${getCity(tour)}</p>
                <p class="px-3 text-justify">${tour.hotelName}</p>             
                <p class="px-3 text-justify">${tour.price}</p>
              
                <div class="flex gap-1 px-3 py-5">
                    ${format(new Date(tour.startTime), 'dd MMMM yyyy', {locale: ru})} 
                        - 
                    ${format(new Date(tour.endTime), 'dd MMMM yyyy', {locale: ru})}
                </div>

                <div class="flex gap-1 px-3">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        продолжительность: ${duration} дней
                </div>

                <div class="px-3">
                    <button class="btn_style" id="reservedTours-${tour.id}">Забронировать</button>
                </div>
            </div>`
    })
}

// Фильтр по стране
function filterByCountry(country) {
    if (country === 'all') {
        renderTours(tours)
    } else {
        const filteredTours = tours.filter((tour) => {
            return tour.country === country
        })
        renderTours(filteredTours)
    }
}


// Связываем две функции ЗАПУСК
async function running() {
    tours = await loadTours()
    renderTours(tours)

    // Фильтр по странам (кнопки)
    const countryButtons = Array.from(document.getElementsByClassName('country-filter'))

    countryButtons.forEach (countryButton => {
        countryButton.addEventListener ('click', () => {
            filterByCountry(countryButton.dataset.country)
        })
    })

    // Забронировать тур. При нажатии на кнопку открывается НУЖНЫЙ нам тур
    tours.forEach((tour) => {
        const reservedBtn = document.getElementById(`reservedTours-${tour.id}`)
        reservedBtn.addEventListener('click', () => {
            openModal(tour.id)
        })
    })
    closedLoader()
}


// Показываем загрузчик, по не погрузились туры с сервера
function closedLoader() {
    const load = document.getElementById('loader')
        load.style.display = 'none'
}


// Вызов функции заказа тура при нажатии кнопки "Забронировать"
//  Открытие модального окна
const modalWindow = document.getElementById('add_modal')
function openModal(id) {
    currentTour = id

    const selectedTour = tours.find((tour => {
        return tour.id === id
    }))

    if (selectedTour) {
    document.getElementById('selectTour').innerHTML = ''
        document.getElementById('selectTour').innerHTML += `

            <div class="flex flex-col gap-2 justify-between">
                <img class="h-40 w-45 rounded-xl" src="${selectedTour.image}"/>
                <p id="country_order" class="text-2xl italic">${selectedTour.country}</p>
                <p id="city_order" class="text-2xl">${getCity(selectedTour)}</p>
                <p id="hotelName_order">${selectedTour.hotelName}</p>
                <p id="price_order" class="text-2xl">${selectedTour.price}</p>
                <p id="startTime_order" class="italic">${format(new Date(selectedTour.startTime), 'dd MMMM yyyy', {locale: ru})}</p>
                <p id="endTime_order" class="italic">${format(new Date(selectedTour.endTime), 'dd MMMM yyyy', {locale: ru})}</p>
            </div>`

        modalWindow.classList.remove('hidden')
        modalWindow.classList.add('flex')
    }
}

// Закрытие модального окна
const closeWindow = document.getElementById('close_modal')

function closedModal() {
    modalWindow.style.display = 'none'
}
closeWindow.addEventListener('click', closedModal)



// Отправка формы на сервер с данными о клиенте
// Нажатие на кнопку "Отправить"
const sendLetterBtn = document.getElementById('btn_order-tour')
sendLetterBtn.addEventListener('click', (event) => sendLetter(event, tours))

async function sendLetter(event) {
    event.preventDefault()
    
    let surname = document.getElementById('surnameClient').value
    let phone = document.getElementById('phoneClient').value
    let mail = document.getElementById('mailClient').value
    let comment = document.getElementById('commentClient').value

    let formSendData = {

        customerName: surname,
        phone: phone,
        email: mail,
        description: comment
    }

    // post-запрос (передача данных на сервер)
    const url = `https://www.bit-by-bit.ru/api/student-projects/tours/${currentTour}`

    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(formSendData)
    })
    
    if (response.ok) {
       
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Спасибо за обращение! Наш менеджер свяжется с Вами в течение 30 минут!',
            showConfirmButton: false,
            timer: 3000
        })

        closedModal()

        let jsonData = await response.json() // прочитать данные
        return jsonData
    }

    // Условие на заполнение обязательных полей
    if (surname === '' || phone === '' || mail === '') {
        
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Заполните обязательные поля!',
            showConfirmButton: true,
        })

        return
    } 
}


// Функция сортировки по стоимости тура, начиная с дорогого
document.getElementById('highPrice').addEventListener('click', sortByHighPrice)

function sortByHighPrice() {
    filterTours = [...tours] // копия всех туров из массива
    filterTours.sort((a, b) => b.price - a.price)
    renderTours(filterTours)
}

// Функция сортировки по стоимости тура, начиная с дешевого
document.getElementById('lowPrice').addEventListener('click', sortByLowPrice)

function sortByLowPrice() {
    filterTours = [...tours] // копия всех туров из массива
    filterTours.sort((a, b) => a.price - b.price)
    renderTours(filterTours)
}

// Функция сортировки по продолжительности тура (сначала короткие, потом длинные)
document.getElementById('shortTour').addEventListener('click', sortByShot)

function sortByShot() {
    filterTours = [...tours] // копия всех туров из массива
    filterTours.sort((a, b) => differenceInDays(new Date(a.endTime), new Date(a.startTime)) - differenceInDays(new Date(b.endTime), new Date(b.startTime)))
    renderTours(filterTours)
}

// Функция сортировки по продолжительности тура (сначала длинные, потом короткие)
document.getElementById('longTour').addEventListener('click', sortByLong)

function sortByLong() {
    filterTours = [...tours] // копия всех туров из массива
    filterTours.sort((a, b) => differenceInDays(new Date(b.endTime), new Date(b.startTime)) - differenceInDays(new Date(a.endTime), new Date(a.startTime)))
    renderTours(filterTours)
}

running()