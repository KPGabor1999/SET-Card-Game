import Player from "./Player.js";
import Card from "./Card.js";

function init(){
    const mainMenu = document.querySelector('#titleScreen')
    mainMenu.toggleAttribute('hidden')
    const gameLogo = document.querySelector('#gameLogo')
    gameLogo.toggleAttribute('hidden')

    const setPlayers = document.querySelector('#setNumberOfPlayers')
    let numberOfPlayers = setPlayers.value
    const setPlayerNames = document.querySelector('#setPlayerNames')
    setPlayerNames.toggleAttribute('hidden')                            //először láthatóvá tesszük a div-et

    for(let i=1; i<=numberOfPlayers; i++){                              //majd benneláthatóvá tesszük az első input mezőt
        setPlayerNames.innerHTML += `<span>${i}. játékos neve:</span><input type="text"  name="playerName" value="Játékos${i}"></br>`
    }

    setPlayers.addEventListener('change', showPlayerNames)

    function showPlayerNames(){     //ahogy változik a beállított játékosok száma, úgy generáljuk újra az inputmezőket
        console.log('Bejutott')
        setPlayerNames.innerHTML = ''
        numberOfPlayers = setPlayers.value
        for(let i=1; i<=numberOfPlayers; i++){
            setPlayerNames.innerHTML += `<span>${i}. játékos neve:</span><input type="text" name="playerName" value="Játékos${i}"></br>`    //placeholder is lehetne default értékhelyett
        }
    }
    
    const setGameMode = document.querySelectorAll('[name="setGameMode"]')
    setGameMode.forEach( radioBtn => radioBtn.addEventListener('input', displayMoreOptions) )   //összefüggő radio gombok összefogása
    
    moreOptions.toggleAttribute('hidden')

    const startGameBtn = document.querySelector('#startGameBtn')
    startGameBtn.addEventListener('click', startGame)
}

function displayMoreOptions(){
    const moreOptions = document.querySelector('#moreOptions')
    if(this.value === "practice"){
        moreOptions.hidden = false;
    } else {
        moreOptions.hidden = true;
    }
}

