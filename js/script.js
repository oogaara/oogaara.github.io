const binaryRain = document.getElementById('binaryRain');
    const characters = "01";
    let columns = Math.floor(window.innerWidth / 15);
    
    function createBinaryRain() {
      columns = Math.floor(window.innerWidth / 15);
      binaryRain.innerHTML = '';
      
      for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.style.position = 'absolute';
        column.style.top = '0';
        column.style.left = (i * 15) + 'px';
        column.style.width = '15px';
        column.style.height = '100%';
        column.style.color = 'rgba(255, 255, 255, 0.3)';
        column.style.fontSize = '18px';
        column.style.fontFamily = "'Major Mono Display', monospace";
        column.style.lineHeight = '1.2';
        column.style.wordBreak = 'break-all';
        column.style.textAlign = 'center';
        
        let text = '';
        const length = Math.floor(Math.random() * 30) + 10;
        for (let j = 0; j < length; j++) {
          text += characters.charAt(Math.floor(Math.random() * characters.length));
          text += '\n';
        }
        
        column.textContent = text;
        binaryRain.appendChild(column);
        
        animateColumn(column);
      }
    }
    
    function animateColumn(column) {
      let position = -100;
      const speed = 1 + Math.random() * 1;
      
      function move() {
        position += speed;
        column.style.transform = `translateY(${position}px)`;
        
        if (position > window.innerHeight) {
          position = -200;
          // Regenerate random binary
          let text = '';
          const length = Math.floor(Math.random() * 30) + 10;
          for (let j = 0; j < length; j++) {
            text += characters.charAt(Math.floor(Math.random() * characters.length));
            text += '\n';
          }
          column.textContent = text;
        }
        
        requestAnimationFrame(move);
      }
      
      move();
    }
    
    window.addEventListener('resize', createBinaryRain);
    createBinaryRain();