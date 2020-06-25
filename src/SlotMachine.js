import { SlotImage } from './SlotImage.js';
import { AnimateImage } from './AnimateImage.js';

class SlotMachine {

    //0 = apple
    //1 = banana
    //2 = melon

    reels = [
        ['apple.png'],
        ['banana.png'],
        ['melon.png']
    ];

    reelArray = [];

    arrayImages = [];

    animateImage = new AnimateImage();

    // Method to initialize the data
    draw = () => {

        //button listener, register click event
        document.getElementById('btnStart').addEventListener('click', function () {
            this.animate();
        }.bind(this));

        let slotImage = new SlotImage();

        this.reels.forEach(img => {
            this.arrayImages.push(slotImage.createImageNode(img));
        });

        //initialize the reels to apples
        document.getElementById("reel0").appendChild(this.arrayImages[0].cloneNode(true));
        document.getElementById("reel1").appendChild(this.arrayImages[0].cloneNode(true));
        document.getElementById("reel2").appendChild(this.arrayImages[0].cloneNode(true));
    }

    //On click of start button call fetch api
    animate = () => {
        // let sound = document.getElementById("audio");
        // sound.play();                                   // could uncomment if sound not needed, also html should be uncommented
        let stake = document.getElementById('stakeSelector').value;
        this.doFetch('<Request balance=\"100.00\" stake=\" ' + stake + '\" />',
            'http://localhost:8888/serve');        //had to change this from localhost to ip address of local docker server
    }

    doFetch = (Content, URL) => {
        const fetchPromise = fetch(
            URL, {
            method: 'POST',
            //mode: 'no-cors',
            headers: new Headers(
                {
                    'Content-Type': 'text/xml; charset=utf-8',
                    'Accept': '*/*',
                    'Accept-Language': 'en-GB',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'Keep-alive',
                    'Content-Length': Content.length
                }),
            body: Content
        });


        return fetchPromise
            .then(response => response.text())
            .then(str => {
                if (str.includes("Error")) {
                    throw Error(str);
                }
                return (new window.DOMParser()).parseFromString(str, "text/xml");
            })
            .then(data => {
                let slot = data.getElementsByTagName("SymbolGrid");
                let winnings = data.getElementsByTagName("Response");
                if (winnings.length != 0) {
                    document.getElementById("balance").innerText = "Balance : " + winnings[0].attributes[0].value;
                    document.getElementById("stake").innerText = "Stake : " + winnings[0].attributes[1].value;
                    document.getElementById("win").innerText = "Win : " + winnings[0].attributes[2].value;
                }

                this.reelArray = [];
                for (let i = 0; i < slot.length; i++) {
                    let arr = slot[i].attributes[1].value.split(',');
                    let fst = arr.splice(0, 1);
                    document.getElementById("reel" + i).innerHTML = "";
                    switch (Number(fst)) {
                        case 0:
                            this.displayImages(0, i);
                            break;
                        case 1:
                            this.displayImages(1, i);
                            break;
                        case 2:
                            this.displayImages(2, i);
                            break;
                        default:
                            break;
                    }
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    // Common functionality to display
    // the images within the reel
    displayImages = (reelNo, i) => {
        let imgNode = this.arrayImages[reelNo];
        imgNode.id = "image" + reelNo;
        if (this.reelArray.includes(reelNo)) {
            imgNode = this.arrayImages[reelNo].cloneNode(true);
            imgNode.id = "image" + reelNo + reelNo;
        }

        document.getElementById("reel" + i).appendChild(imgNode);
        this.animateImage.animateCSS(imgNode.id, 'fadeInDown');
        this.reelArray.push(reelNo);
    }
}

let x = new SlotMachine();
x.draw();