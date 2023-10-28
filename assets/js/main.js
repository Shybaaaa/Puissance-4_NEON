const menu = document.getElementById("menu");
const parentGrille = document.getElementById("grilleJeux");
const reglement = document.getElementById("reglement");
let tailleGrille = 8;
let grilleVirtuelle = new Array(tailleGrille * tailleGrille);
let joueurCible = 0;
let popup = document.getElementById("popup");
let titlePopup = document.getElementById("title-popup");
let peutJouer = false;
let nombrePionAAlignes = 4;
let joueurListe = ["rouge", "jaune", "cyan", "vert"];
let nombreJoueurEnJeux = 2;

//Permet d'obtenir un point unidimensionnelle grace à un point multidimensionnelle
function ObtenirPoint(x, y) {
  return y * tailleGrille + x;
}

//Permet d'assigner une valeur à un point, dans le tableau virtuelle, selon 'joueurCible'
function AssignerPointJoueur(x) {
  //1. Obtenir le nombre de pion, dans cette colonne + gerer les execptions
  let lColone = ColoneLongueur(x);
  if (!peutJouer) return; // Arreter la suite des instructions
  if (lColone >= tailleGrille) return; // Arreter la suite des instructions
  //2. Assigner le pion du joueur à la cellule correcte
  grilleVirtuelle[ObtenirPoint(x, lColone)] = joueurCible;
  let ref = document.getElementById("grilleJeux").childNodes[0].childNodes[0]
    .childNodes[tailleGrille - 1 - lColone].childNodes[x];
  ref.setAttribute("class", joueurListe[joueurCible]);
  //3. verifie si le joueur actuelle est gagnant ou non (+ finir le jeu si la grille est complète)
  if (VerifierVictoire(x, lColone)) {
    FinSession(`Le joueur ${joueurListe[joueurCible]} est victorieux !`); // fin du jeu
  } else if (ColoneLongueur(0, 7) >= tailleGrille * tailleGrille) {
    FinSession("Toute la grille est fini !");
  }
  joueurCible = joueurCible < nombreJoueurEnJeux - 1 ? joueurCible + 1 : 0; // Passer au joueur suivant
}

//Permet de commencer la session de jeu
function CommencerSession() {
  joueurCible = 0;
  document.title = "Puissance 4 - En jeu";
  grilleVirtuelle = new Array(tailleGrille * tailleGrille);
  
  genererTableauPhysique();
  menu.style.display = "none";
  AfficherMenuRegle(false);
  peutJouer = true;
}

//Permet de finir la session de jeu
function FinSession(message) {
  //message va permet de savoir pourquoi c'est fini, pour le joueur
  peutJouer = false;
  popup.classList.remove("hidden");
  titlePopup.innerText = message;
  new Timeur(2, () => {
    parentGrille.innerHTML = "";
    menu.style.display = "flex";
    popup.classList.add("hidden");
  });
  document.title = "Puissance 4 - Acceuil"
}

//Permet de generer un tableau (HTML)
function genererTableauPhysique() {
  let table = "<table>";
  for (let x = 0; x < tailleGrille; x++) {
    table += "<tr>";
    for (let y = 0; y < tailleGrille; y++) {
      table += `<td onclick="AssignerPointJoueur(${y})"></td>`;
    }
    table += "</tr>";
  }
  table += "</table>";
  parentGrille.innerHTML = table;
}

//Permet de vérifier la victoire selon le pion du joueur actuelle
function VerifierVictoire(x, y) {
  for (let i = 0; i < 4; i++) {
    //2. trouver le nombre de pions alignes dans le meme plan (en comptant le nombre de pions à gauche et à droite) + obtenir 'angle'
    let pionsAlignes = 1;
    let angle = i * 45;
    for (let c = 0; c < 2; c++) {
      //2a. trouver le vecteur directeur
      let directionVerifX = Math.round(Math.cos((Math.PI / 180) * angle));
      let directionVerifY = Math.round(Math.sin((Math.PI / 180) * angle));
      //2b. Compter le nombre de pions comptes dans une direction (changer de direction si un pion rencontre n'est pas celui du joueur actuelle)
      for (let iteration = 1; iteration < nombrePionAAlignes; iteration++) {
        let pointAVefivierX = x + directionVerifX * iteration;
        let pointAVefivierY = y + directionVerifY * iteration;
        if (
          grilleVirtuelle[ObtenirPoint(pointAVefivierX, pointAVefivierY)] ==
          joueurCible
        ) {
          pionsAlignes++;
          if (pionsAlignes >= nombrePionAAlignes) return true; // C'est que le joueur actuelle a gagne ! *wouhouu*
        } else break;
      }
      angle += 180; //inverser l'angle
    }
  }
  return false; // >> la partie continue
}

//Permet de savoir combien de pion se trouve dans la colone 'x'
function ColoneLongueur(x, rang = 0) {
  let longueur = 0; // valeur qui va contenir la 'longueur' de la colone
  for (let i = x; i <= x + rang; i++) {
    for (let index = 0; index < tailleGrille; index++) {
      longueur += grilleVirtuelle[ObtenirPoint(i, index)] != undefined ? 1 : 0;
    }
  }
  return longueur;
}

let menuRegleEstAfficher = false;
function AfficherMenuRegle(estAfficher){
  menuRegleEstAfficher = estAfficher!=null ? estAfficher : !menuRegleEstAfficher;
  reglement.style.display = menuRegleEstAfficher ? "grid" : "none"; 
}