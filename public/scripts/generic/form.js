(() => {
    const logout = document.getElementById('logout');

    if (!logout) { return; }

    logout.addEventListener('click', () => {
        logout.classList.add('loading');
        logout.children[0].classList.add('loading');
        fetch('/api/logout', { method: 'POST' }).then(() => {
            location.reload();
        });
    });
})();

(() => {
    const form = document.getElementById('login-form');

    if (!form) { return; }

    const params = new URLSearchParams(location.search);

    if (params.has('info')) {
        const { info } = JSON.parse(params.get('info'));
        form.setAttribute('data-info', info);

        const style = document.createElement('style');
        style.textContent = '#login-form:last-child::after { content: var(--info); }';
        form.appendChild(style);
    }

    const formSwitchText = document.getElementById('switch');
    const email = form.querySelector('input[type=email]');
    const submit = form.querySelector('input[type=submit]');
    const overlay = document.getElementById('form-loading-overlay');

    form.addEventListener('submit', event => {
        event.preventDefault();

        const url = `/api/${'isRegister' in form.dataset ? 'login' : 'register'}`;

        overlay.setAttribute('data-enabled', '');

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(new FormData(form))
        })
            .then(response => response.json())
            .then(obj => {
                if (Object.keys(obj).length) {
                    params.set('info', JSON.stringify(obj));
                    location.search = params.toString();
                    return;
                }
                params.delete('info');
                location.search = params.toString() || '';
            });
    });

    const handler = () => {
        if (!('isRegister' in form.dataset)) {
            formSwitchText.innerHTML = 'not registered? <u>make an account</u>';
            reAddListener();
            form.setAttribute('action', '/api/login');
            form.setAttribute('data-is-register', '');
            email.removeAttribute('required');
            submit.setAttribute('value', 'log in');
            return;
        }

        formSwitchText.innerHTML = 'have an account? <u>log in</u>';
        reAddListener();
        form.setAttribute('action', '/api/register');
        form.removeAttribute('data-is-register');
        email.setAttribute('required', '');
        submit.setAttribute('value', 'register');
    }

    function reAddListener() {
        formSwitchText.addEventListener('click', handler);
    }

    handler();
    formSwitchText.addEventListener('click', handler);
    formSwitchText.addEventListener('keyup', ({ key }) => {
        if (key === ' ' || key === 'Enter') { formSwitchText.click(); }
    });

})();
