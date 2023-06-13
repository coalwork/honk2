document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('delete-account');
    const modal = document.getElementById('modal');

    if (!button) { return; }

    const overlay = modal.parentElement;
    const [notice, input, confirm] = modal.children;

    confirm.setAttribute('disabled', '');

    input.style.setProperty(
        '--placeholder-length', input.placeholder.length
    );
    
    input.addEventListener('input', event => {
        console.log(input.value, input.getAttribute('name'));
        if (input.value !== input.getAttribute('name')) {
            confirm.setAttribute('disabled', '');
            return;
        }
        confirm.removeAttribute('disabled');
    });

    button.addEventListener('click', () => {
        overlay.classList.add('enabled');

        return;
    });
    
    overlay.addEventListener('click', removeOverlay);

    confirm.addEventListener('click', () => {
        fetch('/api/account?self', { method: 'DELETE' })
            .then(() => location = '/home');
    });

    function removeOverlay(event) {
        if (this !== event.target) { return; }

        overlay.classList.remove('enabled');

        const root = document.documentElement;
        const trans = getComputedStyle(root).getPropertyValue('--trans');

        setTimeout(
            () => {
                input.value = '';
                input.dispatchEvent(new Event('input'));
            },
            parseInt(trans)
        );
    }
});
