/**
 * Caches every input value of the given form user have entered so far
 * @param {HTMLFormElement} formEl
 */
function createFormCacher(formEl) {
    const localStorageFormPrefix = `form_cache$${formEl.id}:`;

    const extractInputName = (localStorageKey) => localStorageKey.substring(localStorageFormPrefix.length, localStorageKey.length);

    for (const input of formEl.querySelectorAll('input:not([type=checkbox]), select, textarea')) {
        input.addEventListener('input', (event) => {
            localStorage.setItem(`${localStorageFormPrefix}${event.target.name}`, event.target.value)
        });
    }

    return {
        backup() {
            formInputKeys = Object.keys(localStorage)
                .filter(key => key.startsWith(localStorageFormPrefix));

            for (const key of formInputKeys)
                formEl.querySelector(`[name=${extractInputName(key)}]`).value = localStorage.getItem(key);
        },

        clear() {
            formInputKeys = Object.keys(localStorage)
                .filter(key => key.startsWith(localStorageFormPrefix));

            for (const key of formInputKeys)
                localStorage.removeItem(key);
        }
    }
}
