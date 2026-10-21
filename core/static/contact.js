document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const countrySelect = document.getElementById("countryCode");
    const numberInput = document.getElementById("telephoneNumber");
    const error = document.getElementById("phoneError");

    if (!form || !countrySelect || !numberInput || !error) return;

    const supportedCodes = Array.from(countrySelect.options).map((option) => ({
        code: option.value.replace("+", ""),
        digits: Number(option.dataset.digits)
    }));

    function validatePhone() {
        const selected = countrySelect.selectedOptions[0];
        const expectedLength = Number(selected.dataset.digits);
        const selectedCode = selected.value.replace("+", "");
        const number = numberInput.value.replace(/\D/g, "");

        numberInput.value = number;
        numberInput.setCustomValidity("");
        error.textContent = "";

        if (!number) {
            if (numberInput.required) {
                error.textContent = error.dataset.required;
                numberInput.setCustomValidity(error.textContent);
            }
            return false;
        }

        if (number.startsWith(selectedCode) && number.length === expectedLength + selectedCode.length) {
            error.textContent = `${error.dataset.duplicatePrefix} ${selected.value}. ${error.dataset.duplicateSuffix}`;
        } else {
            const conflictingCode = supportedCodes.find((item) =>
                item.code !== selectedCode &&
                number.startsWith(item.code) &&
                number.length === item.code.length + item.digits
            );

            if (conflictingCode) {
                error.textContent = `${error.dataset.conflictPrefix} +${conflictingCode.code}. ${error.dataset.conflictSuffix}`;
            } else if (number.length !== expectedLength) {
                error.textContent = `${selected.dataset.country} ${error.dataset.lengthPrefix} ${expectedLength} ${error.dataset.lengthSuffix}`;
            }
        }

        if (error.textContent) numberInput.setCustomValidity(error.textContent);
        return !error.textContent;
    }

    numberInput.addEventListener("input", validatePhone);
    countrySelect.addEventListener("change", validatePhone);

    form.addEventListener("submit", (event) => {
        if (!validatePhone()) {
            event.preventDefault();
            numberInput.reportValidity();
            numberInput.focus();
        }
    });
});
