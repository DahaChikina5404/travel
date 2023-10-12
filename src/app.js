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

                <img class="h-80" src="${tour.image}"/>
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
                    ${format(new Date(tour.startTime), 'dd MMMM yyyy', {local: ru})} 
                        - 
                    ${format(new Date(tour.endTime), 'dd MMMM yyyy', {local: ru})};
                    продолжительность: ${duration}
                </div>

                <div class="px-2">
                    <button class="btn_style">Подробнее</button>
                    <button class="btn_style">Добавить в избранное</button>
                </div>

            </div>`
    })
}

// Связываем две функции 
async function running() {
    const tours = await loadTours()
    renderTours(tours)
}


// Условие на отображение поля "Город" (если оно заполнено)
async function filterCity(tours, city) {
    if (city === null) {
    const empty = tours.filter((tour) => {
        return tour.city === city
        })
    renderTours(empty)
}
    else {
        renderTours(tours)
    }
}

running()
filterCity()