import scrollToElement from 'scroll-to-element'
export default function (opts) {
    scrollToElement(opts.selector,{
        offset: -100,
        ease: opts.ease || 'out-circ',
    })
}