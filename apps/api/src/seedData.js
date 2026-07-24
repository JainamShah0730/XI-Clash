// Illustrative attribute estimates — not official ratings. Clubs/nations
// accurate as of early 2026 to the best available knowledge; spot-check
// anything you plan to rely on heavily.
import { FORMATIONS } from "@xi-clash/shared";

export const globalPlayers = [
    // Goalkeepers
    { name: "Alisson", real_club: "Liverpool", nation: "Brazil", league: "EPL", position_primary: "GK", position_secondary: null, pac: 55, sho: 20, pas: 65, dri: 45, def: 30, phy: 75, ovr_base: 88 },
    { name: "Ederson", real_club: "Manchester City", nation: "Brazil", league: "EPL", position_primary: "GK", position_secondary: null, pac: 58, sho: 25, pas: 85, dri: 60, def: 30, phy: 78, ovr_base: 87 },
    { name: "Thibaut Courtois", real_club: "Real Madrid", nation: "Belgium", league: "La Liga", position_primary: "GK", position_secondary: null, pac: 48, sho: 18, pas: 60, dri: 42, def: 28, phy: 85, ovr_base: 90 },
    { name: "Marc-André ter Stegen", real_club: "Barcelona", nation: "Germany", league: "La Liga", position_primary: "GK", position_secondary: null, pac: 50, sho: 20, pas: 78, dri: 55, def: 28, phy: 80, ovr_base: 88 },
    { name: "Manuel Neuer", real_club: "Bayern Munich", nation: "Germany", league: "Bundesliga", position_primary: "GK", position_secondary: null, pac: 52, sho: 22, pas: 75, dri: 58, def: 30, phy: 78, ovr_base: 85 },
    { name: "Emiliano Martinez", real_club: "Aston Villa", nation: "Argentina", league: "EPL", position_primary: "GK", position_secondary: null, pac: 50, sho: 18, pas: 62, dri: 45, def: 30, phy: 80, ovr_base: 86 },
    { name: "Mike Maignan", real_club: "AC Milan", nation: "France", league: "Serie A", position_primary: "GK", position_secondary: null, pac: 54, sho: 20, pas: 70, dri: 50, def: 30, phy: 82, ovr_base: 87 },
    { name: "Gianluigi Donnarumma", real_club: "Paris Saint-Germain", nation: "Italy", league: "Ligue 1", position_primary: "GK", position_secondary: null, pac: 50, sho: 20, pas: 68, dri: 48, def: 28, phy: 84, ovr_base: 88 },
    { name: "Jan Oblak", real_club: "Atletico Madrid", nation: "Slovenia", league: "La Liga", position_primary: "GK", position_secondary: null, pac: 46, sho: 18, pas: 60, dri: 42, def: 28, phy: 82, ovr_base: 87 },
    { name: "David Raya", real_club: "Arsenal", nation: "Spain", league: "EPL", position_primary: "GK", position_secondary: null, pac: 50, sho: 18, pas: 78, dri: 55, def: 28, phy: 76, ovr_base: 85 },
    { name: "Nick Pope", real_club: "Newcastle United", nation: "England", league: "EPL", position_primary: "GK", position_secondary: null, pac: 46, sho: 16, pas: 58, dri: 40, def: 28, phy: 80, ovr_base: 83 },
    { name: "Yassine Bounou", real_club: "Al-Hilal", nation: "Morocco", league: "Saudi Pro League", position_primary: "GK", position_secondary: null, pac: 48, sho: 18, pas: 62, dri: 45, def: 28, phy: 78, ovr_base: 84 },
    { name: "André Onana", real_club: "Manchester United", nation: "Cameroon", league: "EPL", position_primary: "GK", position_secondary: null, pac: 52, sho: 20, pas: 72, dri: 52, def: 28, phy: 78, ovr_base: 84 },
    { name: "Wojciech Szczesny", real_club: "Barcelona", nation: "Poland", league: "La Liga", position_primary: "GK", position_secondary: null, pac: 44, sho: 16, pas: 60, dri: 42, def: 28, phy: 80, ovr_base: 82 },
    { name: "Diogo Costa", real_club: "FC Porto", nation: "Portugal", league: "Primeira Liga", position_primary: "GK", position_secondary: null, pac: 50, sho: 18, pas: 65, dri: 45, def: 28, phy: 78, ovr_base: 84 },

    // Centre-backs
    { name: "Virgil van Dijk", real_club: "Liverpool", nation: "Netherlands", league: "EPL", position_primary: "CB", position_secondary: null, pac: 78, sho: 45, pas: 70, dri: 65, def: 90, phy: 88, ovr_base: 89 },
    { name: "Ruben Dias", real_club: "Manchester City", nation: "Portugal", league: "EPL", position_primary: "CB", position_secondary: null, pac: 70, sho: 35, pas: 68, dri: 60, def: 89, phy: 85, ovr_base: 87 },
    { name: "William Saliba", real_club: "Arsenal", nation: "France", league: "EPL", position_primary: "CB", position_secondary: null, pac: 82, sho: 30, pas: 65, dri: 62, def: 86, phy: 82, ovr_base: 86 },
    { name: "Antonio Rudiger", real_club: "Real Madrid", nation: "Germany", league: "La Liga", position_primary: "CB", position_secondary: null, pac: 76, sho: 32, pas: 66, dri: 60, def: 87, phy: 86, ovr_base: 87 },
    { name: "Josko Gvardiol", real_club: "Manchester City", nation: "Croatia", league: "EPL", position_primary: "CB", position_secondary: "FB", pac: 80, sho: 38, pas: 72, dri: 68, def: 84, phy: 82, ovr_base: 86 },
    { name: "William Pacho", real_club: "Paris Saint-Germain", nation: "Ecuador", league: "Ligue 1", position_primary: "CB", position_secondary: null, pac: 78, sho: 28, pas: 64, dri: 60, def: 84, phy: 80, ovr_base: 84 },
    { name: "Ronald Araujo", real_club: "Barcelona", nation: "Uruguay", league: "La Liga", position_primary: "CB", position_secondary: null, pac: 82, sho: 30, pas: 62, dri: 58, def: 86, phy: 88, ovr_base: 86 },
    { name: "Eder Militao", real_club: "Real Madrid", nation: "Brazil", league: "La Liga", position_primary: "CB", position_secondary: null, pac: 80, sho: 28, pas: 62, dri: 58, def: 85, phy: 84, ovr_base: 85 },
    { name: "David Alaba", real_club: "Real Madrid", nation: "Austria", league: "La Liga", position_primary: "CB", position_secondary: "FB", pac: 68, sho: 40, pas: 78, dri: 70, def: 82, phy: 78, ovr_base: 84 },
    { name: "Marquinhos", real_club: "Paris Saint-Germain", nation: "Brazil", league: "Ligue 1", position_primary: "CB", position_secondary: "DM", pac: 74, sho: 32, pas: 74, dri: 65, def: 85, phy: 80, ovr_base: 86 },
    { name: "Kim Min-jae", real_club: "Bayern Munich", nation: "South Korea", league: "Bundesliga", position_primary: "CB", position_secondary: null, pac: 76, sho: 28, pas: 62, dri: 58, def: 85, phy: 86, ovr_base: 85 },
    { name: "Gabriel Magalhaes", real_club: "Arsenal", nation: "Brazil", league: "EPL", position_primary: "CB", position_secondary: null, pac: 74, sho: 36, pas: 62, dri: 58, def: 85, phy: 85, ovr_base: 86 },
    { name: "Cristian Romero", real_club: "Tottenham Hotspur", nation: "Argentina", league: "EPL", position_primary: "CB", position_secondary: null, pac: 76, sho: 30, pas: 62, dri: 60, def: 84, phy: 82, ovr_base: 85 },
    { name: "Alessandro Bastoni", real_club: "Inter Milan", nation: "Italy", league: "Serie A", position_primary: "CB", position_secondary: null, pac: 74, sho: 32, pas: 76, dri: 68, def: 84, phy: 78, ovr_base: 86 },
    { name: "Dayot Upamecano", real_club: "Bayern Munich", nation: "France", league: "Bundesliga", position_primary: "CB", position_secondary: null, pac: 80, sho: 28, pas: 64, dri: 60, def: 82, phy: 84, ovr_base: 84 },
    { name: "Jules Kounde", real_club: "Barcelona", nation: "France", league: "La Liga", position_primary: "CB", position_secondary: "FB", pac: 84, sho: 30, pas: 68, dri: 65, def: 82, phy: 78, ovr_base: 85 },
    { name: "Ibrahima Konate", real_club: "Liverpool", nation: "France", league: "EPL", position_primary: "CB", position_secondary: null, pac: 82, sho: 28, pas: 60, dri: 58, def: 82, phy: 84, ovr_base: 84 },

    // Full-backs
    { name: "Trent Alexander-Arnold", real_club: "Real Madrid", nation: "England", league: "La Liga", position_primary: "FB", position_secondary: "CM", pac: 76, sho: 65, pas: 89, dri: 78, def: 68, phy: 68, ovr_base: 87 },
    { name: "Achraf Hakimi", real_club: "Paris Saint-Germain", nation: "Morocco", league: "Ligue 1", position_primary: "FB", position_secondary: "W", pac: 92, sho: 65, pas: 75, dri: 82, def: 72, phy: 78, ovr_base: 86 },
    { name: "Alphonso Davies", real_club: "Bayern Munich", nation: "Canada", league: "Bundesliga", position_primary: "FB", position_secondary: "W", pac: 96, sho: 55, pas: 68, dri: 80, def: 70, phy: 72, ovr_base: 85 },
    { name: "Theo Hernandez", real_club: "AC Milan", nation: "France", league: "Serie A", position_primary: "FB", position_secondary: "W", pac: 88, sho: 60, pas: 70, dri: 78, def: 70, phy: 78, ovr_base: 85 },
    { name: "Kyle Walker", real_club: "Manchester City", nation: "England", league: "EPL", position_primary: "FB", position_secondary: null, pac: 88, sho: 45, pas: 65, dri: 65, def: 78, phy: 80, ovr_base: 82 },
    { name: "Joao Cancelo", real_club: "Al-Hilal", nation: "Portugal", league: "Saudi Pro League", position_primary: "FB", position_secondary: "CM", pac: 82, sho: 60, pas: 82, dri: 82, def: 68, phy: 68, ovr_base: 83 },
    { name: "Ben Chilwell", real_club: "Chelsea", nation: "England", league: "EPL", position_primary: "FB", position_secondary: null, pac: 80, sho: 55, pas: 74, dri: 74, def: 68, phy: 68, ovr_base: 80 },
    { name: "Reece James", real_club: "Chelsea", nation: "England", league: "EPL", position_primary: "FB", position_secondary: null, pac: 82, sho: 62, pas: 78, dri: 76, def: 76, phy: 78, ovr_base: 84 },
    { name: "Nuno Mendes", real_club: "Paris Saint-Germain", nation: "Portugal", league: "Ligue 1", position_primary: "FB", position_secondary: "W", pac: 88, sho: 55, pas: 72, dri: 80, def: 70, phy: 70, ovr_base: 84 },
    { name: "Denzel Dumfries", real_club: "Inter Milan", nation: "Netherlands", league: "Serie A", position_primary: "FB", position_secondary: "W", pac: 86, sho: 60, pas: 68, dri: 74, def: 68, phy: 80, ovr_base: 83 },
    { name: "Jeremie Frimpong", real_club: "Bayer Leverkusen", nation: "Netherlands", league: "Bundesliga", position_primary: "FB", position_secondary: "W", pac: 94, sho: 58, pas: 68, dri: 80, def: 65, phy: 68, ovr_base: 83 },
    { name: "Federico Dimarco", real_club: "Inter Milan", nation: "Italy", league: "Serie A", position_primary: "FB", position_secondary: "W", pac: 78, sho: 62, pas: 80, dri: 76, def: 70, phy: 72, ovr_base: 84 },
    { name: "Andrew Robertson", real_club: "Liverpool", nation: "Scotland", league: "EPL", position_primary: "FB", position_secondary: null, pac: 78, sho: 50, pas: 76, dri: 70, def: 74, phy: 70, ovr_base: 82 },
    { name: "Benjamin Pavard", real_club: "Inter Milan", nation: "France", league: "Serie A", position_primary: "FB", position_secondary: "CB", pac: 76, sho: 45, pas: 68, dri: 62, def: 76, phy: 76, ovr_base: 81 },

    // Defensive midfielders
    { name: "Rodri", real_club: "Manchester City", nation: "Spain", league: "EPL", position_primary: "DM", position_secondary: "CM", pac: 62, sho: 68, pas: 88, dri: 82, def: 85, phy: 82, ovr_base: 90 },
    { name: "Declan Rice", real_club: "Arsenal", nation: "England", league: "EPL", position_primary: "DM", position_secondary: "CM", pac: 68, sho: 60, pas: 80, dri: 75, def: 84, phy: 82, ovr_base: 87 },
    { name: "Casemiro", real_club: "Manchester United", nation: "Brazil", league: "EPL", position_primary: "DM", position_secondary: null, pac: 55, sho: 60, pas: 74, dri: 68, def: 82, phy: 82, ovr_base: 82 },
    { name: "Fabinho", real_club: "Al-Ittihad", nation: "Brazil", league: "Saudi Pro League", position_primary: "DM", position_secondary: null, pac: 60, sho: 58, pas: 76, dri: 68, def: 80, phy: 80, ovr_base: 81 },
    { name: "Manuel Ugarte", real_club: "Manchester United", nation: "Uruguay", league: "EPL", position_primary: "DM", position_secondary: null, pac: 66, sho: 45, pas: 72, dri: 68, def: 82, phy: 78, ovr_base: 80 },
    { name: "Joshua Kimmich", real_club: "Bayern Munich", nation: "Germany", league: "Bundesliga", position_primary: "DM", position_secondary: "CM", pac: 65, sho: 65, pas: 88, dri: 78, def: 78, phy: 74, ovr_base: 87 },
    { name: "Aurelien Tchouameni", real_club: "Real Madrid", nation: "France", league: "La Liga", position_primary: "DM", position_secondary: "CB", pac: 68, sho: 60, pas: 78, dri: 72, def: 82, phy: 82, ovr_base: 85 },
    { name: "Moises Caicedo", real_club: "Chelsea", nation: "Ecuador", league: "EPL", position_primary: "DM", position_secondary: null, pac: 78, sho: 55, pas: 76, dri: 76, def: 84, phy: 80, ovr_base: 85 },
    { name: "Enzo Fernandez", real_club: "Chelsea", nation: "Argentina", league: "EPL", position_primary: "DM", position_secondary: "CM", pac: 68, sho: 68, pas: 84, dri: 78, def: 76, phy: 74, ovr_base: 85 },
    { name: "Sergej Milinkovic-Savic", real_club: "Al-Hilal", nation: "Serbia", league: "Saudi Pro League", position_primary: "DM", position_secondary: "CM", pac: 66, sho: 72, pas: 78, dri: 76, def: 74, phy: 84, ovr_base: 84 },

    // Central/attacking midfielders
    { name: "Kevin De Bruyne", real_club: "Manchester City", nation: "Belgium", league: "EPL", position_primary: "CM", position_secondary: "AM", pac: 70, sho: 86, pas: 93, dri: 87, def: 60, phy: 74, ovr_base: 90 },
    { name: "Jude Bellingham", real_club: "Real Madrid", nation: "England", league: "La Liga", position_primary: "AM", position_secondary: "CM", pac: 80, sho: 82, pas: 84, dri: 87, def: 68, phy: 82, ovr_base: 90 },
    { name: "Luka Modric", real_club: "AC Milan", nation: "Croatia", league: "Serie A", position_primary: "CM", position_secondary: "AM", pac: 62, sho: 72, pas: 90, dri: 86, def: 60, phy: 60, ovr_base: 85 },
    { name: "Frenkie de Jong", real_club: "Barcelona", nation: "Netherlands", league: "La Liga", position_primary: "CM", position_secondary: "DM", pac: 70, sho: 62, pas: 86, dri: 84, def: 68, phy: 68, ovr_base: 85 },
    { name: "Martin Odegaard", real_club: "Arsenal", nation: "Norway", league: "EPL", position_primary: "CM", position_secondary: "AM", pac: 68, sho: 78, pas: 88, dri: 86, def: 60, phy: 62, ovr_base: 87 },
    { name: "Bruno Fernandes", real_club: "Manchester United", nation: "Portugal", league: "EPL", position_primary: "CM", position_secondary: "AM", pac: 68, sho: 82, pas: 86, dri: 82, def: 62, phy: 70, ovr_base: 86 },
    { name: "Federico Valverde", real_club: "Real Madrid", nation: "Uruguay", league: "La Liga", position_primary: "CM", position_secondary: "W", pac: 82, sho: 78, pas: 80, dri: 80, def: 72, phy: 82, ovr_base: 87 },
    { name: "Pedri", real_club: "Barcelona", nation: "Spain", league: "La Liga", position_primary: "CM", position_secondary: "AM", pac: 68, sho: 65, pas: 86, dri: 88, def: 60, phy: 62, ovr_base: 87 },
    { name: "Gavi", real_club: "Barcelona", nation: "Spain", league: "La Liga", position_primary: "CM", position_secondary: null, pac: 72, sho: 62, pas: 80, dri: 82, def: 68, phy: 68, ovr_base: 82 },
    { name: "Bernardo Silva", real_club: "Manchester City", nation: "Portugal", league: "EPL", position_primary: "CM", position_secondary: "AM", pac: 72, sho: 72, pas: 86, dri: 88, def: 62, phy: 60, ovr_base: 87 },
    { name: "Ilkay Gundogan", real_club: "Manchester City", nation: "Germany", league: "EPL", position_primary: "CM", position_secondary: null, pac: 62, sho: 72, pas: 84, dri: 80, def: 62, phy: 66, ovr_base: 84 },
    { name: "Marco Verratti", real_club: "Al-Arabi", nation: "Italy", league: "Qatar Stars League", position_primary: "CM", position_secondary: null, pac: 62, sho: 62, pas: 86, dri: 84, def: 64, phy: 58, ovr_base: 83 },
    { name: "Christian Eriksen", real_club: "Manchester United", nation: "Denmark", league: "EPL", position_primary: "CM", position_secondary: "AM", pac: 55, sho: 74, pas: 86, dri: 76, def: 55, phy: 60, ovr_base: 80 },
    { name: "Jamal Musiala", real_club: "Bayern Munich", nation: "Germany", league: "Bundesliga", position_primary: "AM", position_secondary: "W", pac: 82, sho: 78, pas: 82, dri: 92, def: 45, phy: 62, ovr_base: 88 },
    { name: "Florian Wirtz", real_club: "Liverpool", nation: "Germany", league: "EPL", position_primary: "AM", position_secondary: "CM", pac: 76, sho: 80, pas: 84, dri: 90, def: 45, phy: 62, ovr_base: 88 },
    { name: "Cole Palmer", real_club: "Chelsea", nation: "England", league: "EPL", position_primary: "AM", position_secondary: "W", pac: 76, sho: 82, pas: 80, dri: 86, def: 42, phy: 65, ovr_base: 86 },
    { name: "James Maddison", real_club: "Tottenham Hotspur", nation: "England", league: "EPL", position_primary: "AM", position_secondary: "CM", pac: 66, sho: 78, pas: 82, dri: 82, def: 45, phy: 60, ovr_base: 83 },
    { name: "Dominik Szoboszlai", real_club: "Liverpool", nation: "Hungary", league: "EPL", position_primary: "AM", position_secondary: "CM", pac: 76, sho: 78, pas: 82, dri: 82, def: 55, phy: 68, ovr_base: 84 },
    { name: "Rodrygo", real_club: "Real Madrid", nation: "Brazil", league: "La Liga", position_primary: "AM", position_secondary: "W", pac: 88, sho: 78, pas: 76, dri: 86, def: 42, phy: 65, ovr_base: 85 },
    { name: "Paulo Dybala", real_club: "AS Roma", nation: "Argentina", league: "Serie A", position_primary: "AM", position_secondary: "W", pac: 72, sho: 82, pas: 80, dri: 88, def: 35, phy: 58, ovr_base: 83 },

    // Wingers
    { name: "Vinicius Jr", real_club: "Real Madrid", nation: "Brazil", league: "La Liga", position_primary: "W", position_secondary: "ST", pac: 95, sho: 82, pas: 76, dri: 92, def: 35, phy: 65, ovr_base: 89 },
    { name: "Mohamed Salah", real_club: "Liverpool", nation: "Egypt", league: "EPL", position_primary: "W", position_secondary: "ST", pac: 88, sho: 89, pas: 78, dri: 88, def: 42, phy: 72, ovr_base: 89 },
    { name: "Bukayo Saka", real_club: "Arsenal", nation: "England", league: "EPL", position_primary: "W", position_secondary: null, pac: 85, sho: 80, pas: 82, dri: 88, def: 55, phy: 68, ovr_base: 88 },
    { name: "Rafael Leao", real_club: "AC Milan", nation: "Portugal", league: "Serie A", position_primary: "W", position_secondary: "ST", pac: 96, sho: 78, pas: 70, dri: 88, def: 35, phy: 78, ovr_base: 86 },
    { name: "Lamine Yamal", real_club: "Barcelona", nation: "Spain", league: "La Liga", position_primary: "W", position_secondary: null, pac: 88, sho: 78, pas: 80, dri: 92, def: 38, phy: 58, ovr_base: 88 },
    { name: "Nico Williams", real_club: "Athletic Bilbao", nation: "Spain", league: "La Liga", position_primary: "W", position_secondary: null, pac: 94, sho: 74, pas: 72, dri: 88, def: 38, phy: 65, ovr_base: 85 },
    { name: "Khvicha Kvaratskhelia", real_club: "Paris Saint-Germain", nation: "Georgia", league: "Ligue 1", position_primary: "W", position_secondary: null, pac: 86, sho: 78, pas: 76, dri: 90, def: 38, phy: 68, ovr_base: 87 },
    { name: "Ousmane Dembele", real_club: "Paris Saint-Germain", nation: "France", league: "Ligue 1", position_primary: "W", position_secondary: "ST", pac: 92, sho: 80, pas: 74, dri: 88, def: 35, phy: 65, ovr_base: 87 },
    { name: "Raphinha", real_club: "Barcelona", nation: "Brazil", league: "La Liga", position_primary: "W", position_secondary: null, pac: 84, sho: 80, pas: 78, dri: 84, def: 42, phy: 68, ovr_base: 86 },
    { name: "Riyad Mahrez", real_club: "Al-Ahli", nation: "Algeria", league: "Saudi Pro League", position_primary: "W", position_secondary: null, pac: 76, sho: 78, pas: 78, dri: 86, def: 35, phy: 58, ovr_base: 82 },
    { name: "Marcus Rashford", real_club: "Barcelona", nation: "England", league: "La Liga", position_primary: "W", position_secondary: "ST", pac: 90, sho: 78, pas: 68, dri: 82, def: 38, phy: 72, ovr_base: 83 },
    { name: "Phil Foden", real_club: "Manchester City", nation: "England", league: "EPL", position_primary: "W", position_secondary: "AM", pac: 80, sho: 80, pas: 82, dri: 88, def: 45, phy: 60, ovr_base: 86 },
    { name: "Leroy Sane", real_club: "Bayern Munich", nation: "Germany", league: "Bundesliga", position_primary: "W", position_secondary: null, pac: 90, sho: 78, pas: 72, dri: 84, def: 32, phy: 68, ovr_base: 84 },
    { name: "Serge Gnabry", real_club: "Bayern Munich", nation: "Germany", league: "Bundesliga", position_primary: "W", position_secondary: "ST", pac: 84, sho: 78, pas: 68, dri: 82, def: 32, phy: 68, ovr_base: 82 },
    { name: "Michael Olise", real_club: "Bayern Munich", nation: "France", league: "Bundesliga", position_primary: "W", position_secondary: "AM", pac: 82, sho: 76, pas: 80, dri: 86, def: 35, phy: 62, ovr_base: 84 },
    { name: "Bradley Barcola", real_club: "Paris Saint-Germain", nation: "France", league: "Ligue 1", position_primary: "W", position_secondary: null, pac: 92, sho: 72, pas: 68, dri: 82, def: 30, phy: 62, ovr_base: 81 },
    { name: "Anthony Gordon", real_club: "Newcastle United", nation: "England", league: "EPL", position_primary: "W", position_secondary: null, pac: 88, sho: 72, pas: 68, dri: 80, def: 38, phy: 65, ovr_base: 81 },
    { name: "Jeremy Doku", real_club: "Manchester City", nation: "Belgium", league: "EPL", position_primary: "W", position_secondary: null, pac: 94, sho: 68, pas: 68, dri: 88, def: 32, phy: 65, ovr_base: 82 },

    // Strikers
    { name: "Erling Haaland", real_club: "Manchester City", nation: "Norway", league: "EPL", position_primary: "ST", position_secondary: null, pac: 88, sho: 92, pas: 60, dri: 78, def: 40, phy: 88, ovr_base: 91 },
    { name: "Kylian Mbappe", real_club: "Real Madrid", nation: "France", league: "La Liga", position_primary: "ST", position_secondary: "W", pac: 97, sho: 89, pas: 78, dri: 91, def: 38, phy: 76, ovr_base: 91 },
    { name: "Harry Kane", real_club: "Bayern Munich", nation: "England", league: "Bundesliga", position_primary: "ST", position_secondary: "AM", pac: 68, sho: 90, pas: 82, dri: 80, def: 45, phy: 82, ovr_base: 89 },
    { name: "Robert Lewandowski", real_club: "Barcelona", nation: "Poland", league: "La Liga", position_primary: "ST", position_secondary: null, pac: 72, sho: 90, pas: 72, dri: 78, def: 38, phy: 80, ovr_base: 88 },
    { name: "Victor Osimhen", real_club: "Galatasaray", nation: "Nigeria", league: "Super Lig", position_primary: "ST", position_secondary: null, pac: 88, sho: 86, pas: 62, dri: 78, def: 38, phy: 84, ovr_base: 86 },
    { name: "Lautaro Martinez", real_club: "Inter Milan", nation: "Argentina", league: "Serie A", position_primary: "ST", position_secondary: null, pac: 82, sho: 86, pas: 68, dri: 80, def: 42, phy: 78, ovr_base: 87 },
    { name: "Ollie Watkins", real_club: "Aston Villa", nation: "England", league: "EPL", position_primary: "ST", position_secondary: null, pac: 84, sho: 82, pas: 66, dri: 76, def: 40, phy: 76, ovr_base: 84 },
    { name: "Alexander Isak", real_club: "Newcastle United", nation: "Sweden", league: "EPL", position_primary: "ST", position_secondary: null, pac: 86, sho: 86, pas: 68, dri: 82, def: 35, phy: 74, ovr_base: 86 },
    { name: "Darwin Nunez", real_club: "Liverpool", nation: "Uruguay", league: "EPL", position_primary: "ST", position_secondary: null, pac: 90, sho: 80, pas: 60, dri: 76, def: 38, phy: 82, ovr_base: 82 },
    { name: "Julian Alvarez", real_club: "Atletico Madrid", nation: "Argentina", league: "La Liga", position_primary: "ST", position_secondary: "AM", pac: 78, sho: 82, pas: 76, dri: 82, def: 45, phy: 70, ovr_base: 85 },
    { name: "Dusan Vlahovic", real_club: "Juventus", nation: "Serbia", league: "Serie A", position_primary: "ST", position_secondary: null, pac: 80, sho: 84, pas: 62, dri: 74, def: 35, phy: 82, ovr_base: 83 },
    { name: "Randal Kolo Muani", real_club: "Juventus", nation: "France", league: "Serie A", position_primary: "ST", position_secondary: "W", pac: 90, sho: 78, pas: 66, dri: 78, def: 35, phy: 74, ovr_base: 82 },
    { name: "Gabriel Jesus", real_club: "Arsenal", nation: "Brazil", league: "EPL", position_primary: "ST", position_secondary: "W", pac: 82, sho: 76, pas: 72, dri: 82, def: 40, phy: 68, ovr_base: 81 },
    { name: "Serhou Guirassy", real_club: "Borussia Dortmund", nation: "Guinea", league: "Bundesliga", position_primary: "ST", position_secondary: null, pac: 80, sho: 84, pas: 60, dri: 74, def: 35, phy: 80, ovr_base: 83 }
];