function startGame(){
    //Játékbeállítások beolvasása
    const setPlayers = document.querySelector('#setNumberOfPlayers')
    const playerNames = document.querySelectorAll('[name="playerName"]')
    const practiceMode = document.querySelector('#practiceMode')
    const hasSetBtn = document.querySelector('#hasSetBtnEnabled')
    const showSetBtn = document.querySelector('#showSetBtnEnabled')
    const CardAddition = document.querySelector('#manual3CardAddition')

    let numberOfPlayers = setPlayers.value
    let gameMode
    let hasSetBtnEnabled
    let showSetBtnEnabled
    let ThreeCardAddition

    if(practiceMode.checked){
        gameMode = "practice"
        hasSetBtnEnabled = hasSetBtn.checked
        showSetBtnEnabled = showSetBtn.checked
        if(CardAddition.checked){
            ThreeCardAddition = "manual"
        } else {
            ThreeCardAddition = "automatic"
        }
    } else {
        gameMode = "competitive"
        hasSetBtnEnabled = false
        showSetBtnEnabled = false
        ThreeCardAddition = "automatic"
    }

    //Főmenü befejezése, beolvasott adatok deuggolása
    const mainMenu = document.querySelector("#mainMenu")
    mainMenu.toggleAttribute('hidden')
    const gameLogo = document.querySelector('#gameLogo')
    gameLogo.toggleAttribute('hidden')


    console.log("Game settings")
    console.log(`Numer of players: ${numberOfPlayers}`)
    console.log(`Game mode: ${gameMode}`)
    console.log(`Has SET button enabled: ${hasSetBtnEnabled}`)
    console.log(`Show SET button enabld: ${showSetBtnEnabled}`)
    console.log(`3 Card addition: ${ThreeCardAddition}`)
    
    //Időmérő létrehozása: csak a megfelelő játékmódokban jön létre
    let timePassed = 0
    const timer = document.querySelector('#timer')
    let gameTimer = null
    const rightGameMode = (gameMode === 'practice' && numberOfPlayers > 1) || (gameMode === 'competitive' && numberOfPlayers == 1)

    if(rightGameMode){
        timer.toggleAttribute('hidden')
        gameTimer = setInterval(refreshTime, 1000)
    }

    function refreshTime(){
        timePassed++;
        timer.innerHTML = `Eltelt idő: ${timePassed} másodperc`
    }

    //Pontjelző tábla létrehozása
    const scoreboard = document.querySelector('#scoreboard')    //A táblázatot majd minden pontozáskor frissíteni kell.
    scoreboard.innerHTML = ''
    const players = []                                          //Játékosok referenciatömbje.

    if(numberOfPlayers <= 5){
        scoreboard.innerHTML += `<tr>${generateScoreBoardRow(1,numberOfPlayers, players)}</tr>`         //dinamikus táblázat sor generálás
    }
    if(numberOfPlayers > 5) {
        scoreboard.innerHTML += `<tr>${generateScoreBoardRow(1, 5, players)}</tr>`
        scoreboard.innerHTML += `<tr>${generateScoreBoardRow(6, numberOfPlayers, players)}</tr>`
    }

    function generateScoreBoardRow(start, end, referenceArray){
        let players = ''
        for(let i = start; i<=end; i++){
            let currentPlayer = new Player(playerNames[i-1].value);         //név szerint hozzuk létre a játákosokat                                           //Minden körben létrehozunk egy új játékost...
            referenceArray.push(currentPlayer)                              //...hozzáadjuk a referenciatömbhöz...
            players += `<td name="playerScore" id="${i}" class="unSelectedPlayer">${currentPlayer.name}: ${referenceArray[i-1].score}</td>`             //...majd beszervezzük a táblázatba.
        }
        return players
    }

    //Játéktábla létrehozása, kártyák beolvasása és lerakása

    const cardDeck = []
    //const filters = ['H', 'O', 'S']
    const colors = ['g', 'p', 'r']
    const shapes = ['D', 'P', 'S']

    let cardsCount = 0
    for(let i = 1 ; i<=3; i++){             //multiplicitás
        //for(let j = 0; j<3; j++){         //kitöltés (ezt most még ne használjuk, de így kéne)
            for(let k = 0; k<3; k++){       //szín
                for(let l = 0; l<3; l++){   //forma
                    let currentID = `${i}${'S'}${colors[k]}${shapes[l]}`
                    cardDeck.push(new Card(currentID))
                }
            }
        //}
    }
    console.log(cardDeck.length)

    shuffle(cardDeck)

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {    //hátrafelé végiglépked az elemeken
          let j = Math.floor(Math.random() * (i + 1));  //minden indexhez véletlenül választ egy másikat
          [array[i], array[j]] = [array[j], array[i]];  //és megcseréli a két helyen lévő elemet
        }
    }

    for(const currentCard of cardDeck){
        console.log(currentCard.cardID)
    }

    const gameGrid = document.querySelector('#gameGrid')

    generateGameGrid(3, 4)                              //+ Az add3Cards művelet generálhat még egy sort.

    function generateGameGrid(width, height){           //lerakjuk a kártyákat egy megadott méretű táblázatba és ki is vesszük őket a pakliból
        let tableContent = ''
        for(let i = 1; i<=height; i++){
            let tableRowContent = ''
            for(let j=0; j<width; j++){
                tableRowContent += `<td width="80px" id="laidOutCard"><img  width="80px" name="card" class="unSelectedCard" id="${cardDeck[0].cardID}" src="cards/${cardDeck[0].cardID}.svg"></td>`
                cardDeck.shift()
            }
            tableContent += `<tr>${tableRowContent}</tr>`
        }
        gameGrid.innerHTML = tableContent
        console.log(`Pakliban maradt: ${cardDeck.length} kártya.`)
    }

    gameGrid.toggleAttribute('hidden')
    

    //Játékos kiválasztása, kártyák kijelölése, SET-ek detektálása, pontozás, játékállás frissítése, játék leállítása
    //      ->Innentől jönnek a tényleges játékmechanikák megvalósításai
    let currentPlayer = null
    let roundTimer = null
    if(numberOfPlayers > 1){
        scoreboard.addEventListener('click', selectPlayer)
    } else {
        currentPlayer = players[0];
        const currentPlayerScore = document.querySelector('[name="playerScore"]')
        currentPlayerScore.setAttribute('class', 'selectedPlayer')
        const laidOutCards = document.querySelectorAll('#laidOutCard')
        startRound()
        /*while(hasSet(laidOutCards)){
            console.log('új kört indít')
            startRound()
        }*/
    }

    function selectPlayer(event){                           //Válasszuk ki a kattintott játékost, ha még nincs kiválasztva és kezdjük el a körét
        const selectedPlayer = event.target
        if(selectedPlayer.matches('tr td') && selectedPlayer.getAttribute('class') !== "bannedPlayer" && currentPlayer === null){
            console.log('Játékost választottunk')
            selectedPlayer.setAttribute('class',"selectedPlayer")
            currentPlayer = players[Number.parseInt(selectedPlayer.getAttribute('id'))-1]
            console.log(currentPlayer)
            startRound()
        }
    }

    function startRound(){
        if(numberOfPlayers > 1) roundTimer = setTimeout(endRound, 10000);
        gameGrid.addEventListener("click", selectCard)  //játékos kiválasztásától számított 10 másodpercig használható
    }

    let selectedCards = []

    function selectCard(event){
        const selectedCard = event.target
        if(event.target.matches("td img") && selectedCard.getAttribute('class') !== 'selectedCard' && selectedCard.getAttribute('id') !== 'null'){              //elem kiválasztása: A kiválasztott kártyát kijelöljük és betesszük egy listába
            console.log(`Selected card: ${selectedCard.getAttribute('id')}`)
            selectedCard.setAttribute('class', 'selectedCard')
            selectedCards.push(new Card(selectedCard.getAttribute('id')))
            console.log(`Card added. Currently selected cards:`)
            for(let i = 0; i<selectedCards.length; i++){
                console.log(selectedCards[i].cardID)
            }
            if(selectedCards.length === 3){                                    //3 kártya után már nincs visszaút
                gameGrid.removeEventListener('click', selectCard)
                if(numberOfPlayers > 1) clearTimeout(roundTimer)
                endRound()
                return
            }
        } else {                                                                //elem deszelektálása
            console.log(`Unselected card: ${selectedCard.getAttribute('id')}`)
            selectedCard.setAttribute('class', 'unSelectedCard')
            selectedCards = selectedCards.filter( card => card.cardID !== selectedCard.getAttribute('id') )
            console.log(`Card removed. Currently selected cards:`)
            for(let i = 0; i<selectedCards.length; i++){
                console.log(selectedCards[i].cardID)
            }
        }
    }

    function endRound(){                          //Játékos körének lezárása
        console.log('Kör vége.')

        giveScore(gameMode, gameGrid, gameTimer, scoreboard, selectedCards, cardDeck, currentPlayer, players)      //Lepontozzuk a tippjét

        if(numberOfPlayers > 1){
            for(const row of scoreboard.children[0].children){              //kiürítjük a tippet
                for(const player of row.children){
                    if(player.getAttribute('class') === "selectedPlayer"){
                        player.setAttribute('class', 'unSelectedPlayer')
                    }
                }
            }
            currentPlayer = null                                            //kinullozzuk a játékost
            console.log(`Kiválasztott játékos visszaállítva.`)
        }

        gameGrid.removeEventListener('click', selectCard)               //Kiválasztott játékos nélkül nem lehet kártyákat választani
        selectedCards = []
        const laidOutCards = document.querySelectorAll("#laidOutCard")  //Az addig kiválasztott kártyákat visszaállítjuk.
        for(const card of laidOutCards){
            if(card.children[0].getAttribute('class') === "selectedCard"){
                card.children[0].setAttribute('class','unSelectedCard')
            }
        }
        console.log('Kártya kijelölések visszaállítva.')

        if(numberOfPlayers == 1){       //===-re nem működik
            console.log('új kört kezd')
            startRound()
        }
    }

    //Segítséggombok létrehozása
    if(hasSetBtnEnabled){
        const hasSetBtn = document.querySelector('#hasSetBtn')
        hasSetBtn.addEventListener('click', findSet)
        hasSetBtn.toggleAttribute('hidden')
    }
    function findSet(){
        const laidOutCards = document.querySelectorAll('[name="card"]')
        if(hasSet(laidOutCards)){                       //Ha van SET a táblán...
            this.setAttribute('class','helpBtnYes')     //...zöldre vált...
        } else{
            this.setAttribute('class','helpBtnNo')      //...különben pirosra (nem valószínű).
        }
    }

    if(showSetBtnEnabled){
        const showSetBtn = document.querySelector('#showSetBtn')
        showSetBtn.addEventListener('click', showSet)
        showSetBtn.toggleAttribute('hidden')
    }
    function showSet(){
        const laidOutCards = document.querySelectorAll('[name="card"]')
        if(hasSet(laidOutCards)){                                       //Ha van SET a táblán,...
            const SET = getSet(laidOutCards)
            for(const card of laidOutCards){                            //...visszakeresi a lapokat...
                for(const setItem of SET){
                    if(card.getAttribute('id') === setItem.cardID){     //...és kijelöli őket.
                        card.setAttribute('class', 'markedCard')
                    }
                }
            }
        }
    }

    if(ThreeCardAddition === "manual"){
        const ThreeMoreCards = document.querySelector('#add3Cards')
        ThreeMoreCards.addEventListener('click', manualAddition)
        ThreeMoreCards.toggleAttribute('hidden')
    }
    function manualAddition(){
        add3Cards(gameGrid, cardDeck)
        this.removeEventListener('click', manualAddition)
        this.setAttribute('class','disabledHelpBtn')
    }

    const gameplayScreen = document.querySelector('#gameplayScreen')
    gameplayScreen.toggleAttribute('hidden')
}




