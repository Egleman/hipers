const headerBurgerButton = document.querySelector('.header__burger')
const closeMenuButton = document.querySelector('.mobile-menu__close')
const mobileMenu = document.querySelector('.menu-overlay')
const phoneInputs = document.querySelectorAll('.masked-input')
const forms = document.querySelectorAll('form')
const thanksBlocks = document.querySelectorAll('[data-block="thanks"]')
const returnFormButtons = document.querySelectorAll('[data-button="return-from"]')
const modalLinks = document.querySelectorAll('[toggle]')

//Helpers functions
function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms))
}

function classRemover(elem, className) {
    if (elem.classList.contains(className)) {
      elem.classList.remove(className)
    }
}

function hasVerticalScrollbar() {
    return window.innerHeight < document.documentElement.scrollHeight;
}

function blockVerticalScroll() {
    if (hasVerticalScrollbar()) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflowY = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.querySelector('.menu-overlay').style.paddingRight = `${scrollbarWidth}px`;
    } else {
        document.body.style.overflowY = 'hidden';
    }
}

function unblockVerticalScroll() {
    document.body.style.overflowY = '';
    document.body.style.paddingRight = '';
    document.querySelector('.menu-overlay').style.paddingRight = ``;
}

const closeMobileMenuFunction = async () => {
    classRemover(mobileMenu, 'visible')
    await sleep(500)
    classRemover(mobileMenu, 'active')
    unblockVerticalScroll()
}
//End helpers functions


headerBurgerButton.addEventListener('click', async () => {
    window.scrollTo(0, 0)
    mobileMenu.classList.add('active')
    await sleep(0)
    mobileMenu.classList.add('visible')
    blockVerticalScroll()
})

closeMenuButton.addEventListener('click', async () => {
    await closeMobileMenuFunction()
})

mobileMenu.addEventListener('click', async (e) => {
    if (!e.target.closest('.mobile-mobile-menu__close') && !e.target.closest('.mobile-menu__body')) {
        await closeMobileMenuFunction()
    }
})

const portfolioSwiper = new Swiper(".portfolio-swiper", {
    spaceBetween: 10,
    freeMode: true,
    breakpoints: {
        0: {
            direction: 'vertical',
            slidesPerView: 3,
        },
        606: {
            direction: 'horizontal',
            slidesPerView: 'auto',
        }
    }
});

// Маска для номера телефона
const im = new Inputmask({
    mask: '(+7|8) (999) 999-99-99',
    showMaskOnHover: false,
    showMaskOnFocus: false,
    jitMasking: true,
    inputmode: 'tel'
})
phoneInputs.forEach(input => {
    im.mask(input);
})

//Обработчики форм
forms.forEach((form, index) => {
    form.addEventListener('submit', async function(e) {
        e.preventDefault()
        const formData = new FormData(this)
        const body_to_send = {}

        const requiredInputs = this.querySelectorAll('input[data-state="required"]')

        let permission_to_send = true

        if (requiredInputs.length) {
            requiredInputs.forEach(input => {
                if (input.type === 'checkbox' && !input.checked) {
                    const parentNode = input.parentNode
                    parentNode.parentNode.classList.add('error')
                    permission_to_send = false
                }

                if (input.value === '' || input.value === ' ') {
                    input.parentNode.classList.add('error')
                    permission_to_send = false
                }

                input.addEventListener('focus', () => {
                    classRemover(input.parentNode, 'error')
                })

                input.addEventListener('change', () => {
                    if (input.type === 'checkbox') {
                        const parentNode = input.parentNode
                        classRemover(parentNode.parentNode, 'error')
                    }
                })
            })

            permission_to_send = Array.from(requiredInputs).every(input => {
                if (input.type === 'checkbox') {
                    return input.checked;
                }
                return input.value.trim().length > 0
            })
        }

        if (permission_to_send) {
            formData.forEach((value, key) => {
                body_to_send[key] = value
            })

            console.log(body_to_send)
            this.classList.add('hidden')
            classRemover(thanksBlocks[index], 'hidden')
            // await fetch('/send-main.php', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(body_to_send)
            // })
            // .then(response => {
            //     if (!response.ok) {
            //         throw new Error('Network response was not ok');
            //     }
            //     return response.json();
            // })
            // .then(data => {
            //     if (data.result === 'success') {
            //         this.reset()
            //         document.querySelectorAll('.overlay').forEach(modal => classRemover(modal, 'active'))
            //         document.querySelector('#thanks').classList.add('active')
            //     }
                
            // })
            // .catch(error => {
            //     console.error('Error:', error);
            // });
        }
    })
})

returnFormButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        forms[index].reset()
        classRemover(forms[index], 'hidden')
        thanksBlocks[index].classList.add('hidden')
    })
})

modalLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      await closeMobileMenuFunction()
      const blockId = link.getAttribute('toggle')
      const modal = document.querySelector(blockId)
      document.querySelectorAll('.overlay').forEach(windowModal => {
        if (windowModal !== modal) {
          classRemover(windowModal, 'active')
        }
      })

      if (!modal.classList.contains('active')) {
        modal.classList.add('active')
        await sleep(10)
        modal.classList.add('visible')
        blockVerticalScroll()
      } else {
        classRemover(modal, 'visible')
        await sleep(500)
        classRemover(modal, 'active')
        unblockVerticalScroll()
      }
    })
})

class Accordion {
    constructor(target, config) {
        this._el = typeof target === 'string' ? document.querySelector(target) : target;
        const defaultConfig = {
            alwaysOpen: true,
            duration: 350
        };
        this._config = Object.assign(defaultConfig, config);
        this.addEventListener();
    }
    addEventListener() {
        this._el.addEventListener('click', (e) => {
            const elHeader = e.target.closest('.accordion__header');
            if (!elHeader) {
                return;
            }
            this.toggle(elHeader.parentElement);
        });
    }
    show(el) {
        const elBody = el.querySelector('.accordion__body');
        if (elBody.classList.contains('collapsing') || el.classList.contains('accordion__item_show')) {
            return;
        }
        elBody.style.display = 'block';
        const height = elBody.offsetHeight;
        elBody.style.height = 0;
        elBody.style.overflow = 'hidden';
        elBody.style.transition = `height ${this._config.duration}ms ease`;
        elBody.classList.add('collapsing');
        el.classList.add('accordion__item_slidedown');
        elBody.offsetHeight;
        elBody.style.height = `${height}px`;
        window.setTimeout(() => {
            elBody.classList.remove('collapsing');
            el.classList.remove('accordion__item_slidedown');
            elBody.classList.add('collapse');
            el.classList.add('accordion__item_show');
            elBody.style.display = '';
            elBody.style.height = '';
            elBody.style.transition = '';
            elBody.style.overflow = '';
        }, this._config.duration);
    }
    hide(el) {
        const elBody = el.querySelector('.accordion__body');
        if (elBody.classList.contains('collapsing') || !el.classList.contains('accordion__item_show')) {
            return;
        }
        elBody.style.height = `${elBody.offsetHeight}px`;
        elBody.offsetHeight;
        elBody.style.display = 'block';
        elBody.style.height = 0;
        elBody.style.overflow = 'hidden';
        elBody.style.transition = `height ${this._config.duration}ms ease`;
        elBody.classList.remove('collapse');
        el.classList.remove('accordion__item_show');
        elBody.classList.add('collapsing');
        window.setTimeout(() => {
            elBody.classList.remove('collapsing');
            elBody.classList.add('collapse');
            elBody.style.display = '';
            elBody.style.height = '';
            elBody.style.transition = '';
            elBody.style.overflow = '';
        }, this._config.duration);
    }
    toggle(el) {
        el.classList.contains('accordion__item_show') ? this.hide(el) : this.show(el);
    }
  }
  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach(accordion => {
    new Accordion(accordion, {
        alwaysOpen: false
    });
  })