const lineElem = document.querySelector("#line"),
    girlElem = document.querySelector("#girl"),
    boyElem = document.querySelector("#boy"),
    taskElem = document.querySelector("#task"),
    optionsElem = document.querySelector("#options"),
    messageElem = document.querySelector("#message");

let pathLenght,
    pathFinish,
    girlPosition,
    pathDelta,
    girlSpeed,
    boySpeed,
    options,
    namesGirl = ["Маша", "Валя", "Вика", "Лена", "Света", "Юля", "Катя", "Оля"],
    namesBoy = ["Ваня", "Игорь", "Лёша", "Юра", "Дима", "Влад", "Олег"];

function getRandom(min, max) {
    return Math.floor(Math.random() * (1 + max - min)) + min;
}

function startGame() {
    resetElems();

    boySpeed = getRandom(3, 6);
    girlSpeed = getRandom(boySpeed + 1, boySpeed * 2 + 1);

    let random = getRandom(14, 21);

    girlPosition = Math.round(
        random * (girlSpeed - getRandom(girlSpeed / 4, girlSpeed / 2)),
    );
    pathDelta = (girlSpeed - boySpeed) * random;
    pathFinish = boySpeed * random;
    pathLenght = girlPosition + pathDelta + pathFinish;

    messageElem.innerHTML = "";

    setPosition(girlElem, girlPosition);
    setPosition(boyElem, girlPosition + pathDelta);
    setOptions();
    setTask();
}

function resetElems() {
    girlElem.classList.remove("active");
    girlElem.style.transitionDuration = "";
    boyElem.classList.remove("active");
    boyElem.style.transitionDuration = "";
    let inputs = Array.from(
        document.forms["game"].querySelectorAll('input[name="option"]'),
    );
    inputs.forEach((elem) => (elem.disabled = false));
}

function setPosition(elem, position) {
    elem.style.left = (position / pathLenght) * 100 + "%";
}

function setOptions() {
    let correctAnswer = girlSpeed;
    options = [correctAnswer];
    for (let i = 0; i < 3; i++) {
        options.push(
            Math.round(
                (Math.round(Math.random()) + Math.random()) * correctAnswer,
            ),
        );
    }
    options.sort(() => Math.random() - 0.5);
    fillValues();
}

function setTask() {
    let girlName = namesGirl[getRandom(0, namesGirl.length - 1)];
    let boyName = namesBoy[getRandom(0, namesBoy.length - 1)];
    taskElem.innerHTML = `<b class="value">${girlName}</b> участвует в велогонке.
    Длина гоночной трассы <i class='value'>S = ${pathLenght} м</i>.
    Она уже успела проехать <i class='value'>S<sub>1</sub> = ${girlPosition} м</i> и занимает вторую позицию.<br>
    Ей осталось обогнать только одного человека, это <b class="value">${boyName}</b>, которому осталось до финиша <i class='value'>S<sub>2</sub> = ${pathFinish} м</i>,
    и он едет со скоростью <i class='value'>V<sub>2</sub> = ${boySpeed} м/с</i>.<br>
    С какой скоростью <i class="value">V<sub>1</sub> - ? м/с</i> ей нужно ехать, чтобы красиво догнать его у самого финиша?`;
}

function fillValues() {
    let result = `<legend>С какой скоростью нужно ему ехать?</legend>`;
    for (let i = 0; i < options.length; i++) {
        result += `<label><input type="radio" name="option" value="${options[i]}">${options[i]} м/c.</label>`;
    }
    optionsElem.innerHTML = result;
}

function submitAnswer() {
    let answer = document.forms["game"].querySelector(
        'input[name="option"]:checked',
    );
    if (answer) {
        let message = "";
        let value = +answer.value;
        let girlTime = (pathLenght - girlPosition) / value;
        let boyTime = pathFinish / boySpeed;

        girlElem.classList.add("active");
        girlElem.style.transitionDuration = girlTime / 10 + "s";
        boyElem.classList.add("active");
        boyElem.style.transitionDuration = boyTime / 10 + "s";

        messageElem.innerHTML = "";
        let inputs = Array.from(
            document.forms["game"].querySelectorAll('input[name="option"]'),
        );
        inputs.forEach((elem) => (elem.disabled = true));
        if (value === girlSpeed) {
            message = `Правильно! Хочешь попробовать ещё раз?`;
        } else if (value < girlSpeed) {
            message = `Увы <i class="fa fa-light fa-face-sad-tear"></i>. Она не успела. Попробуй ещё раз!`;
        } else {
            message = `В гонке она победила! Но тренер недоволен, что не получилось красивой победы перед финишем. Попробуй ещё раз!`;
        }

        setTimeout(
            () => {
                messageElem.innerHTML = `<h1>${message}</h1>`;

                setTimeout(resetElems, 1000);
            },
            Math.min(boyTime * 100, girlTime * 100),
        );
    }
}

document.querySelector("#submit").addEventListener("click", submitAnswer);
document.querySelector("#reset").addEventListener("click", startGame);

startGame();
