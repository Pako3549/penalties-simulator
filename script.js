let first_team = prompt("Inserisci nome della prima squadra") || "Squadra A";
let second_team = prompt("Inserisci nome della seconda squadra") || "Squadra B";

console.log("=== SIMULATORE DI RIGORI ===");
console.log(`Squadra 1: ${first_team}`);
console.log(`Squadra 2: ${second_team}`);
console.log("============================\n")

const navbar = document.querySelector("nav");
const position_shoots = document.querySelectorAll(".position-shoot button");
const position_shoots_container = document.querySelector('.position-shoot');
let team_turn = document.querySelector("main h1");
let start_button = document.querySelector("main > button");
let shoot_result = document.querySelector(".result");
let final_results = document.querySelector(".final-results");
let turn = 0;

const penalties_n = 10;
let penalties_first_team = [0, 0, 0, 0, 0];
let penalties_second_team = [0, 0, 0, 0, 0];
let goalkeeper_position = () => Math.floor(Math.random() * 3) + 1;

const getDirection = (num) => {
    if(num === 1) return "sinistra";
    if(num === 2) return "centro";
    if(num === 3) return "destra";
    return "sconosciuta";
};



let selectTeam = (team) => {
    navbar.querySelector(".first-team").classList.remove("selected");
    navbar.querySelector(".second-team").classList.remove("selected");

    if(team === 0 ) navbar.querySelector(".first-team").classList.add("selected");
    if(team === 1) navbar.querySelector(".second-team").classList.add("selected");
};

let startPenalties = () => {
    start_button.style.display = 'none';
    position_shoots_container.style.display = "flex";
    navbar.style.display = 'flex';
    
    navbar.querySelector(".first-team").innerHTML = first_team + " <br>";
    navbar.querySelector(".second-team").innerHTML = second_team + " <br>";
    
    selectTeam(turn % 2);

    position_shoots.forEach(button => {
        button.onclick = (event) => {
            let value;
            
            do {
                value = Number(event.currentTarget.dataset.value);
            } while(value < 1 || value > 3);
            
            const keeper_pos = goalkeeper_position();
            result = value == keeper_pos ? 0 : 1;
            
            if(turn >= penalties_n){ showResults(); return; }
            
            const current_team = turn % 2 === 0 ? first_team : second_team;
            const penalty_num = Math.floor(turn / 2) + 1;
            
            console.log(`\n--- Rigore ${turn + 1} ---`);
            console.log(`${current_team} calcia a ${getDirection(value)}`);
            console.log(`Portiere si tuffa a ${getDirection(keeper_pos)}`);
            console.log(`Risultato: ${result == 0 ? '❌ PARATA!' : '✅ GOL!'}`);
            
            if(turn % 2 === 0){
                penalties_first_team[Math.floor(turn / 2)] = result;
                navbar.querySelector(".first-team").innerHTML += result == 0 ? '❌' : '✅';
                console.log(`Punteggio parziale ${first_team}: ${penalties_first_team.reduce((sum, val) => sum + val, 0)} gol`);
            }
            else{
                penalties_second_team[Math.floor(turn / 2)] = result;
                navbar.querySelector(".second-team").innerHTML += result == 0 ? '❌' : '✅';
                console.log(`Punteggio parziale ${second_team}: ${penalties_second_team.reduce((sum, val) => sum + val, 0)} gol`);
            }

            shoot_result.textContent = result == 0 ? '❌ Parata' : '✅ Goal';
            team_turn.textContent = "Rigore n " + (turn + 1);

            turn++;
            if(turn >= penalties_n){ showResults(); return; }
            selectTeam(turn % 2);
        };
    });
};

let showResults = () => {
    position_shoots_container.style.display = "none";
    shoot_result.style.display = "none";
    selectTeam(undefined);

    const total_first = penalties_first_team.reduce((sum, val) => sum + val, 0);
    const total_second = penalties_second_team.reduce((sum, val) => sum + val, 0);

    console.log("\n\n============================");
    console.log("=== RISULTATO FINALE ===");
    console.log("============================");
    console.log(`${first_team}: ${total_first} gol`);
    console.log(`${second_team}: ${total_second} gol`);
    console.log("----------------------------");
    
    let winner_message = "";
    if(total_first > total_second) {
        winner_message = `🏆 Vince ${first_team}!`;
    } else if(total_first < total_second) {
        winner_message = `🏆 Vince ${second_team}!`;
    } else {
        winner_message = "🤝 Pareggio!";
    }
    
    console.log(winner_message);
    console.log("============================\n");

    team_turn.innerHTML = `${total_first} - ${total_second} <br>`;
    if(total_first > total_second) team_turn.innerHTML += `Vince ${first_team}`;
    else if(total_first < total_second) team_turn.innerHTML += `Vince ${second_team}`;
    else team_turn.innerHTML += `Pareggio`;

    position_shoots.forEach(button => button.disabled = true);
}