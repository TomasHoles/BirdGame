// Získání elementu canvas a jeho 2D kreslícího kontextu
const canvas = document.getElementById('dinoCanvas');
    const ctx = canvas.getContext('2d');

    // Definice objektu dinosaura s jeho počátečními vlastnostmi
    const dino = {
      x: 100, // Počáteční pozice X dinosaura
      y: canvas.height - 125, // Počáteční pozice Y dinosaura
      width: 130, // Šířka dinosaura
      height: 120, // Výška dinosaura
      imageUrl: 'img/ptak.png',   // Adresa obrázku dinosaura
      jumping: false,  // Indikátor, zda dino skáče
      jumpHeight: 300, // Výška skoku dinosaura
      jumpCount: 0, // Počítadlo skoků dinosaura
      speed: 4, // Rychlost pohybu dinosaura
      score: 0,
      highestScore: 0,
    };

    // Inicializace pole pro ukládání překážek
    const obstacles = [];

    // Vytvoření objektu obrázku pro dinosaura

    const dinoImage = new Image();
    dinoImage.src = dino.imageUrl;

    // Funkce pro vykreslení dinosaura na plátno
    function drawDino() {
      ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
    }

    // Funkce pro vykreslení překážek na plátno
    function drawObstacles() {
  for (const obstacle of obstacles) {
    const obstacleImage = new Image();
    obstacleImage.src = obstacle.imageUrl;

    ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  }
}

// Funkce pro vykreslení aktuálního skóre na plátno

function drawScore() {
  ctx.font = "50px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(`Score: ${dino.score.toFixed(1)}`,  canvas.width / 2 - 500, 100);
}

// Funkce pro vykreslení nejvyššího dosaženého skóre na plátno
function drawHighestScore() {
  ctx.font = "50px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(`Highest Score: ${dino.highestScore.toFixed(1)}`, canvas.width / 2 + 50, 100);
}

// Funkce pro generování nové překážky
function generateObstacle() {
  const minSpacing = 160*dino.speed;
  
    // Určení minimální pozice X pro novou překážku
  const minX = Math.max(canvas.width, ...obstacles.map(obstacle => obstacle.x + obstacle.width + minSpacing)); //Určuje minimální pozici x pro novou překážku. Používá metodu Math.max k nalezení maximální hodnoty z pole, kde prvním prvkem je šířka canvasu a ostatní prvky jsou pozice x konců existujících překážek plus mezara.

   // Vytvoření objektu pro novou překážku
  const obstacle = {
    x: minX,
    y: canvas.height - 130,
    width: 100,
    height: 130,
    imageUrl: 'https://cdn.pixabay.com/photo/2018/04/20/09/37/wind-turbine-3335541_960_720.png', 
    speed: 3,
  };
  obstacles.push(obstacle);
}

// Funkce pro pohyb překážek
function moveObstacles() {
  for (const obstacle of obstacles) {
    obstacle.x -= dino.speed; 
  }

    // Odstranění překážek, které opustily plátno
  obstacles.forEach((obstacle, index) => {
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
    }
  });
}

// Funkce pro kontrolu kolizí s překážkami
    function checkCollisions() {
      for (const obstacle of obstacles) {
        if (
          dino.x < obstacle.x + obstacle.width &&
          dino.x + dino.width > obstacle.x &&
          dino.y < obstacle.y + obstacle.height &&
          dino.y + dino.height > obstacle.y
        ) {
          alert('Game Over!');  // Zobrazení upozornění o konci hry
          resetGame();  // Restartování hry
        }
      }
    }

    function resetGame() {
      dino.y = canvas.height - 125;  // Nastavení počáteční pozice Y dinosaura
      obstacles.length = 0; // Vyprázdnění pole překážek
      dino.score = 0; // Nastavení počátečního skóre
      dino.speed = 4; // Nastavení počáteční rychlosti dinosaura
      
    }

    // Hlavní herní smyčka
    function gameLoop() {
       // Vymazání obsahu plátna
      ctx.clearRect(0, 0, canvas.width, canvas.height);

       // Vykreslení dinosaura, překážek, pohyb překážek a kontrola kolizí
      drawDino();
      drawObstacles();
      moveObstacles();
      checkCollisions();

        // Zvýšení rychlosti hry a skóre
      if (Math.random() < 0.005) {
    dino.speed += 0.25;
  }
  dino.score += dino.speed / 10;

  // Aktualizace nejvyššího dosaženého skóre
  if (dino.score > dino.highestScore) {
    dino.highestScore = dino.score;
  }

   // Vykreslení aktuálního skóre a nejvyššího dosaženého skóre
  drawScore(); 
  drawHighestScore(); 

   // Pohyb dinosaura při skoku
      if (dino.jumping) {
        dino.y -= 5;
        dino.jumpCount += 5;

        // Ukončení skoku po dosažení maximální výšky
        if (dino.jumpCount >= dino.jumpHeight) {
          dino.jumping = false;
        }
      } else if (dino.y < canvas.height - dino.height) {
        // Snížení dinosaura po skončení skoku
        dino.y += 5;
      }

       // Generování nové překážky s malou pravděpodobností
      if (Math.random() < 0.01) {
        generateObstacle();
      }

       // Vykreslení herní smyčky pomocí animačního rámce
      requestAnimationFrame(gameLoop);
    }

    // Přidání posluchače události stisknutí klávesy pro skok
    document.addEventListener('keydown', jump);

    // Funkce pro reakci na stisk klávesy pro skok
    function jump(event) {
      if (event.key === ' ' && !dino.jumping && dino.y === canvas.height - dino.height) {
        dino.jumping = true;
        dino.jumpCount = 0;
      }
    }
    



  // Spuštění herní smyčky
  requestAnimationFrame(gameLoop);

    gameLoop();