//A gameplay során használt további segédfüggvények.  //Kiszervezni külön js-be?

function giveScore(gameMode, gameGrid, gameTimer, scoreboard, selectedCards, cardDeck, currentPlayer, players){
    const foundSet = isSet(selectedCards)
    if(foundSet){                      //Ha a játékos jól tippelt,....
        console.log('Jól tippeltél! :D (+1 pont)')
        currentPlayer.score++                      //...kap egy pontot...
        refreshScoreBoard(players, foundSet)
        refreshGameGrid(gameMode, gameGrid, gameTimer, scoreboard, players, selectedCards, cardDeck)   //...és a kiválasztott kártyák helyére újakat teszünk,...
    } else {
        console.log(`Rosszul tippeltél! :( (-1 pont)`)
        currentPlayer.score--                   //...különben pontlevonás,...
        refreshScoreBoard(players, foundSet)    //...frissítjük a ponttáblát,...
        banCurrentPlayer()                      //...letiltjuk a játékost,...
        resolveDeadLock()                       //...és ha minden játékos le van tiltva, megszűntetjük a deadlock-ot.
    }
}

function refreshScoreBoard(players, foundSet){
    const playerScores = document.querySelectorAll('[name="playerScore"]')
    for(const playerScore of playerScores){
        if(foundSet){
            if (playerScore.getAttribute('class') === "bannedPlayer"){
                playerScore.setAttribute('class','unSelectedPlayer')
            }
        }
        let playerNumber = Number.parseInt(playerScore.getAttribute('id'))-1
        playerScore.innerHTML = `${players[playerNumber].name}: ${players[playerNumber].score}`
    }
    console.log('Ponttábla frissítve.')
}

