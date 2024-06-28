import { LightningElement, track } from 'lwc';
import {loadStyle} from 'lightning/platformResourceLoader';
import fontawesome from '@salesforce/resourceUrl/fontawesome';

export default class MemoryCard extends LightningElement {
    isLibLoaded = false;
    totalTime = '00:00';
    timeRef;
    timeStarted = false;
    movesCounter = 0;
    matchedCards = 0;
    winMoves = 8;
    boardTypes = [
        {id:1, name: '4 x 4', listClass:'button clicked'},
        {id:2, name: '6 x 6', listClass:'button'}
    ];
    backToStandardBoard = [];
    @track openedCards = [];
    cards = [
        {id:1, listClass:"card", type:'diamond', icon:'fa fa-diamond icon'},
        {id:2, listClass:"card", type:'plane', icon:'fa fa-paper-plane-o icon'},
        {id:3, listClass:"card", type:'anchor', icon:'fa fa-anchor icon'},
        {id:4, listClass:"card", type:'bolt', icon:'fa fa-bolt icon'},
        {id:5, listClass:"card", type:'cube', icon:'fa fa-cube icon'},
        {id:6, listClass:"card", type:'anchor', icon:'fa fa-anchor icon'},
        {id:7, listClass:"card", type:'leaf', icon:'fa fa-leaf icon'},
        {id:8, listClass:"card", type:'bicycle', icon:'fa fa-bicycle icon'},
        {id:9, listClass:"card", type:'diamond', icon:'fa fa-diamond icon'},
        {id:10, listClass:"card", type:'bomb', icon:'fa fa-bomb icon'},
        {id:11, listClass:"card", type:'leaf', icon:'fa fa-leaf icon'},
        {id:12, listClass:"card", type:'bomb', icon:'fa fa-bomb icon'},
        {id:13, listClass:"card", type:'bolt', icon:'fa fa-bolt icon'},
        {id:14, listClass:"card", type:'bicycle', icon:'fa fa-bicycle icon'},
        {id:15, listClass:"card", type:'plane', icon:'fa fa-paper-plane-o icon'},
        {id:16, listClass:"card", type:'cube', icon:'fa fa-cube icon'}
    ];

      extendedCards = [...this.cards, 
        {id:17, listClass:"card", type:'google', icon:'fa fa-google icon'},
        {id:18, listClass:"card", type:'try', icon:'fa fa-try icon'},
        {id:19, listClass:"card", type:'slack', icon:'fa fa-slack icon'},
        {id:20, listClass:"card", type:'paw', icon:'fa fa-paw icon'},
        {id:21, listClass:"card", type:'child', icon:'fa fa-child icon'},
        {id:22, listClass:"card", type:'fax', icon:'fa fa-fax icon'},
        {id:23, listClass:"card", type:'joomla', icon:'fa fa-joomla icon'},
        {id:24, listClass:"card", type:'wheelchair', icon:'fa fa-wheelchair icon'},
        {id:25, listClass:"card", type:'reddit', icon:'fa fa-reddit icon'},
        {id:26, listClass:"card", type:'bank', icon:'fa fa-bank icon'},
        {id:27, listClass:"card", type:'joomla', icon:'fa fa-joomla icon'},
        {id:28, listClass:"card", type:'paw', icon:'fa fa-paw icon'},
        {id:29, listClass:"card", type:'try', icon:'fa fa-try icon'},
        {id:30, listClass:"card", type:'google', icon:'fa fa-google icon'},
        {id:31, listClass:"card", type:'fax', icon:'fa fa-fax icon'},
        {id:32, listClass:"card", type:'wheelchair', icon:'fa fa-wheelchair icon'},
        {id:33, listClass:"card", type:'slack', icon:'fa fa-slack icon'},
        {id:34, listClass:"card", type:'child', icon:'fa fa-child icon'},
        {id:35, listClass:"card", type:'bank', icon:'fa fa-bank icon'},
        {id:36, listClass:"card", type:'reddit', icon:'fa fa-reddit icon'}
    ];

    connectedCallback() {
        if (this.isLibLoaded) {
            return;
        } else {
            loadStyle(this, fontawesome + '/fontawesome/css/font-awesome.min.css').then(() => {
                console.log('fonts loaded successfully');
            }).catch (error => {
                console.log(error);
            });
            this.isLibLoaded = false;
        }

        this.backToStandardBoard = [...this.cards];
    }

    handleCard(event) {
        this.timer();
        let currCard = event.currentTarget;
        currCard.classList.add("open", "disabled");
        this.openedCards.push(currCard);

        if (this.openedCards.length === 2) {
            this.movesCounter++;
            if (this.openedCards[0].getAttribute("type") === this.openedCards[1].getAttribute("type")) {
                this.match(this.openedCards);
            } else {
                this.unmatch(this.openedCards);
            }
        }
    }

    timer() {
        if (!this.timeStarted) {
            let startTime = new Date().getTime();
            this.timeRef = setInterval(()=>{
                let diff = new Date().getTime() - startTime;
                let d = Math.floor(diff / 1000);
                let m = Math.floor(d % 3600 / 60);
                let s = Math.floor(d % 3600 % 60);
            
                const formattedMinutes = String(m).padStart(2, '0');
                const formattedSeconds = String(s).padStart(2, '0');

                this.totalTime = formattedMinutes + ':' + formattedSeconds;
            }, 1000)

            this.timeStarted = true;
        }
    }

    match(elements) {
        this.matchedCards++;
        if (this.matchedCards === this.winMoves) {
            window.clearInterval(this.timeRef);
            let timer = this.template.querySelector(".timer");
            timer.classList.add("resize");
            let moves = this.template.querySelector(".moves");
            moves.classList.add("resize");
        }

        elements.forEach(card => {
            card.classList.add("matched");
        })

        this.openedCards = [];
    }

    unmatch(elements) {
        elements.forEach(card => {
            card.classList.add("unmatched", "disabled");
        })

        setTimeout(() => {
            elements.forEach(card => {
                card.classList.remove("unmatched", "open", "disabled");
            })
        }, 400);

        this.openedCards = [];
    }

    resetBoard(event) {
        this.openedCards = [];
        this.matchedCards = 0;
        this.movesCounter = 0;
        this.timeStarted = false;
        this.totalTime = "00:00";
        window.clearInterval(this.timeRef);

        let elements = this.template.querySelectorAll(".card");
        elements.forEach(card => {
            card.classList.remove("matched","unmatched", "open", "disabled");
        })
        this.template.querySelector(".moves").classList.remove("resize");
        this.template.querySelector(".timer").classList.remove("resize");

        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    handleBoardType(event) {
        let element = event.currentTarget;
        if (!element.classList.contains(".clicked")) {
            let elementsClicked = this.template.querySelectorAll(".button");
            elementsClicked.forEach(element => {
                element.classList.remove("clicked");
            })
            element.classList.add("clicked");
        }

        console.log(JSON.stringify(this.backToStandardBoard));
        if (element.getAttribute("name") === "6 x 6") {
            this.winMoves = 18;
            this.cards = this.extendedCards;
            this.template.querySelector(".game-board-standard").classList.add("extended");
        } else {
            if (this.template.querySelector(".game-board-standard").classList.contains("extended")) {
                this.winMoves = 8;
                this.cards = this.backToStandardBoard;
                this.template.querySelector(".game-board-standard").classList.remove("extended");
            }
            
        }
    }
}