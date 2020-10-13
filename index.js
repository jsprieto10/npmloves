const pbkdf2Hmac = require('pbkdf2-hmac');
var btoa = require('btoa');
var fs = require('fs');
var fernet = require('fernet')
const translate = require('google-translate-open-api').default;

async function passwordToKey(passwordProvided) {
    let salt = '\xef\xfc\xb0\x00\x0b\xb5E\x95\xa8\xb8\x12\x9ch\xed&q'
    const derivedKey = await pbkdf2Hmac(passwordProvided, salt, 100000, 32)
    let base64String = btoa(String.fromCharCode(...new Uint8Array(derivedKey)));
    return base64String
}

function writeFile(file, token) {
    fs.open(file, 'w', (err, fd) => {
        let buf = Buffer.from(token),
            pos = 0, offset = 0,
            len = buf.length;

        fs.write(fd, buf, offset, len, pos, () => { });
    })
}



async function encryptFile(password, path) {

    let key = await passwordToKey(password)
    var secret = new fernet.Secret(key);
    var token = new fernet.Token({
        secret: secret,
    })

    fs.stat(path, function (error, stats) {

        // 'r' specifies read mode 
        fs.open(path, "r", function (error, fd) {
            var buffer = new Buffer.alloc(stats.size);
            fs.read(fd, buffer, 0, buffer.length,
                null, function (error, bytesRead, buffer) {
                    writeFile(path + ".bejaranoEncrypt", token.encode(buffer.toString()))
                });
        });
    });
}



async function decryptFile(password, path) {

    let key = await passwordToKey(password)
    var secret = new fernet.Secret(key);



    fs.stat(path, function (error, stats) {

        // 'r' specifies read mode 
        fs.open(path, "r", function (error, fd) {
            var buffer = new Buffer.alloc(stats.size);
            fs.read(fd, buffer, 0, buffer.length,
                null, function (error, bytesRead, buffer) {

                    var token = new fernet.Token({
                        secret: secret,
                        token: buffer.toString(),
                        ttl: 0
                    })

                    console.log(token.decode())
                    writeFile(path.split('.').slice(0, -1).join('.'), token.decode())

                });
        });
    });

}

async function sayLove(){


    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    let langs ="af,sq,am,ar,hy,az,eu,be,bn,bs,bg,ca,ceb,zh-CN,zh-TW,co,hr,cs,da,nl,en,eo,et,fi,fr,fy,gl,ka,de,el,gu,ht,ha,haw,he,hi,hmn,hu,is,ig,id,ga,it,ja,jv,kn,kk,km,ko,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,ny,ps,fa,pl,pt,pa,ro,ru,sm,gd,sr,st,sn,sd,si,sk,sl,so,es,su,sw,sv,tl,tg,ta,te,th,tr,uk,ur,uz,vi,cy,xh,yi,yo,zu".split(',')
    let dic={"af":"Afrikáans","sq":"Albanés","am":"Amárico","ar":"Árabe","hy":"Armenio","az":"Azerí","eu":"Vasco","be":"Bielorruso","bn":"Bengalí","bs":"Bosnio","bg":"Búlgaro","ca":"Catalán","ceb":"Cebuano","zh-CN":"Chino (simplificado)","zh-TW":"Chino (tradicional)","co":"Corso","hr":"Croata","cs":"Checo","da":"Danés","nl":"Holandés","en":"Inglés","eo":"Esperanto","et":"Estonio","fi":"Finlandés","fr":"Francés","fy":"Frisón","gl":"Gallego","ka":"Georgiano","de":"Alemán","el":"Griego","gu":"Guyaratí","ht":"Criollo haitiano","ha":"Hausa","haw":"Hawaiano","he":"Hebreo","hi":"Hindi","hmn":"Hmong","hu":"Húngaro","is":"Islandés","ig":"Igbo","id":"Indonesio","ga":"Irlandés","it":"Italiano","ja":"Japonés","jv":"Javanés","kn":"Canarés","kk":"Kazajo","km":"Jemer","ko":"Coreano","ku":"Kurdo","ky":"Kirguís","lo":"Laosiano","la":"Latín","lv":"Letón","lt":"Lituano","lb":"Luxemburgués","mk":"Macedonio","mg":"Malgache","ms":"Malayo","ml":"Malabar","mt":"Maltés","mi":"Maorí","mr":"Maratí","mn":"Mongol","my":"Birmano","ne":"Nepalí","no":"Noruego","ny":"Nyanja (Chichewa)","ps":"Pastún","fa":"Persa","pl":"Polaco","pt":"Portugués (Portugal y Brasil)","pa":"Panyabí","ro":"Rumano","ru":"Ruso","sm":"Samoano","gd":"Gaélico escocés","sr":"Serbio","st":"Sesoto","sn":"Shona","sd":"Sindhi","si":"Cingalés","sk":"Eslovaco","sl":"Esloveno","so":"Somalí","es":"Español","su":"Sundanés","sw":"Suajili","sv":"Sueco","tl":"Tagalo (filipino)","tg":"Tayiko","ta":"Tamil","te":"Telugu","th":"Tailandés","tr":"Turco","uk":"Ucraniano","ur":"Urdu","uz":"Uzbeko","vi":"Vietnamita","cy":"Galés","xh":"Xhosa","yi":"Yiddish","yo":"Yoruba","zu":"Zulú"}
    
    let ix=getRandomInt(langs.length)
    let lang = langs[ix]

    text = "te amo con todo mi corazón"
    const result = await translate(`I'm fine.`, {
        to: lang,
      });
      console.log("lang:",dic[lang], "translation:" ,result.data[0])
}

sayLove()