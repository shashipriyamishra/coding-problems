(function (window) {
  'use strict';

  var app = {},
    proto = document.querySelector('.proto'),
    movers,
    bodySize = document.body.getBoundingClientRect(),
    ballSize = proto.getBoundingClientRect(),
    maxHeight = Math.floor(bodySize.height - ballSize.height),
    maxWidth = Math.floor(bodySize.width - ballSize.width),
    incrementor = 10,
    distance = 3,
    frame,
    minimum = 100,
    subtract = document.querySelector('.subtract'),
    add = document.querySelector('.add');

  app.optimize = false;
  app.count = minimum;
  app.enableApp = true;

  app.init = function () {
    if (movers) {
      bodySize = document.body.getBoundingClientRect();
      for (var i = 0; i < movers.length; i++) {
        document.body.removeChild(movers[i]);
      }
      document.body.appendChild(proto);
      ballSize = proto.getBoundingClientRect();
      document.body.removeChild(proto);
      maxHeight = Math.floor(bodySize.height - ballSize.height);
      maxWidth = Math.floor(bodySize.width - ballSize.width);
    }
    for (var i = 0; i < app.count; i++) {
      var m = proto.cloneNode();
      m.style.left = maxWidth * Math.random() + 'px';
      m.style.top = maxHeight * Math.random() + 'px';
      document.body.appendChild(m);
    }
    movers = document.querySelectorAll('.mover');
  };

  app.update = function (timestamp) {
    for (var i = 0; i < app.count; i++) {
      var m = movers[i];
      if (!app.optimize) {
        var top = m.classList.contains('down') ? m.offsetTop + distance : m.offsetTop - distance;
        var left = m.classList.contains('right') ? m.offsetLeft + distance : m.offsetLeft - distance;
        if (top < 0) top = 0;
        if (top > maxHeight) top = maxHeight;
        m.style.top = top + 'px';
        if (left < 0) left = 0;
        if (left > maxWidth) left = maxWidth;
        m.style.left = left + 'px';
        if (m.offsetTop === 0) {
          m.classList.remove('up');
          m.classList.add('down');
        }
        if (m.offsetTop === maxHeight) {
          m.classList.remove('down');
          m.classList.add('up');
        }
        if (m.offsetLeft === 0) {
          m.classList.remove('left');
          m.classList.add('right');
        }
        if (m.offsetLeft === maxWidth) {
          m.classList.remove('right');
          m.classList.add('left');
        }
      } else {
        // Optimised code here
        var topStyle = m.offsetTop;
        var leftStyle = m.offsetLeft;
        var top = m.classList.contains('down') ? topStyle + distance : topStyle - distance;
        var left = m.classList.contains('right') ? leftStyle + distance : leftStyle - distance;
        if (top < 0) top = 0;
        if (top > maxHeight) top = maxHeight;
        m.style.top = top + 'px';
        if (left < 0) left = 0;
        if (left > maxWidth) left = maxWidth;
        m.style.left = left + 'px';
        if (topStyle === 0) {
          // m.classList.toggle("up");
          m.classList.remove('up');
          m.classList.add('down');
        }
        if (topStyle === maxHeight) {
          // m.classList.toggle("down");
          m.classList.remove('down');
          m.classList.add('up');
        }
        if (leftStyle === 0) {
          // m.classList.toggle("left");
          m.classList.remove('left');
          m.classList.add('right');
        }
        if (leftStyle === maxWidth) {
          // m.classList.toggle("right");
          m.classList.remove('right');
          m.classList.add('left');
        }
      }
    }
    frame = window.requestAnimationFrame(app.update);
  }

  document.querySelector('.stop').addEventListener('click', function (e) {
    if (app.enableApp) {
      cancelAnimationFrame(frame);
      e.target.textContent = 'Start';
      app.enableApp = false;
    } else {
      frame = window.requestAnimationFrame(app.update);
      e.target.textContent = 'Stop';
      app.enableApp = true;
    }
  });

  document.querySelector('.optimize').addEventListener('click', function (e) {
    if (e.target.textContent === 'Optimize') {
      app.optimize = true;
      e.target.textContent = 'Un-Optimize';
    } else {
      app.optimize = false;
      e.target.textContent = 'Optimize';
    }
  });

  add.addEventListener('click', function (e) {
    cancelAnimationFrame(frame);
    app.count += incrementor;
    subtract.disabled = false;
    app.init();
    frame = requestAnimationFrame(app.update);
  });

  subtract.addEventListener('click', function () {
    cancelAnimationFrame(frame);
    app.count -= incrementor;
    app.init();
    frame = requestAnimationFrame(app.update);
    if (app.count === minimum) {
      subtract.disabled = true;
    }
  });

  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  var onResize = debounce(function () {
    if (app.enableApp) {
      cancelAnimationFrame(frame);
      app.init();
      frame = requestAnimationFrame(app.update);
    }
  }, 500);

  window.addEventListener('resize', onResize);

  add.textContent = 'Add ' + incrementor;
  subtract.textContent = 'Subtract ' + incrementor;
  document.body.removeChild(proto);
  proto.classList.remove('.proto');
  app.init();
  window.app = app;
  frame = window.requestAnimationFrame(app.update);

})(window);
