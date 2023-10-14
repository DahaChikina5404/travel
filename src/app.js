import { format, differenceInDays } from 'date-fns'
import { ru } from 'date-fns/locale'

// Задаем асинхронную функцию для подгрузки данных с бэкенда
async function loadTours() {
    const response = await fetch('https://www.bit-by-bit.ru/api/student-projects/tours')
    const jsonData = await response.json()

    return jsonData
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
                <p class="text-2xl px-2">${tour.city}</p>
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
                    <button class="btn_style">Подробнее</button>
                    <button class="btn_style">Добавить в избранное</button>
                </div>

            </div>`
    })
}


// Фильтр

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

    document.getElementById('kipr').addEventListener('click', () => filterByCountry(tours, 'Кипр'))
    document.getElementById('maldivi').addEventListener('click', () => filterByCountry(tours, 'Мальдивы'))
    document.getElementById('tailand').addEventListener('click', () => filterByCountry(tours, 'Тайланд'))
    document.getElementById('mexica').addEventListener('click', () => filterByCountry(tours, 'Мексика'))
    document.getElementById('all').addEventListener('click', () => filterByCountry(tours))
}



running()
filterByCountry(tours, country)