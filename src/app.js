import { format, differenceInDays } from 'date-fns'
import { ru } from 'date-fns/locale'

let tours = []
let currentTour

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

                <img class="h-80 mx-2 my-2" src="${tour.image}"/>
                <p class="text-2xl px-2 py-5">${tour.country}</p>
                <p class="text-2xl px-2">${getCity(tour)}</p>
                <p class="px-2 text-justify">${tour.hotelName}</p>

                <div class="flex gap-1 px-2 py-5">
                    <p>${tour.rating}</p>

                    <span aria-hidden="true">
                        &middot;
                    </span>
                                
                    <p>${tour.price}</p>
                </div>

                <div class="flex gap-1 px-2 py-5">
                    ${format(new Date(tour.startTime), 'dd MMMM yyyy', {locale: ru})} 
                        - 
                    ${format(new Date(tour.endTime), 'dd MMMM yyyy', {locale: ru})};
                    продолжительность: ${duration}
                </div>

                <div class="px-2">
                    <button class="btn_style" id="reservedTours-${tour.id}">Забронировать</button>
                    <button class="btn_style">Добавить в избранное</button>
                </div>

            </div>`
    })
}


// Фильтр по стране
function filterByCountry(tours, country) {
    if (country) {
        const filteredTours = tours.filter((tour) => {
            return tour.country === country
        })
        renderTours(filteredTours)
    } else {
        renderTours(tours)
    }
}


// Связываем две функции 
async function running() {
    const tours = await loadTours()
    renderTours(tours)

    tours.forEach((tour) => {
        let reservedBtn = document.getElementById(`reservedTours-${tour.id}`)
        reservedBtn.addEventListener('click', () => {
            openModal(tour.id)
        })
    })
    
    document.getElementById('kipr').addEventListener('click', () => filterByCountry(tours, 'Кипр'))
    document.getElementById('maldivi').addEventListener('click', () => filterByCountry(tours, 'Мальдивы'))
    document.getElementById('tailand').addEventListener('click', () => filterByCountry(tours, 'Тайланд'))
    document.getElementById('mexica').addEventListener('click', () => filterByCountry(tours, 'Мексика'))
    document.getElementById('all').addEventListener('click', () => filterByCountry(tours))

    function addByClass() {
        const kipr = document.getElementById('kipr')
        const maldivi = document.getElementById('maldivi')
        const tailand = document.getElementById('tailand')
        const mexica = document.getElementById('mexica')
        const all = document.getElementById('all')
    
        if (kipr) {
            kipr.classList.toggle('btn-color')
        } else {
            kipr.classList.toggle('btn_style')
        } if (maldivi) {
            maldivi.classList.toggle('btn-color')
        } else {
            maldivi.classList.toggle('btn_style')
        } if (tailand) {
            tailand.classList.toggle('btn-color')
        } else {
            tailand.classList.toggle('btn_style')
        } if (mexica) {
            mexica.classList.toggle('btn-color')
        } else {
            mexica.classList.toggle('btn_style')
        } if (all) {
            all.classList.toggle('btn-color')
        } else {
            all.classList.toggle('btn_style')
        }
    }
    addByClass()
}

// Открываем дропдаун
const dropdownButton = document.getElementById('dropdown-button')
const dropdownMenu = document.getElementById('dropdown-menu')

dropdownButton.addEventListener ('click', () => {
  dropdownMenu.style.display = 'flex'
})



// Вызов полей в модальном окне с данными о туре
function reservedInput(tour) {
    document.getElementById('image_order').value = tour.image
    document.getElementById('country_order').value = tour.country
    document.getElementById('city_order').value = tour.city
    document.getElementById('hotelName_order').value = tour.hotelName
    document.getElementById('rating_order').value = tour.rating
    document.getElementById('price_order').value = tour.price
    document.getElementById('startTime_order').value = tour.startTime
    document.getElementById('endTime_order').value = tour.endTime
}


// Вызов функции заказа тура при нажатии кнопки "Забронировать"
//  Открытие модального окна
let modalWindow = document.getElementById('add_modal')

function openModal(id) {
    currentTour = id

    modalWindow.classList.remove('hidden')
    modalWindow.classList.add('flex')

    tours.find((tour => {
        return tour.id === id
    }))
    
}

// Закрытие модального окна
let closeWindow = document.getElementById('close_modal')

function closedModal() {
    modalWindow.style.display = 'none'
}
closeWindow.addEventListener('click', closedModal)


running()
filterByCountry(tours, country)