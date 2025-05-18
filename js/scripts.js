const headerBurgerButton = document.querySelector('.header__burger')
const closeMenuButton = document.querySelector('.mobile-menu__close')
const mobileMenu = document.querySelector('.menu-overlay')

//Helpers functions
function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms))
}

function classRemover(elem, className) {
    if (elem.classList.contains(className)) {
      elem.classList.remove(className)
    }
}

const calcScroll = () => {
    let div = document.createElement('div');
    div.style.width = '500px';
    div.style.height = '500px';
    div.style.overflowY = 'scroll';
    div.style.visibility = 'hidden';
    document.body.appendChild(div);
    let scrollWidth = div.offsetWidth - div.clientWidth;
    div.remove();
    return scrollWidth;
}

const blockBody = () => {
    const body = document.body;
    body.style.overflowY = 'hidden';
    body.style.touchAction = 'none';
    const bodyScroll = calcScroll();
    body.style.paddingRight = `${bodyScroll}px`;
}

const unBlockBody = () => {
    const body = document.body;
    body.style.overflowY = 'auto';
    body.style.touchAction = 'auto';
    body.style.paddingRight = `0`;
}

const closeMobileMenuFunction = async () => {
    classRemover(mobileMenu, 'visible')
    await sleep(500)
    classRemover(mobileMenu, 'active')
}
//End helpers functions


headerBurgerButton.addEventListener('click', async () => {
    mobileMenu.classList.add('active')
    await sleep(0)
    mobileMenu.classList.add('visible')
})

closeMenuButton.addEventListener('click', async () => {
    await closeMobileMenuFunction()
})

mobileMenu.addEventListener('click', async (e) => {
    if (!e.target.closest('.mobile-mobile-menu__close') && !e.target.closest('.mobile-menu__body')) {
        await closeMobileMenuFunction()
    }
})