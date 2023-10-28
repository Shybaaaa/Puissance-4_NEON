//classe timeur
class Timeur{

    constructor(tempDemande,quandTimeurFini,aChaqueSecondeEcoule){
        this.processus = null;
        this.tempRestant = tempDemande ? tempDemande : 120;
        this.aChaqueSecondeEcoule = aChaqueSecondeEcoule ? aChaqueSecondeEcoule : null;
        this.quandTimeurFini = quandTimeurFini ? quandTimeurFini : null;
        this.LancerTimeur();
    }

    LancerTimeur(){
        if(this.processus == null){
            this.processus = setInterval(()=>{
                this.ActualiserTimeur();
            },1000)
        }
    }

    StopperTimeur(){
        clearInterval(this.processus);
        this.processus = null;
    }

    ActualiserTimeur(){
        if(this.tempRestant > 0){
            this.tempRestant--;
            if(this.aChaqueSecondeEcoule) this.aChaqueSecondeEcoule();
        }
        else{
            this.quandTimeurFini();
            this.StopperTimeur();
        }
    }

}