// Indian players — clubs/nation accurate to early-mid 2026 ISL/national squad
// info (Chhetri tagged nation "India" though he's retired from international
// duty; still a valid club player for chemistry purposes).
export const indianPlayers = [
    { name: "Gurpreet Singh Sandhu", real_club: "Bengaluru FC", nation: "India", league: "ISL", position_primary: "GK", position_secondary: null, pac: 48, sho: 16, pas: 55, dri: 40, def: 28, phy: 76, ovr_base: 76 },
    { name: "Vishal Kaith", real_club: "Mohun Bagan Super Giant", nation: "India", league: "ISL", position_primary: "GK", position_secondary: null, pac: 50, sho: 16, pas: 56, dri: 40, def: 28, phy: 74, ovr_base: 75 },
    { name: "Hrithik Tiwari", real_club: "Mohammedan SC", nation: "India", league: "ISL", position_primary: "GK", position_secondary: null, pac: 46, sho: 14, pas: 50, dri: 38, def: 26, phy: 70, ovr_base: 68 },
    { name: "Albino Gomes", real_club: "FC Goa", nation: "India", league: "ISL", position_primary: "GK", position_secondary: null, pac: 46, sho: 14, pas: 52, dri: 38, def: 26, phy: 72, ovr_base: 69 },
    { name: "Sandesh Jhingan", real_club: "FC Goa", nation: "India", league: "ISL", position_primary: "CB", position_secondary: null, pac: 62, sho: 30, pas: 55, dri: 48, def: 74, phy: 78, ovr_base: 74 },
    { name: "Anwar Ali", real_club: "Mohun Bagan Super Giant", nation: "India", league: "ISL", position_primary: "CB", position_secondary: null, pac: 68, sho: 28, pas: 58, dri: 52, def: 72, phy: 74, ovr_base: 73 },
    { name: "Rahul Bheke", real_club: "Bengaluru FC", nation: "India", league: "ISL", position_primary: "CB", position_secondary: "FB", pac: 64, sho: 26, pas: 54, dri: 48, def: 70, phy: 74, ovr_base: 71 },
    { name: "Pritam Kotal", real_club: "Mohun Bagan Super Giant", nation: "India", league: "ISL", position_primary: "CB", position_secondary: "FB", pac: 66, sho: 28, pas: 58, dri: 52, def: 70, phy: 72, ovr_base: 71 },
    { name: "Akash Mishra", real_club: "Mumbai City FC", nation: "India", league: "ISL", position_primary: "FB", position_secondary: null, pac: 78, sho: 40, pas: 60, dri: 62, def: 62, phy: 66, ovr_base: 72 },
    { name: "Roshan Singh Naorem", real_club: "Mumbai City FC", nation: "India", league: "ISL", position_primary: "FB", position_secondary: null, pac: 76, sho: 38, pas: 58, dri: 60, def: 60, phy: 64, ovr_base: 70 },
    { name: "Nikhil Poojary", real_club: "Mumbai City FC", nation: "India", league: "ISL", position_primary: "FB", position_secondary: null, pac: 74, sho: 36, pas: 56, dri: 58, def: 62, phy: 64, ovr_base: 69 },
    { name: "Lalengmawia Ralte", real_club: "Mumbai City FC", nation: "India", league: "ISL", position_primary: "DM", position_secondary: "CM", pac: 62, sho: 44, pas: 66, dri: 60, def: 68, phy: 74, ovr_base: 73 },
    { name: "Jeakson Singh Thounaojam", real_club: "Kerala Blasters", nation: "India", league: "ISL", position_primary: "DM", position_secondary: "CM", pac: 64, sho: 42, pas: 62, dri: 58, def: 66, phy: 72, ovr_base: 71 },
    { name: "Anirudh Thapa", real_club: "Mumbai City FC", nation: "India", league: "ISL", position_primary: "CM", position_secondary: "AM", pac: 68, sho: 58, pas: 70, dri: 68, def: 55, phy: 62, ovr_base: 75 },
    { name: "Sahal Abdul Samad", real_club: "Kerala Blasters", nation: "India", league: "ISL", position_primary: "CM", position_secondary: "AM", pac: 66, sho: 56, pas: 68, dri: 68, def: 50, phy: 58, ovr_base: 73 },
    { name: "Brandon Fernandes", real_club: "FC Goa", nation: "India", league: "ISL", position_primary: "AM", position_secondary: "CM", pac: 64, sho: 62, pas: 74, dri: 70, def: 46, phy: 56, ovr_base: 75 },
    { name: "Pronay Halder", real_club: "East Bengal FC", nation: "India", league: "ISL", position_primary: "DM", position_secondary: null, pac: 58, sho: 36, pas: 58, dri: 52, def: 66, phy: 68, ovr_base: 68 },
    { name: "Ashique Kuruniyan", real_club: "Bengaluru FC", nation: "India", league: "ISL", position_primary: "W", position_secondary: "FB", pac: 82, sho: 52, pas: 60, dri: 66, def: 45, phy: 58, ovr_base: 71 },
    { name: "Lallianzuala Chhangte", real_club: "Mumbai City FC", nation: "India", league: "ISL", position_primary: "W", position_secondary: null, pac: 88, sho: 62, pas: 62, dri: 74, def: 38, phy: 62, ovr_base: 77 },
    { name: "Liston Colaco", real_club: "Mohun Bagan Super Giant", nation: "India", league: "ISL", position_primary: "W", position_secondary: null, pac: 86, sho: 64, pas: 60, dri: 76, def: 36, phy: 60, ovr_base: 76 },
    { name: "Jackichand Singh", real_club: "Punjab FC", nation: "India", league: "ISL", position_primary: "W", position_secondary: null, pac: 84, sho: 56, pas: 58, dri: 70, def: 34, phy: 58, ovr_base: 72 },
    { name: "Manvir Singh", real_club: "Mohun Bagan Super Giant", nation: "India", league: "ISL", position_primary: "ST", position_secondary: "W", pac: 78, sho: 68, pas: 55, dri: 65, def: 36, phy: 68, ovr_base: 74 },
    { name: "Sunil Chhetri", real_club: "Bengaluru FC", nation: "India", league: "ISL", position_primary: "ST", position_secondary: null, pac: 60, sho: 78, pas: 62, dri: 62, def: 32, phy: 66, ovr_base: 77 },
    { name: "Rahim Ali", real_club: "Chennaiyin FC", nation: "India", league: "ISL", position_primary: "ST", position_secondary: null, pac: 76, sho: 66, pas: 52, dri: 62, def: 32, phy: 64, ovr_base: 70 },
    { name: "Farukh Choudhary", real_club: "Jamshedpur FC", nation: "India", league: "ISL", position_primary: "W", position_secondary: "ST", pac: 82, sho: 58, pas: 54, dri: 66, def: 32, phy: 60, ovr_base: 70 }
];

