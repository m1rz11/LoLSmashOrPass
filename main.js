init();
const language = 'en_US';
let champList = [];
let smashList = [];
let smashListStr = "";
let passListStr = "";
let passList = [];
let current;
let datasaved = true;

let championImage = document.getElementById('championimage');
let championName = document.getElementById('championname');
let smashListElem = document.getElementById('smashlist');
let passListElem = document.getElementById('passlist');
let totalCounter = document.getElementById('totalcounter');
let smashCounter = document.getElementById('smashcounter');
let passCounter = document.getElementById('passcounter');

function init(){
    getChampionList().then(result => {
        champList = result;

        loadData();
        pickRandomChampion();

        document.getElementById('main').style.display = 'block';
    });
}

function pickRandomChampion(){
    if (champList.length === 0){
        alert('Welp, you seem to have run out of characters :D time well spent eh?');
    }
    current = Math.floor(Math.random() * champList.length);
    const champion = champList[current];

    championImage.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.img}.jpg`;
    championName.innerText = champion.name;
    totalCounter.innerText = champList.length + " remain";
    smashCounter.innerText = smashList.length;
    passCounter.innerText = passList.length;
}

function smash(){
    let champion = champList.splice(current,1)[0];
    smashList.unshift(champion);
    smashListStr += champion.name + "<br>";
    smashListElem.innerHTML = smashListStr;
    datasaved = false;
    pickRandomChampion();
}

function pass(){
    let champion = champList.splice(current,1)[0];
    passList.unshift(champion);
    passListStr += champion.name + "<br>";
    passListElem.innerHTML = passListStr;
    datasaved = false;
    pickRandomChampion();
}

function saveData(){
    let smashids = [];
    let passids = [];

    smashList.forEach(champion => {
        smashids.push(champion.id);
    });
    passList.forEach(champion => {
        passids.push(champion.id);
    });

    localStorage.setItem('smashlist', JSON.stringify(smashids));
    localStorage.setItem('passlist', JSON.stringify(passids));

    datasaved = true;
}

function loadData(){
    const smashids = JSON.parse(localStorage.getItem('smashlist')).reverse() ?? [];
    const passids = JSON.parse(localStorage.getItem('passlist')).reverse() ?? [];

    // load smash list
    loadsmash:
        for (let i = smashids.length-1; i>=0; i--){
            const currid = smashids[i];

            for (let o in champList){
                if (currid === champList[o].id){
                    smashList.push(champList[o]);
                    smashListStr += champList[o].name+"<br>";
                    champList.splice(o,1);
                    smashids.splice(i, 1);

                    continue loadsmash;
                }
            }
        }

    // load pass list
    loadpass:
        for (let i = passids.length-1; i>=0; i--){
            const currid = passids[i];

            for (let o in champList){
                if (currid === champList[o].id){
                    passList.push(champList[o]);
                    passListStr += champList[o].name+"<br>";
                    champList.splice(o,1);
                    passids.splice(i, 1);

                    continue loadpass;
                }
            }
        }

    passListElem.innerHTML = passListStr;
    smashListElem.innerHTML = smashListStr;
}

function clearData(){
    smashList = [];
    passList = [];
    saveData();
}

async function getChampionList() {
    // get latest data from riot api
    const version = (await (await fetch('https://ddragon.leagueoflegends.com/api/versions.json')).json())[0];       // latest version
    const champions = (await (await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/championFull.json`)).json()).data;          // champion list

    // todo: add languages support
    // const languages = await (await fetch('https://ddragon.leagueoflegends.com/cdn/languages.json')).json();

    // create champion list
    Object.keys(champions).forEach(key => {
        const champion = champions[key];
        Object.keys(champion.skins).forEach(key => {
            const skin = champion.skins[key];
            champList.push({
                'id' : skin.id,
                'name' : skin.name === 'default' ? champion.name : skin.name,
                'img' : champion.id + '_' + skin.num
            });
        });

    });

    // display version
    document.getElementById('versiontext').innerText = version;

    return champList;
}

// save data every minute
setInterval(()=> {
    if (!datasaved){
        saveData();
    }
}, 60000);

window.onbeforeunload = () => {
    saveData();
}