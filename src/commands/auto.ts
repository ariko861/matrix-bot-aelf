import { MatrixClient, MentionPill, MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";
import { runMesseCommand } from "./messe";

const cron = require('node-cron');
const db = require('../sqlite');

function formatTime(time) {
    var result = "", m;
    var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
    if ((m = time.match(re))) {
        result = (m[1].length === 2 ? "" : "0") + m[1] + ":" + m[2];
    }
    return result;
}


export async function runAutoCommand(roomId: string, args: string[], client: MatrixClient) {
    // The first argument is always going to be us, so get the second argument instead.
    let dailytime = args[1];
    if (!dailytime) {
        var d = new Date();
        dailytime = d.toLocaleTimeString("fr-FR", {hour12: false});
    } else {
       dailytime = formatTime(dailytime);
       if ( !dailytime ) {
           let text = `L'heure doit être donnée sous le format 00:00 et comprise entre 00:00 et 23:59`;
           return client.sendMessage(roomId, {
               body: text,
               msgtype: "m.notice",
               format: "org.matrix.custom.html",
                   formatted_body: text,
           });
           
       }
    }
    
    db.insertCron(roomId, dailytime, function(){
        let text = 'Le bot AELF est maintenant programmé pour donner les lectures tous les jours à ' + `${dailytime}`;
        let html = 'Le bot AELF est maintenant programmé pour donner les lectures tous les jours à ' + `${dailytime}`;
        return client.sendMessage(roomId, {
            body: text,
            msgtype: "m.notice",
            format: "org.matrix.custom.html",
            formatted_body: html,
        });
    });
    
    
    
    //let dtime = dailytime.split(':');
    //dailytime = dtime[0] + ":" + dtime[1] // Pour supprimer les secondes dans l'affichage du temps
    
    //if ( dtime[1] === "00" ) dtime[1] = "0";
    //if ( dtime[0] === "00" ) dtime[0] = "0";
    //let crontext = dtime[1] + ' ' + dtime[0] + ' * * *';
    
    //cron.schedule(crontext, function() {
    //    return runMesseCommand(roomId, ['messe'], client);
    //});
    
    //return runMesseCommand(roomId, ['messe'], client);
    
    

    
}