function banCurrentPlayer(){
    const playerScores = document.querySelectorAll('[name="playerScore"]')
    for(const player of playerScores){
        if(player.getAttribute('class') === "selectedPlayer"){
            player.setAttribute('class','bannedPlayer')     //formázd meg és ilyen osztályú játékost ne lehessen kiválasztani   //Ha már valaki talált SET-et oldd fel
        }
    }
}

function resolveDeadLock(){
    const playerScores = Array.from(document.querySelectorAll('[name="playerScore"]'))
    if(playerScores.every(player => player.getAttribute('class') === 'bannedPlayer')){
        for(const player of playerScores){
            if(playerScores.length > 1){
                player.setAttribute('class', '')
            } else {
                player.setAttribute('class', 'selectedPlayer')
            }
        }
    }
}

function isSet(selectedCards){
    if(selectedCards.length < 3){
        return false
    }

    const multiplicities = []       //...külön tömbökben eltároljuk az összetartozó tulajdonságaikat...
    /*const filters = []*/
    const colors = []
    const shapes = []

    for(let i=0; i<selectedCards.length; i++){
        multiplicities.push(selectedCards[i].cardID[0])
    }
    //console.log(multiplicities)
    /*for(let i=0; i<selectedCards.length; i++){
        filters.push(selectedCards[i].cardID[1])
    }
    console.log(filters)*/
    for(let i=0; i<selectedCards.length; i++){
        colors.push(selectedCards[i].cardID[2])
    }
    //console.log(colors)
    for(let i=0; i<selectedCards.length; i++){
        shapes.push(selectedCards[i].cardID[3])
    }
    //console.log(shapes)

    if( //Ha az összes tömbre igaz, hogy vagy minden eleme egyezik, vagy mindegyik különböző: (Most ellenőrizzünk csa 3-ra)
        (multiplicities.every( elem => elem === multiplicities[0]) || allUniques(multiplicities)) &&
        //(filters.every( elem => elem === filters[0]) || allUniques(filters)) &&
        (colors.every( elem => elem === colors[0]) || allUniques(colors)) &&
        (shapes.every( elem => elem === shapes[0]) || allUniques(shapes))
    ){
        //console.log("Ez egy SET")   //MŰKÖDIK!!!
        return true
    } else {
        return false
    }

}

