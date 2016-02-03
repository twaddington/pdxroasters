/**
 * Scroll Handling & Smooth Scroll
 */
let scroll = {
  /**
   * Fires a function on scroll with request animation frame
   * @param {Function} fn Function to fire on scroll event
   */
  on: (fn) => {
    window.addEventListener('scroll', () => window.requestAnimationFrame(fn))
  },
  /**
   * Smooth scroll to a dom element
   * @param {Element} el DOM Element Object
   * @param {Int} duration Duration of scroll in milliseconds
   * @param {String} easing Easing function: http://easings.net/
   */
  to: (el, {duration = 400, easing = 'linear'} = {}) => {
    el = el instanceof Array ? el[0] : el

    let target = el.offsetTop
    let delta = target - window.pageYOffset
    let body = document.body
    let style = body.style

    // scroll to element, but translate the body so it looks like we haven't moved
    style.transform = `translate3d(0,${delta}px,0)`
    style.WebkitTransform = `translate3d(0,${delta}px,0)`
    window.scrollTo(0, target)

    // add transition and remove transform
    style.transition = `transform ${duration}ms ${easing}`
    style.WebkitTransition = `-webkit-transform ${duration}ms ${easing}`
    style.transform = `translate3d(0,0,0)`
    style.WebkitTransform = `translate3d(0,0,0)`

    // when transition ends, remove all styles
    let end = () => {body.removeAttribute('style')}
    body.addEventListener('transitionend', end)
    body.addEventListener('webkitTransitionEnd', end)
  }
}

export default scroll