export const formations = Object.values(FORMATIONS);

export const tactics = [
    { name: "Possession Purist", style: "possession", aggression: 30, attack_bias: 65, def_line_height: 70 },
    { name: "Counter Specialist", style: "counter", aggression: 55, attack_bias: 55, def_line_height: 35 },
    { name: "High-Press Zealot", style: "high-press", aggression: 75, attack_bias: 70, def_line_height: 80 },
    { name: "Direct & Physical", style: "direct", aggression: 60, attack_bias: 60, def_line_height: 50 },
    { name: "Tiki-Taka Idealist", style: "possession", aggression: 20, attack_bias: 60, def_line_height: 65 },
    { name: "Gegenpress Fanatic", style: "high-press", aggression: 85, attack_bias: 75, def_line_height: 85 },
    { name: "Park-the-Bus Pragmatist", style: "counter", aggression: 40, attack_bias: 25, def_line_height: 20 },
    { name: "Total Football Disciple", style: "possession", aggression: 35, attack_bias: 70, def_line_height: 72 },
    { name: "Long-Ball Route One", style: "direct", aggression: 65, attack_bias: 55, def_line_height: 45 },
    { name: "Wing-Play Maestro", style: "counter", aggression: 45, attack_bias: 68, def_line_height: 55 },
    { name: "Defensive Pragmatist", style: "counter", aggression: 50, attack_bias: 30, def_line_height: 25 },
    { name: "Youth-Focused Idealist", style: "possession", aggression: 25, attack_bias: 55, def_line_height: 60 }
];

