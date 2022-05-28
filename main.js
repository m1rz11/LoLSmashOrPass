init();
const language = 'en_US';
let champList, smashList, passList;
let championImage = document.getElementById('championimage');
let championName = document.getElementById('championname');

function init(){
    getChampionList().then(result => {
        champList = result;

        // todo: load data from local storage and move champions to other lists

        pickRandomChampion();

        document.getElementById('main').style.display = "inline";
    });
}

function pickRandomChampion(){
    const random = Math.floor(Math.random() * champList.length);
    const champion = champList[random];
    championImage.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.img}.jpg`;
    championName.innerText = champion.name;

    // todo: use the other lists ffs
}

function smash(){
    pickRandomChampion();
}

function pass(){
    pickRandomChampion();
}

async function getChampionList() {
    // get latest data from riot api
    const version = (await (await fetch('https://ddragon.leagueoflegends.com/api/versions.json')).json())[0];       // latest version
    const champions = (await (await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/championFull.json`)).json()).data;          // champion list

    // todo: add languages support
    // const languages = await (await fetch('https://ddragon.leagueoflegends.com/cdn/languages.json')).json();

    // display version
    document.getElementById('versiontext').innerText = version;

    // create champion list
    let champList = [];
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
    return champList;
}