//@ts-check


export const toast = {

   top: -2,
   step: 4,
   exists: [],

   forceClose(_note) {
      if (!_note.parentElement) return this.gc(_note);

      this.top -= this.step;
      clearTimeout(+_note.id);
      _note.parentElement?.removeChild(_note);

      this.gc(_note);
   },

   closeAll() {
      this.exists.forEach(this.forceClose, this);
      this.exists = []
   },

   /**
    * @param {HTMLElement} _note
    */
   gc(_note) {
      const index = this.exists.indexOf(_note);
      if (~index)
         this.exists.splice(index, 1);
   },

   /**
    * @param {string} text
    */
   show(text) {

      const self = this;
      
      const note = document.body.appendChild(document.createElement('div'));
      note.className = 'notification';
      note.innerHTML = text.replace('`', '<span>').replace('`', '</span>');
      
      this.exists.push(note);

      const closeBtn = note.appendChild(document.createElement('div'));

      closeBtn.className = 'close';
      closeBtn.textContent = '+'
      closeBtn.onclick = () => {
         note.style.bottom = '-3em'
         note.style.opacity = '0';
         setTimeout(() => self.forceClose.bind(self, note), 1000)
      }

      
      note.onclick = (event) => console.log(event.target['textContent']);
      note.onmouseleave = () => !note.id && smoothClosing(5);
      note.onmouseenter = () => {
         note.style.opacity = '1';
         if (note.id) {
            clearTimeout(+note.id)
            note.id = ''
         }
      }

      setTimeout(() => {
         note.style.opacity = '1';
         note.style.bottom = (this.top += self.step) + 'em';
      })
      
      let closeToast = smoothClosing();
      
      return note;


      /** @param {number} [timeout] */
      function smoothClosing(timeout) {
         
         const preClose = setTimeout(() => {
            note.style.opacity = '.25';

            closeToast = setTimeout(() => {
               note.parentElement?.removeChild(note);
               self.top -= self.step;
               // console.log(self.top);
            }, 3500);
            note.id = '' + closeToast;

         }, timeout || 1500);

         note.id = '' + preClose;
         return preClose;
      }      
   }

}


// setTimeout(() => toast('ok `19:2` corrupt'), 1500)
