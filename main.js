$('.upload_button').click(function (e) {
    e.preventDefault();

    $('.download_button').addClass("disabled");
    $('.progress').removeClass('hidden');
    $('.msg').text('');

    $('.upload_icon').text('');
    $('.upload_text').text('Обработка');
    let updating_text = ['Обработка.', 'Обработка..', 'Обработка...', 'Обработка'];
    let i = 0;
    let delay = 1000;
    let updating_timer = setTimeout(function update() {
        if (i === updating_text.length)
            i = 0;
        $('.upload_text').text(updating_text[i]);
        i++;

        updating_timer = setTimeout(update, delay);
    }, delay);

    let out_array = {};

    let inputs = document.getElementsByClassName('input_category');
    for (const key in inputs) {
        let input = inputs[key];
        if (input.checked)
            out_array[document.getElementById('span_' + input.id.split('_')[1]).textContent] = '';
    }

    let selects = document.getElementsByClassName('select_category');
    for (const key in selects) {
        let select = selects[key];
        if (!select.disabled) {
            let model = M.FormSelect.getInstance(select);
            if (model !== null && model !== undefined) {
                let selected = model.getSelectedValues();
                if (selected.length !== 0) {
                    let name = selected[0].split(';')[0];
                    if (out_array[name] !== undefined)
                        delete out_array[name];

                    let arr = [];
                    for (const selectedKey in selected) {
                        let one = selected[selectedKey];
                        arr.push(one.split(';')[1]);
                    }
                    out_array[name] = arr;
                }
            }

        }

    }

    console.log(out_array);

    let fict_formData = new FormData();
    fict_formData.append('values', JSON.stringify(out_array));

    $.ajax({
        url: 'main_script.php',
        type: 'POST',
        data: fict_formData,
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
            console.log(data);
            data = JSON.parse(data);
            let tr = document.createElement('tr');
            let td1 = getTd();
            let date = new Date(data['time']);
            td1.textContent = date.toString().split('GMT')[0];
            // td1.textContent = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + "\n" + date.getDate() + ':' + date.getMonth() + ':' + date.getFullYear();
            let td2 = getTd();
            td2.textContent = data['categories'];
            let td3 = getTd();
            td3.textContent = data['last_news'];
            let td4 = getTd();
            let download_button = document.createElement('button');
            download_button.classList.add('btn', 'waves-effect', 'waves-light');
            let i = document.createElement('i');
            i.classList.add('material-icons', 'center');
            i.textContent = 'arrow_downward';
            download_button.append(i);
            td4.append(download_button);

            let td5 = getTd();
            let delete_button = document.createElement('button');
            delete_button.classList.add('btn', 'waves-effect', 'waves-light');
            let i2 = document.createElement('i');
            i2.classList.add('material-icons', 'center');
            i2.textContent = 'delete';
            delete_button.append(i2);
            td5.append(delete_button);

            tr.append(td1);
            tr.append(td2);
            tr.append(td3);
            tr.append(td4);
            tr.append(td5);

            table_body.append(tr);

            msg.textContent = data['news'] + "\n           " + data['answer'];

            $('.progress').addClass('hidden');
            clearTimeout(updating_timer);
            $('.upload_text').text('Запросить');
            $('.upload_icon').text('arrow_upward');

        }
    });
});

const all_categories = {
    'Технологии и нейросети': [],
    'Исследования в маркетинге': [],
    'Агентства': [],
    'Тендеры': [],
    'Кадры и назначения': [],
    'Digital': ['Digital-площадки и соц. сети', 'Киберспорт', 'Законы'],
    'Медиа': ['ТВ', 'OOH', 'Радио, Пресса, Кино', 'Законы'],
    'Креатив': ['Видео', 'Брендинг'],
    'Маркетинг': ['Законы', 'Фестивали'],
    'Бизнес': ['Потребрынок', 'Ритейл', 'Телеком', 'Финансы', 'Транспорт'],
    // 'Общество': ['Мемы', 'Жизнь', 'Стиль'],
    'Спонсорство и спецпроекты': [],
    'e-commerce': [],
}

let curI = 0;

document.addEventListener('DOMContentLoaded', function () {
    for (const categoryName in all_categories) {
        let category = all_categories[categoryName];


        let label1 = document.createElement('label');
        let input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = true;
        input.className = 'input_category';
        input.id = 'input_' + curI;


        let span = document.createElement('span');
        span.id = 'span_' + curI;
        span.textContent = categoryName;
        label1.append(input);
        label1.append(span);
        let div = document.createElement('div');


        if (category.length !== 0) {
            let label2 = document.createElement('label');
            let select = document.createElement('select');
            select.className = 'select_category';
            select.id = 'select_' + curI;
            select.multiple = true;
            select.disabled = true;

            for (const categoryKey in category) {
                let subcategory = category[categoryKey];
                let option = document.createElement('option');
                // option.className = 'option_subcategory';
                option.value = categoryName + ';' + subcategory;
                option.text = subcategory;
                option.selected = true;
                // option.classList.add('option' + curI);
                select.append(option);
            }


            label2.append(select);
            div.append(label2);
        }
        start_div.append(label1);
        if (category.length !== 0) {
            start_div.append(div);
        }

        setUpdateTrigger(input.id);
       
        curI++;
    }
    let elems = document.querySelectorAll('select');
    let instances = M.FormSelect.init(elems, null);
});

function setUpdateTrigger(id) {
    $('#' + id).off('click');
    $('#' + id).click(function (e) {
        let target = e.target.id;

        let select = document.getElementById('select_' + target.split('_')[1]);
        if (select !== null) {
            select.disabled = !select.disabled;
            M.FormSelect.init(select, null);
        }
    });
}

function getTd() {
    return document.createElement('td');
}
