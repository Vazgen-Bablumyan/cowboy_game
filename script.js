const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const backgroundImg = document.createElement("img")
backgroundImg.src = "https://t4.ftcdn.net/jpg/03/34/19/13/360_F_334191354_zW1Fj9HPbfJdBPEVe2d6mcuT1w2g8K5y.jpg"

const cowboyImg = document.createElement("img")
cowboyImg.src = "https://static.vecteezy.com/system/resources/previews/001/208/900/non_2x/cowboy-png.png"

const bulletImg = document.createElement("img")
bulletImg.src = "https://pngimg.com/uploads/bullets/bullets_PNG35545.png"

const opponentImg = document.createElement("img")
opponentImg.src = "https://www.pngplay.com/wp-content/uploads/12/Cowboy-PNG-Photo-Clip-Art-Image.png"

const stabAudio = document.createElement("audio")
stabAudio.src = "https://www.soundjay.com/human/sounds/man-scream-ahh-01.mp3 "

const shootingSound = document.createElement("audio")
shootingSound.src = "https://www.soundjay.com/mechanical/sounds/gun-gunshot-01.mp3"

let data = {
    cowboy: {
        xDelta: 0,
        yDelta: 0,
        x: 10,
        y: 160,
        width: 100,
        height: 200
    },
    bullets: [],
    opponents: []

}

function intersect(rect1, rect2) {
    const x = Math.max(rect1.x, rect2.x),
        num1 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width),
        y = Math.max(rect1.y, rect2.y),
        num2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height)
    return (num1 >= x && num2 >= y)
}

function update() {
    data.cowboy.x += data.cowboy.xDelta
    data.cowboy.y += data.cowboy.yDelta

    data.bullets.forEach(function (bullet) {
        data.opponents.forEach(function (opponent) {
            if (intersect(opponent, bullet)) {
                stabAudio.currentTime = 0
                stabAudio.play()
                bullet.deleteMe = true
                opponent.deleteMe = true
            }
        })
    })

    data.bullets = data.bullets.filter(function (bullet) {
        return bullet.deleteMe !== true
    })
    data.opponents = data.opponents.filter(function (opponent) {
        return opponent.deleteMe !== true
    })

    data.bullets.forEach(function (bullet) {
        bullet.x += bullet.xDelta
    })

    data.bullets = data.bullets.filter(function (bullet) {
        if (bullet.x > canvas.width) {
            return false
        }
        return true
    })

    data.opponents.forEach(function (opponent) {
        opponent.x += opponent.xDelta
    })

    if (data.opponents.length === 0) {
        data.opponents.push({
            xDelta: -1,
            x: canvas.width - 100,
            y: data.cowboy.y + 15,
            width: 250,
            height: 200
        })
    }

}

function draw() {
    context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)
    context.drawImage(cowboyImg, data.cowboy.x, data.cowboy.y, data.cowboy.width, data.cowboy.height)

    data.bullets.forEach(function (bullet) {
        context.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height)
    })

    data.opponents.forEach(function (opponent) {
        context.drawImage(opponentImg, opponent.x, opponent.y, opponent.width, opponent.height)
    })
}

function loop() {
    requestAnimationFrame(loop)
    update()
    draw()
}

loop()

document.addEventListener("keydown", function (evt) {
    if (evt.code === "ArrowRight") {
        data.cowboy.xDelta = 5;
    } else if (evt.code === "ArrowLeft") {
        data.cowboy.xDelta = -5
    } else {
        shootingSound.currentTime = 0
        shootingSound.play()
        data.bullets.push({
            xDelta: 5,
            x: data.cowboy.x + data.cowboy.width,
            y: data.cowboy.y + 41,
            width: 10,
            height: 10
        })

    }
})

document.addEventListener("keyup", function (evt) {
    data.cowboy.xDelta = 0
})