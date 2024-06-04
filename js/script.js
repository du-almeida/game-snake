const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");


const audio = new Audio('../assets/audio.mp3')

const size = 30;

//posição inicial Snake
const initialPosition = { x: 270, y: 240 }


let snake = [initialPosition];

const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

//Gerar números aleatório com um valor mínimo e um máximo (tipo...entre 5 e 10), para mover o food
const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

//posicionar o food em um número aleaório multiplo de 30(tamanho do food) 
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size) //número aleatório
    return Math.round(number / 30) * 30 //retornar um número inteiro multiplo de 30
}

//food gera cor aléatória ao mudar de posição
const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);

    return `rgb(${red}, ${green}, ${blue})`
}


//config food
const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor(),
}

//direção movimento snake
let direction, loopId

//desenho food
const drawFood = () => {

    const { x, y, color } = food;

    ctx.shadowColor = color
    ctx.shadowBlur = 3
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

//desenho Snake
const drawSnake = () => {
    ctx.fillStyle = "#ddd";//cor corpo snake

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "purple";
        } //cor cabeça snake, considerando o último desenho como cabeça

        ctx.fillRect(position.x, position.y, size, size)
    });
};

//movimento snake
const moveSnake = () => {
    if (!direction) return //Se não tiver nada informando a direção, pule para o final da função e a snake fica parada

    const head = snake[snake.length - 1]; //posição da cabeça, em movimento


    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y }) //adição da cabeça conforme a direção (direita)
    } //movimento do corpo

    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y }) //adição da cabeça conforme a direção (esquerda)
    } //movimento do corpo

    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size }) //adição da cabeça conforme a direção (baixo)
    } //movimento do corpo
    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size }) //adição da cabeça conforme a direção (cima)
    } //movimento do corpo


    snake.shift()//remover o primeiro elemento e coloca na última posição, fazendo o snake mudar de posição

};

//desenho grid
const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < canvas.width; i += 30) {
        //linhas na vertical
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke()

        //linhas na horizontal
        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke()
    }

}

//comer food + acrescentar ao corpo + não gerar food na mesma posição snake
const chackEat = () => {
    const head = snake[snake.length - 1];

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        //loop de verificação para que o food não seja criado na mesmo posição da snake
        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        };
        ///---////
        //criar food a partir da verificação acima
        food.x = x
        food.y = y
        food.color = randomColor()
    }


}

//fim de jogo - bater na borda ou bater no próprio corpo
const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2


    //colisão parede
    const wallCollision =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

//tela game over
const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"

}

//rodar o jogo em loop
const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600) //limpar a tela

    drawGrid(); //grid
    drawFood(); //comida
    moveSnake(); //mover
    drawSnake(); //desenhar
    chackEat(); //Acrescentar food ao corpo
    checkCollision(); //Fim de jogo, colisão


    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}

gameLoop()

//ativação e movimentação snake com a direção do teclado
document.addEventListener("keydown", ({ key }) => {

    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }

    if (key == "ArrowDown" && direction != "down") {
        direction = "down"
    }

    if (key == "ArrowUp" && direction != "up") {
        direction = "up"
    }

})

//Reset pós game over
buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})