export const coaches = [
    { name: "Carlo Ferreira", preferred_style: "possession" },
    { name: "Jürgen Voss", preferred_style: "high-press" },
    { name: "Diego Alcántara", preferred_style: "counter" },
    { name: "Tony Blackwell", preferred_style: "direct" },
    { name: "Marcelo Rinaldi", preferred_style: "possession" },
    { name: "Erik Solberg", preferred_style: "high-press" },
    { name: "José Marín", preferred_style: "counter" },
    { name: "Harry Fenwick", preferred_style: "direct" }
];

// Legendary / retired greats — league tagged "Legends" so they're easy to
// filter separately from current-season players.
export const legendaryPlayers = [
    { name: "Lionel Messi", real_club: "Inter Miami", nation: "Argentina", league: "Legends", position_primary: "W", position_secondary: "AM", pac: 78, sho: 92, pas: 91, dri: 96, def: 32, phy: 62, ovr_base: 93 },
    { name: "Cristiano Ronaldo", real_club: "Al-Nassr", nation: "Portugal", league: "Legends", position_primary: "ST", position_secondary: "W", pac: 82, sho: 94, pas: 78, dri: 85, def: 32, phy: 82, ovr_base: 92 },
    { name: "Zinedine Zidane", real_club: "Real Madrid", nation: "France", league: "Legends", position_primary: "AM", position_secondary: "CM", pac: 68, sho: 82, pas: 90, dri: 92, def: 55, phy: 70, ovr_base: 91 },
    { name: "Ronaldinho", real_club: "Barcelona", nation: "Brazil", league: "Legends", position_primary: "W", position_secondary: "AM", pac: 82, sho: 84, pas: 86, dri: 96, def: 30, phy: 68, ovr_base: 91 },
    { name: "Ronaldo Nazário", real_club: "Real Madrid", nation: "Brazil", league: "Legends", position_primary: "ST", position_secondary: null, pac: 92, sho: 93, pas: 68, dri: 90, def: 25, phy: 78, ovr_base: 92 },
    { name: "Andrés Iniesta", real_club: "Barcelona", nation: "Spain", league: "Legends", position_primary: "CM", position_secondary: "AM", pac: 65, sho: 72, pas: 90, dri: 92, def: 60, phy: 55, ovr_base: 89 },
    { name: "Xavi Hernández", real_club: "Barcelona", nation: "Spain", league: "Legends", position_primary: "CM", position_secondary: null, pac: 55, sho: 65, pas: 93, dri: 84, def: 62, phy: 52, ovr_base: 89 },
    { name: "Thierry Henry", real_club: "Arsenal", nation: "France", league: "Legends", position_primary: "ST", position_secondary: "W", pac: 90, sho: 89, pas: 78, dri: 88, def: 32, phy: 72, ovr_base: 90 },
    { name: "Didier Drogba", real_club: "Chelsea", nation: "Ivory Coast", league: "Legends", position_primary: "ST", position_secondary: null, pac: 78, sho: 88, pas: 68, dri: 78, def: 40, phy: 88, ovr_base: 88 },
    { name: "Wayne Rooney", real_club: "Manchester United", nation: "England", league: "Legends", position_primary: "ST", position_secondary: "AM", pac: 76, sho: 86, pas: 76, dri: 82, def: 42, phy: 78, ovr_base: 87 },
    { name: "Frank Lampard", real_club: "Chelsea", nation: "England", league: "Legends", position_primary: "CM", position_secondary: "AM", pac: 62, sho: 84, pas: 82, dri: 76, def: 62, phy: 76, ovr_base: 87 },
    { name: "Steven Gerrard", real_club: "Liverpool", nation: "England", league: "Legends", position_primary: "CM", position_secondary: "AM", pac: 70, sho: 85, pas: 84, dri: 78, def: 65, phy: 78, ovr_base: 88 },
    { name: "Paolo Maldini", real_club: "AC Milan", nation: "Italy", league: "Legends", position_primary: "CB", position_secondary: "FB", pac: 72, sho: 35, pas: 72, dri: 62, def: 92, phy: 82, ovr_base: 90 },
    { name: "Andrea Pirlo", real_club: "Juventus", nation: "Italy", league: "Legends", position_primary: "DM", position_secondary: "CM", pac: 50, sho: 78, pas: 92, dri: 78, def: 62, phy: 60, ovr_base: 88 },
    { name: "Kaká", real_club: "AC Milan", nation: "Brazil", league: "Legends", position_primary: "AM", position_secondary: "CM", pac: 84, sho: 82, pas: 84, dri: 88, def: 40, phy: 68, ovr_base: 88 },
    { name: "Zlatan Ibrahimović", real_club: "AC Milan", nation: "Sweden", league: "Legends", position_primary: "ST", position_secondary: null, pac: 68, sho: 90, pas: 74, dri: 84, def: 35, phy: 88, ovr_base: 89 },
    { name: "David Beckham", real_club: "Manchester United", nation: "England", league: "Legends", position_primary: "W", position_secondary: "FB", pac: 72, sho: 82, pas: 90, dri: 76, def: 45, phy: 65, ovr_base: 86 },
    { name: "Raúl González", real_club: "Real Madrid", nation: "Spain", league: "Legends", position_primary: "ST", position_secondary: "W", pac: 76, sho: 86, pas: 74, dri: 80, def: 32, phy: 68, ovr_base: 87 },
    { name: "Iker Casillas", real_club: "Real Madrid", nation: "Spain", league: "Legends", position_primary: "GK", position_secondary: null, pac: 55, sho: 18, pas: 62, dri: 45, def: 30, phy: 78, ovr_base: 89 },
    { name: "Gianluigi Buffon", real_club: "Juventus", nation: "Italy", league: "Legends", position_primary: "GK", position_secondary: null, pac: 50, sho: 16, pas: 58, dri: 42, def: 28, phy: 82, ovr_base: 91 },
    { name: "Diego Maradona", real_club: "Napoli", nation: "Argentina", league: "Legends", position_primary: "AM", position_secondary: "W", pac: 80, sho: 87, pas: 86, dri: 96, def: 30, phy: 68, ovr_base: 93 },
    { name: "Pelé", real_club: "Santos", nation: "Brazil", league: "Legends", position_primary: "ST", position_secondary: "AM", pac: 84, sho: 92, pas: 78, dri: 92, def: 32, phy: 76, ovr_base: 94 },
    { name: "Roberto Carlos", real_club: "Real Madrid", nation: "Brazil", league: "Legends", position_primary: "FB", position_secondary: null, pac: 88, sho: 72, pas: 74, dri: 82, def: 72, phy: 82, ovr_base: 87 },
    { name: "Cafu", real_club: "AC Milan", nation: "Brazil", league: "Legends", position_primary: "FB", position_secondary: null, pac: 86, sho: 55, pas: 70, dri: 76, def: 74, phy: 78, ovr_base: 85 },
    { name: "Xabi Alonso", real_club: "Real Madrid", nation: "Spain", league: "Legends", position_primary: "DM", position_secondary: "CM", pac: 55, sho: 74, pas: 88, dri: 72, def: 74, phy: 68, ovr_base: 87 }
];