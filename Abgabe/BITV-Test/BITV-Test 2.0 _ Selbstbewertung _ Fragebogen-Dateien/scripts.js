// Konfigurationsvariablen
var grenzwert = 95;             // minimale Punktzahl, um teilnehmen zu duerfen


// Initialisierung von globalen Variablen
var anzahlFehlschritte = 0;     // Zahl noch fehlenden Schritte
var anzahlBearbeiteteSchritte = 0; // Zahl bewerteten Schritte
var moeglicheSumme = 0;         // moegliche Punktzahl der bewerteten Schritte
var fehlSumme = 0;              // Summe der Abzuege (Antworten 'teilweise' und 'nein')
var erreichbar = 0;             // noch erreichbare Gesamt-Punktzahl
var note = 5;                   // Note

// Berechnet die Punkte
function summePunkte (check) {
    var summe = 0; // erreichte Punkte
    var ausgefuellt = true;
    var abwertung = false;
    anzahlFehlschritte = 0;
    moeglicheSumme = 0;
    fehlSumme = 0;
    erreichbar = 0;
    note = 5;
    var i = 0;
    do {
        antwort = 'antwort[' + i + ']';
        abzug = 'abzug[' + i + ']';
        currWert = parseFloat(document.forms[0].elements[antwort].value);
        if (isNaN(currWert)) currWert = document.forms[0].elements[antwort].value;
        currAbwertung = parseFloat(document.forms[0].elements[abzug].value);
        switch (currWert) {
        case -1:
            punkte = 0;
            ausgefuellt = false;
            anzahlFehlschritte++;
            break;
        case 'aw5':
            abwertung += 5;
            break;
        case 'aw4':
            abwertung += 4;
            break;
        case 'aw3':
            abwertung += 3;
            break;
        default:
            moeglicheSumme += currAbwertung;
            if (currWert < 0) {
                summe += currAbwertung;
            } else {
                summe += currAbwertung - currWert;
                fehlSumme += currWert;
            }
        }
        i++;
        nextantwort = 'antwort[' + i + ']';
    } while (document.forms[0].elements[nextantwort]);
    // Anzahl der Pruefschritte fuer spaetere Berechnungen
    anzahlPruefschritte = i;
    // noch erreichbare Punkte
    erreichbar = 100 - fehlSumme;
    // Anzahl der schon bearbeiteten Schritte
    anzahlBearbeiteteSchritte = anzahlPruefschritte - anzahlFehlschritte;
    if (erreichbar >= 95) {
        note = 'sehr gut zugänglich';
    }
    else if (erreichbar >= 90) {
        note = 'gut zugänglich';
    }
    else if (erreichbar >= 80) {
        note = 'eingeschränkt zugänglich';
    }
    else if (erreichbar < 80) {
        note = 'schlecht zugänglich';
    }

/* Abwertung deaktiviert
    if (abwertung == 3) {
        note = '3 (eingeschränkt zugänglich)';
    }
    if (abwertung == 4) {
        note = '4 (schlecht zugänglich)';
    }
    if (abwertung >= 5) {
        note = '5 (nicht zugänglich)';
    }
*/

    if (check == true) {
        return ausgefuellt;
    } else {
        return summe;
    }
}


var machMit = '\<\/p\><p>Sind Sie eine Agentur oder Privatperson nur? Wollen Sie mit machen, bei den 95plus Sachen? Lassen Sie es krachen!</p>';

// Schreibt die Punkte auf die Seite
function schreibePunkte() {
    summe = summePunkte();
    document.getElementById("stand_bps").firstChild.data = anzahlBearbeiteteSchritte + ' von ' + anzahlPruefschritte;
    fehlSumme = fehlSumme + ' Punkte'; // Typecasting Number -> String, sonst geht replace nicht
    document.getElementById("stand_pa").firstChild.data = fehlSumme.replace(/\./, ',');
    erreichbar = erreichbar + ' Punkte';
    document.getElementById("stand_nep").firstChild.data = erreichbar.replace(/\./, ',');
    document.getElementById("stand_nen").firstChild.data = note;

    if (anzahlBearbeiteteSchritte == anzahlPruefschritte) {
      document.getElementById("stand_nep_label").firstChild.data = 'Erreichte';
      var knoten = document.getElementById("stand_nep_label").firstChild;
      knoten = knoten.nextSibling;
      knoten = knoten.nextSibling;
      knoten.nodeValue = 'Punktzahl';
    } else {
      document.getElementById("stand_nep_label").firstChild.data = 'Noch';
      var knoten = document.getElementById("stand_nep_label").firstChild;
      knoten = knoten.nextSibling;
      knoten = knoten.nextSibling;
      knoten.nodeValue = 'erreichbar';
    }

    return summe;
}
//var jetzt = vormals.replace(/Hinz/, "Kunz, geb. Hinz");


