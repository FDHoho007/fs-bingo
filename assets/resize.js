const isOverflown = ({ clientHeight, scrollHeight, clientWidth, scrollWidth }) => scrollHeight > clientHeight || scrollWidth > clientWidth

const resizeText = ({ element, elements, minSize = 10, maxSize = 512, step = 1, unit = 'px' }) => {
    (elements || [element]).forEach(el => {
        let i = minSize
        let overflow = false

        while (!overflow && i < maxSize) {
            el.style.fontSize = `${i}${unit}`
            overflow = isOverflown(el)

            if (!overflow) i += step
        }

        // revert to last state where no overflow happened
        el.style.fontSize = `${i - step}${unit}`
    })
}
