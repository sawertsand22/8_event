function renderDOMElementFromHTMLString(html) {
    const templateElement = document.createElement('template');
    templateElement.innerHTML = html.trim();
    return templateElement.content.firstChild;
}

/**
 * Renders Bootstrap 5 Toast component
 * @param {('success'|'danger')} type
 * @param {string} message
 */
function renderToastElement(type, message) {
    return renderDOMElementFromHTMLString(`
        <div class="toast text-bg-${type} border-0" data-bs-autohide="true" data-bs-delay="4000" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `);
}


function pushSuccessToast(message) {
    const toastContainer = document.querySelector('.toast-container');
    const toastEl = renderToastElement('success', message);

    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
        toast.dispose();
    });
}

function pushFailureToast(message) {
    const toastContainer = document.querySelector('.toast-container');
    const toastEl = renderToastElement('danger', message);

    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
        toast.dispose();
    });
}
