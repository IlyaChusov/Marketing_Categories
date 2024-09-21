$('.upload_button').click(function (e) {
    e.preventDefault();

    let out_array = {};
    let inputs = document.getElementsByClassName('input_category');
    for (const key in inputs) {
        let input = inputs[key];
        if (input.checked)
            out_array[document.getElementById('span_' + input.id.split('_')[1]).textContent] = '';
    }

    if (Reflect.ownKeys(out_array).length !== 0) {
        // Form closes automatically after this line
        window.Telegram.WebApp.sendData(JSON.stringify(out_array));
    }
});
