function scrollMenu(dir){
    const menu = document.getElementById("menuGrid");
    const card = menu.querySelector(".card");
    const gap = 20;
    menu.scrollBy({left: dir * (card.offsetWidth + gap), behavior:"smooth"});
}

function goToOrder(img){
    const card = img.closest(".card");
    const orderSection = document.getElementById("order");
    if (orderSection) {
        orderSection.scrollIntoView({behavior:"smooth", block:"start"});

        if (card) {
            const drinkName = card.getAttribute("data-drink");
            const iceValue = card.querySelector('[data-type="ice"]').value;
            const sugarValue = card.querySelector('[data-type="sugar"]').value;
            const drinkSelect = document.getElementById("drinkSelect");
            const iceSelect = document.getElementById("iceSelect");
            const sugarSelect = document.getElementById("sugarSelect");

            if (drinkSelect && drinkName) {
                drinkSelect.value = drinkName;
            }
            if (iceSelect) {
                iceSelect.value = iceValue;
            }
            if (sugarSelect) {
                sugarSelect.value = sugarValue;
            }
        }

        const firstInput = orderSection.querySelector("input, select, textarea");
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 400);
        }
    }
}

function handleOrderSubmit(event) {
    event.preventDefault();
    alert('Đơn đặt món của bạn đã được ghi nhận!');
    event.target.reset();
}