function allUniques(array){
    for(let i = 0; i<array.length-1; i++){      //Minden elemre...
        for(let j = i+1; j<array.length; j++){  //...megvizsgáljuk az utána következő elemeket....
            if(array[i] === array[j]){          //...és ha egyezést találunk, hamis.
                return false
            }
        }
    }
    return true                                 //Különben minden elem különböző.
}

function refreshGameGrid(gameMode, gameGrid, gameTimer, scoreboard, players, selectedCards, cardDeck){
    const laidOutCards = document.querySelectorAll('[name="card"]')                //Kiválasztjuk a már lerakott kártyák celláit...
    for(const card of laidOutCards){
        for(const selectedCard of selectedCards){
            if(card.getAttribute('id') === selectedCard.cardID){              //...és ha találunk egy már kiválasztott kártyát,...
                if(cardDeck.length > 0){
                    card.setAttribute('id', cardDeck[0].cardID)           //...kicseréljük a pakli első elemére (kép id-je és forrása)...
                    card.setAttribute('src', `cards/${cardDeck[0].cardID}.svg`)
                    cardDeck.shift()                                                  //...és kivesszük a pakli első elemét.
                } else {
                    card.setAttribute('id', 'null')
                    card.setAttribute('src', '')
                }
            }
        }
    }
    console.log('Kiválasztott kártyák lecserélve.')
    console.log(`Pakliban maradt: ${cardDeck.length} kártya.`)

    if(hasSetBtnEnabled){
        const hasSetBtn = document.querySelector('#hasSetBtn')
        hasSetBtn.setAttribute('class','helpBtn')
    }

    if(!hasSet(laidOutCards)){                                  //Ha már nincs több SET a táblán
        console.log(`Játék vége: Nincs több SET a táblán.`)
        if(gameMode === 'competitive' && cardDeck.length > 0){                         //Verseny módban automatikus
            add3Cards(gameGrid, cardDeck)
        }
        if(!hasSet(laidOutCards)){
            endGame(gameTimer, gameGrid, scoreboard, players)
        }
    }
}