function setGeaendert() {
    document.getElementById("geaendert").value = true;
}

// Schreibt den Submit-Button
function calc (bodyCall) {
    if (bodyCall == true) document.getElementById("geaendert").value = false;
    else setGeaendert();
    schreibePunkte();
    ausgefuellt = summePunkte(true);
    var abschicken = true;
    if(document.forms[0].submitTheForm) {
        document.forms[0].submitTheForm.value = "Bericht anzeigen";
    }
    return abschicken;
}


// pruefen, ob ungespeicherte Aenderungen gemacht wurden
function testAenderungen() {
    if (document.getElementById("geaendert").value == 'true' && document.getElementById("demoversion").value != 'true' ) {
        Check = confirm("Sie haben anscheinend Änderungen am Fragebogen vorgenommen. Wenn Sie Ihre Änderungen speichern möchten, klicken Sie auf 'OK'! Andernfalls klicken Sie auf 'Abbrechen', um Ihre Änderungen zu verwerfen.");
        if (Check == true) {
            document.getElementById("form").submit('speichern');
        }
    }
}

function writeStand() {
    document.write(''+
'<div id="stand">'+
'    <h2 class="stand">Aktueller Stand</h2>' +
'    <table border="1" cellspacing="0" cellpadding="3">' +
'        <tr>' +
'            <th>Bearbeitete<br>Pr&uuml;fschritte</th>' +
'            <td id="stand_bps">0 von 50</td>' +
'        </tr>' +
'        <tr>' +
'            <th>Punktabzug</th>' +
'            <td id="stand_pa">0 Punkte</td>' +
'        </tr>' +
'        <tr>' +
'            <th id="stand_nep_label">Noch<br>erreichbar</th>' +
'            <td id="stand_nep">100 Punkte</td>' +
'        </tr>' +
'        <tr>' +
'            <th>Erreichbare Bewertung</th>' +
'            <td id="stand_nen">&nbsp;</td>' +
'        </tr>' +
'    </table>' +
'</div>' +
'');
}


// TBD
function hideStand() {
    document.getElementById("standPHP").style.display = "none";
}
// TBD Ende


function hideAktualisieren() {
    document.getElementById("speichern1").style.display = "none";
}


function changeTitle() {
    document.getElementById("titleTBC").firstChild.data = 'Aktueller Stand';
}


// neue Fenster ankuendigen
function aNeuesFenster() {
    if (document.getElementById) {
        var anker = '';
        var i = 0;
        var test = '';
        do {
            anker += document.links[i].className;
            if (document.links[i].className == 'neuesFenster' || document.links[i].className == 'neuesFenster pfeil') {
                document.links[i].title = document.links[i].title + ' (neues Fenster)';

/*
            if (navigator.appName == 'Microsoft Internet Explorer') {
                document.links[i].href = 'javascript: void window.open(\'' + document.links[i].href +'\');';
            }
*/
//                document.getElementsByTagName("a")[i].setAttribute("onClick", "window.open('" + document.links[i].href + "','toolbar=1, menubar=1, location=1, status=1, scrollbars=1, resizable=1'); return false;");
//                document.links[i].setAttribute("onClick", "window.open(this.href, 'new', 'toolbar=1, menubar=1, location=1, status=1, scrollbars=1, resizable=1'); return false;");
//                document.links[i].setAttribute("onclick", "window.open(this); return false;");//,'toolbar=1, menubar=1, location=1, status=1, scrollbars=1, resizable=1'); return false");
            }
            i++;
        } while (i <= document.links.length-1);
    }
}


// neue Fenster ankuendigen
function setOnchange() {
    if (document.getElementById) {
        var i = 0;
        do {
            var ding = document.forms[0].elements[i].type;
            if (ding == 'text' || ding == 'textarea' || ding == 'checkbox') {
                document.forms[0].elements[i]['onchange'] = new Function("setGeaendert();");
            }
/*
if (ding == 'select-one') {
                document.forms[0].elements[i]['onchange'] = new Function("calc(); setGeaendert();");
            }
*/
            i++;
        } while (i <= document.forms[0].elements.length-1);
    }
}

