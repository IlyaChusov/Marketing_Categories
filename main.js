$('.upload_button').click(function (e) {
    e.preventDefault();

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
        // if (!select.disabled) {
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

        // }

    }

    if (Reflect.ownKeys(out_array).length !== 0) {
        // Form closes automatically after this line
        window.Telegram.WebApp.sendData(JSON.stringify(out_array));
    }
});

const all_categories = {
    'Digital (Киберспорт)': [],
    'Digital-площадки и соц-сети': [],
    'e-commerce': [],
    'Агентства': [],
    'Законы': [],
    'Исследования в маркетинге': [],
    'Кадры и назначения': [],
    'Креатив (Брендинг)': [],
    'Креатив (Видео)': [],
    'Маркетинг (Фестивали)': [],
    'Медиа (OOH)': [],
    'Медиа (Радио, Пресса, Кино)': [],
    'Медиа (ТВ)': [],
    'Тендеры': [],
    'Технологии и нейросети': [],
}

let curI = 0;

document.addEventListener('DOMContentLoaded', function () {
    for (const categoryName in all_categories) {
        let category = all_categories[categoryName];


        let label1 = document.createElement('label');
        let input = document.createElement('input');
        input.type = 'checkbox';
        // input.checked = true;
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
            // select.disabled = true;

            for (const categoryKey in category) {
                let subcategory = category[categoryKey];
                let option = document.createElement('option');
                // option.className = 'option_subcategory';
                option.value = categoryName + ';' + subcategory;
                option.text = subcategory;
                // option.selected = true;
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
        // $('#' + input.id).click();
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
            let drops = select.getElementsByTagName("option");
            for (const drop of drops) {
                drop.selected = true;
            }
            M.FormSelect.init(select, null);
        }
    });
}

function getTd() {
    return document.createElement('td');
}