function endGame(gameTimer, gameGrid, scoreboard, players){
    if(gameTimer !== null) clearInterval(gameTimer);
    gameGrid.hidden = true
    scoreboard.hidden = true
    const helpBtns = document.querySelector('#helpBtns')
    helpBtns.hidden = true
    const results = document.querySelector('#results')
    generateResults(players, results)
    results.hidden = false
    const newGameBtn = document.querySelector('#newGameBtn')
    newGameBtn.hidden = false
    newGameBtn.addEventListener('click', newGame)
    
    function newGame(){
        location.reload()
    }
}

function generateResults(players, results){     //kikeressük a 3 dobogós helyezést, majd sorban kiírjuk őket a results div-be
    if(players.length > 1){
        const winners = []
        let highScore = 0
        for(const player of players){               //Lemásoljuk a játékosok tömbjét,...
            winners.push(player)
        }
        for(let i=1; i<=winners.length; i++){       //...majd rendezüük a tömböt a játékosok pontszáma alapján,...
            for(let j=0; j<winners.length-1; j++){
                if(winners[j].score < winners[j+1].score){
                    const temp = winners[j]
                    winners[j] = winners[j+1]
                    winners[j+1] = temp
                }
            }
        }
        results.innerHTML = '<span class="winner">Győztesek</span></br>'
        for(let i=0; i < (winners.length > 3 ? 3 : winners.length);i++){                      //...és végül HTML-be kiírjuk a 3 dobogós helyezést.
            results.innerHTML += `<span name="winner" class="winner">${i+1}. ${winners[i].name}(${winners[i].score} ponttal)</span></br>`
        }
    } else {
        results.innerHTML = '<span class="winner">Vége a játéknak!</span></br>'
    }
}

function add3Cards(gameGrid, cardDeck){
    let newRowContent = ''
    if(cardDeck.length < 3){
        for(let i = 0; i<cardDeck.length; i++){
            newRowContent += `<td id="laidOutCard"><img width="80px" name="card" class="unSelectedCard" id="${cardDeck[0].cardID}" src="cards/${cardDeck[0].cardID}.svg"></td>`
            cardDeck.shift()
        }
    } else {
        for(let i = 0; i<3; i++){
            newRowContent += `<td id="laidOutCard"><img width="80px" name="card" class="unSelectedCard" id="${cardDeck[0].cardID}" src="cards/${cardDeck[0].cardID}.svg"></td>`
            cardDeck.shift()
        }
    }
    gameGrid.children[0].innerHTML += `<tr>${newRowContent}</tr>`
}

function hasSet(laidOutCards){
    const filteredCards = []

    for(const card of laidOutCards){
        if(card.getAttribute('id') != "null"){
            filteredCards.push(new Card(card.getAttribute('id')))
            //console.log(card)
        }
    }
    //laidOutCards.filter( card => card.getAttribute('id') !== "null")
    const currentSelection = []
    for(let i = 0; i<filteredCards.length-2; i++){
        currentSelection.push(filteredCards[i])
        for(let j = i+1; j<filteredCards.length-1; j++){
            currentSelection.push(filteredCards[j])
            for(let k = j+1; k<filteredCards.length; k++){
                currentSelection.push(filteredCards[k])
                //console.log(currentSelection)
                if(isSet(currentSelection)){
                    return true
                }
                currentSelection.pop()
            }
            currentSelection.pop()
        }
        currentSelection.pop()
    }
    return false
}

function getSet (laidOutCards){
    const filteredCards = []

    for(const card of laidOutCards){
        if(card.getAttribute('id') != "null"){
            filteredCards.push(new Card(card.getAttribute('id')))
        }
    }
    const currentSelection = []
    for(let i = 0; i<filteredCards.length-2; i++){
        currentSelection.push(filteredCards[i])
        for(let j = i+1; j<filteredCards.length-1; j++){
            currentSelection.push(filteredCards[j])
            for(let k = j+1; k<filteredCards.length; k++){
                currentSelection.push(filteredCards[k])
                //console.log(currentSelection)
                if(isSet(currentSelection)){
                    return currentSelection
                }
                currentSelection.pop()
            }
            currentSelection.pop()
        }
        currentSelection.pop()
    }
    //return null? De akkor ebbe be sem lépne.
}

init();