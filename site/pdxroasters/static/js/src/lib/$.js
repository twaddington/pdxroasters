/**
* Create a new array like object of dom elements
*/
function Query () {
  /**
  * Apply a function to every element in collection
  * @param {Function} fn Function to apply to every element
  * @return Query
  */
  this.each = (fn) => {
    this.forEach(fn)
    return this
  }
  /**
  * Add a class to selected elements
  * @param {String} className The class name to add
  */
  this.addClass = className => this.each(e => e.classList.add(className))
  /**
  * Remove a class from selected elements
  * @param {String} className The class name to remove
  */
  this.removeClass = className => this.each(e => e.classList.remove(className))
  /**
  * Toggle a class from selected elements
  * @param {String} className The class name to toggle
  */
  this.toggleClass = className => this.each(e => e.classList.toggle(className))
  /**
  * Attach an event listener with a callback to the selected elements
  * Automatically removes listner if it already exists to avoid duplicates
  * @param {String}   event    Name of event, eg. "click", "mouseover", etc...
  * @param {Function} callback The function to call when the event is triggered
  */
  this.on = (event, fn) => {
    this.each(e => {
      e.removeEventListener(event, fn, false)
      e.addEventListener(event, fn, false)
    })
  }
  /**
  * Remove an event listener with a callback to the selected elements
  * @param {String}   event    Name of event, eg. "click", "mouseover", etc...
  * @param {Function} callback The function to call when the event is triggered
  */
  this.off = (event, fn) => this.each(e => e.removeEventListener(event, fn, false))
}

Query.prototype = Array.prototype

let $ = selector => {
  var collection = new Query()
  if (selector.nodeType) {
    collection.push(selector)
  } else {
    collection.push(...document.querySelectorAll(selector))
  }
  return collection
}

export default $
