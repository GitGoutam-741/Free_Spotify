console.log("Lets start some JS")

let currentsong = new Audio();
async function getsongs() {

    let a = await fetch("http://127.0.0.1:5501/songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playmusic = (track,pause=false) => {
    // let audio=new Audio("/songs/" + track)
    currentsong.src = "/songs/" + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

// CHATGPT TIME FORMAT FUNCTION
function formatTime(seconds) {
    seconds = Math.floor(seconds); // remove decimal part
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
}

async function main() {


    //get the list of all the songs
    let songs = await getsongs()
    playmusic(songs[0],true)

    // show all the song in the playlist
    let songUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><div class="micon border ">🎵</div>
                            <div class="info ">
                                <div class="sname" >${song.replaceAll("%20", " ")}</div>
                                <div class="artist" >Song Artist</div>
                            </div>
                            <div class="playnow ">
                                <div><img class="invert flex justify-center items-center  " src="play.svg" alt=""></div>
                                <div class="flex justify-center items-center " ><h5>Play Now</h5></div>
                            </div></li>`;
    }

    //Atach a event listner to each song
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    //Attach an event listener to play,previous and next

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })

    // listen for time update function

    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left =(currentsong.currentTime/currentsong.duration)*100 + "%";
    })

    //add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector(".circle").style.left= percent+ "%";
        currentsong.currentTime = (currentsong.duration * percent)/100;
    })

}

main()
