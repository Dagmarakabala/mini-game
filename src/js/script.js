import customSelect from "custom-select";

window.onload = function () {
  initSelect(".select");
  events();
};

function initSelect(elem) {
  customSelect(elem);
}
function events() {
  let indexes = [];
  document.getElementById("reset-game").addEventListener("click", () => {
    indexes = resetGame(indexes);
  });
  document
    .getElementById("start-game")
    .addEventListener("click", () => initGame("select-rounds", indexes));
}
function initGame(selectId, indexes) {
  if (indexes.length === 0) {
    let rounds = document.getElementById(selectId).value;
    createProgressDots(".progressBox__left", rounds);
    createProgressDots(".progressBox__right", rounds);
    gameStep(
      indexes,
      document.querySelectorAll(".board__left .board__item").length,
      rounds,
      true
    );
  }
}
function createProgressDots(element, rounds) {
  for (let i = 0; i < rounds; i++) {
    let children = document.createElement("div");
    children.classList = "progressBox__dot";
    document.querySelector(element).append(children);
  }
}
function colorProgressDots(elements, currentIndex) {
  elements.forEach((item, index) => {
    if (index <= currentIndex) {
      item.classList.add("progressBox__dot-active");
    }
  });
}
function getNewTilesIndex(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function gameStep(indexes, tiles, rounds, next) {
  if(next) {
    indexes.push(getNewTilesIndex(0, tiles - 1));
  }
  colorProgressDots(
    document.querySelectorAll(".progressBox__left .progressBox__dot"),
    indexes.length - 1
  );
  if (indexes.length - 1 < rounds) {
    gameOnLeftSide(indexes, () => gameOnRightSide(indexes, tiles, rounds));
  }
}
function gameOnLeftSide(indexes, _callback) {
  indexes.forEach((item, index) => {
    setTimeout(() => {
      document
        .querySelectorAll(".board__left .board__item")
        [item].classList.add("board__item-active");
      setTimeout(() => {
        document
          .querySelectorAll(".board__left .board__item")
          [item].classList.remove("board__item-active");
        if (index == indexes.length - 1) {
          _callback();
        }
      }, 499);
    }, 500 * index);
  });
}

function gameOnRightSide(indexes, tiles, rounds) {
  let counter = [];
  document
    .querySelectorAll(".board__right .board__item")
    .forEach((item, index) => {
      item.addEventListener("click", (e) =>
        checkClickOnBoard(e, counter, index, indexes, tiles, rounds)
      );
    });
}
function checkClickOnBoard(e, counter, index, indexes, tiles, rounds) {
  if (indexes[counter.length] == index) {
    counter.push(true);
    let tile = e.currentTarget;
    tile.classList.add("board__item-active");
    setTimeout(() => {
      tile.classList.remove("board__item-active");
    }, 500);
    if (counter.length === indexes.length) {
      colorProgressDots(
        document.querySelectorAll(".progressBox__right .progressBox__dot"),
        indexes.length - 1
      );

      if (counter.length < rounds) {
        setTimeout(() => {
          clearRightBoard();
          counter = [];
          gameStep(indexes, tiles, rounds, true);
        }, 500);
      } else {
        setTimeout(() => {
          clearRightBoard();
          let message = document.createElement("div");
          message.classList = "message";
          message.innerHTML = `<h2 class="message__title">Zadanie ukończone</h2><p class="message__text">Ilość rund: ${rounds}!</p><p class="message__smallText">(Kliknij na wiadomość aby ją zamknąć)</p>`;
          document.body.append(message);
          message.addEventListener("click", () => {
            message.remove();
            document.getElementById("reset-game").click();
          });
        }, 500);
      }
    }
  } else {
    e.currentTarget.classList.add("board__item-error");
    setTimeout(() => {
      gameStep(indexes, tiles, rounds, false);
      clearRightBoard();
    }, 100);
  }
}
function clearRightBoard() {
  document
    .querySelectorAll(".board__right .board__item")
    .forEach((item, index) => {
      item.remove();
      let newItem = document.createElement("div");
      newItem.classList = "board__item";
      document.querySelector(".board__right").append(newItem);
    });
}
function resetGame() {
  clearRightBoard();
  document.querySelectorAll(".progressBox__dot").forEach((item, index) => {
    item.remove();
  });
  return [];
}
