let nombre_usuarioLogueado;
let btc;
let btcColateral;
let prestamo;
let prestamoSolicitado;
let tvl;
let dolares;
let cant_btc;
let capacidadCrecito;
let col;
let pre;
let techo;

//---------------------------------
let api = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

fetch(api)
    .then(response=>response.json())
    .then(data => {
        btc = JSON.stringify(data.bitcoin.usd);
        btc = parseInt(btc);
        })

//---

let logueado =[];

let usuarios = [
    { nombre:"Mario",pass:12345,colateral:3,prestamo:9500},
    { nombre:"Luisa",pass:54321,colateral:7,prestamo:5500},
    { nombre:"Marga",pass:"asdfg",colateral:1,prestamo:0},
    { nombre:"Messi",pass:"GOAT",colateral:6,prestamo:2000},
    { nombre:"Hernan",pass:"gfdsa",colateral:0.5,prestamo:200},
    { nombre:"a",pass:"a",colateral:0.5,prestamo:100},
];

//funcion para cargar usuarios en local storage, sirve para que se pueda ingresar con un usuario ya creado si no se quiere crear uno  nuevo
let arreglo_JSON = JSON.stringify(usuarios);
localStorage.setItem("arreglo_usuarios" , arreglo_JSON);
let recuperando_usuarios = localStorage.getItem("arreglo_usuarios");
// console.log("arr:  ",recuperando_usuarios);

//en caso de no existir el usuario, lo crea, lo mete en el array y despues en localstorage
function inicializarUsuarios(){
    
    let nombre_usuario = document.getElementById("nuevoNombredeUsuario");
    let pass_usuario = document.getElementById("nuevaContrasena");
    let usuario = {nombre:nombre_usuario.value , pass:pass_usuario.value, colateral:0, prestamo: 0};
    usuarios.push(usuario);
    let arreglo_JSON = JSON.stringify(usuarios);
    localStorage.setItem("arreglo_usuarios" , arreglo_JSON);
    let recuperando_usuarios = localStorage.getItem("arreglo_usuarios");
   // console.log( recuperando_usuarios );
   // console.log( usuarios.length );

}

//logueo, impacta en el local storage previamente alimentado
function login_usuario(){

    let nombre_usuario = document.getElementById("nombreUsuario");
    let pass_usuario = document.getElementById("contrasena");
    let recuperando_usuarios = localStorage.getItem("arreglo_usuarios");

    recuperando_usuarios = JSON.parse(recuperando_usuarios);
    // console.log(recuperando_usuarios);

    for( let u of recuperando_usuarios){

        if( nombre_usuario.value == u.nombre && pass_usuario.value == u.pass){
            //funcion para calcular el total value lock en la plataforma
            function calculoTvl(acu,x){
                acu=acu+x.colateral*btc;
                return acu;
            }
            tvl = usuarios.reduce(calculoTvl,0);
           
            dibujarPostlogueo(u.nombre,u.colateral,u.prestamo,tvl);
            nombre_usuarioLogueado = u.nombre;
            //funcion para calcular el BTC de colateral del usuario logueado
            //funcion para calcular el prestamo que tiene sacado el usuario logueado
            
            function cantidadBTCCyPrestamo (x){
                return x.nombre==nombre_usuarioLogueado;
            }
            a= usuarios.filter(cantidadBTCCyPrestamo);
            colaterales = a.map(usuario => usuario.colateral);
            btcColateral = colaterales[0];
            prestamo = a.map(usuario => usuario.prestamo);
            prestamoSolicitado = prestamo[0];
            
        }
        else{
           // console.log("USUARIO NO REGISTRADO");
           document.getElementById("no").innerHTML = "Usuario o contraseña incorrectos.";
        }
    }
}



//escuchador  boton 
document.getElementById("ingresar").addEventListener("click", login_usuario);
document.getElementById("crearUsuario").addEventListener("click", inicializarUsuarios);



//cantidad de prestamos dados
function cantidadPrestamos (x){
    return x.prestamo>0;
}
let cantidadP = usuarios.filter(cantidadPrestamos).length;



//dibuja el html tras loguearse
function dibujarPostlogueo(quienEs,colat,prest,tvl){
    document.getElementById("logout").style.display = "block";
    let user = quienEs;
    col = colat;

    pre = prest;
    let totalUsuarios = usuarios.length;
    //calcular hasta cuanto puede pedir
    techo = ((col*btc)*0.60)-pre;
    document.getElementById("logueoRegistro").innerHTML = ``;
    document.getElementById("dejarColateral").style.display="block";
    document.getElementById("main").innerHTML = 
    `<div id="precioBTC">
        El precio de BTC es de ${btc} USDC
    </div>
    <div id="header">
        Cantidad total de valor asegurado<span id="tvl"> $ ${tvl}</span> - Prestamos otorgados </span id="cantidadPrestamos">${cantidadP} </span> - Total de usuarios activos <span id="totalUsuarios">${totalUsuarios}</span>
    </div>
    <div id="dataUsuario" class="destello">
        Usuario: ${user} - Cantidad de BTC como colateral <span id="btcColateral"> ${col} </span> - Cantidad de prestamo solicitado </span id="cantidadPrestamos">$ ${pre} </span> - Puede solicitar hasta <span id="techo">$ ${techo}</span>
    </div>  
    `;

    //escuchador para boton 
    document.getElementById("recibirColateral").addEventListener("click", recibirColateral);
}

function calculoColateral(colateral){
    let prestamo=(btc*colateral)*0.60;
    return prestamo;
}

function pedirPrestamo(){
    var cant_Prestamo=document.getElementById("cantidadDeUSDC").value;
    if (Number(cant_Prestamo)){
        
        if(cant_Prestamo<=capacidadCrecito){
            document.getElementById("pedidoPrestamo").innerHTML =`<div id="pedistePrestado">Pediste ${cant_Prestamo} USDC prestados</div>`;
            let obj = usuarios.find(x => x.nombre === nombre_usuarioLogueado);
            obj.prestamo += parseInt(cant_Prestamo);
            let arreglo_JSON = JSON.stringify(usuarios);
            localStorage.setItem("arreglo_usuarios" , arreglo_JSON);
            redibujarDattrassacarprestamo (nombre_usuarioLogueado);
            Toastify({
                text: "El préstamo se ha solicitado con éxito",
                duration: 3000,
                gravity: "bottom",
                style: {
                    background: "linear-gradient(to right, #1fdd32 , #0b5913)",
                  }
                }).showToast();
            let inputCantidadUSDC = document.getElementById('cantidadDeUSDC');
            inputCantidadUSDC.value = '';
            
            console.log(usuarios);
        }else{
            document.getElementById("pedidoPrestamo").innerHTML =`<br>No puedes pedir mas de ${capacidadCrecito} USDC prestados`;
        }
        document.getElementById("validarNumero2").innerHTML = ``;
    }else{
        document.getElementById("validarNumero2").innerHTML = `Debes ingresar solo numeros`;
    }
}

function recibirColateral(){   
    cant_btc=document.getElementById("cantidadDeBTC").value;
    
    if (Number(cant_btc)){
        
        dolares=cant_btc*btc;
        cant_btc = parseInt(cant_btc); 
        prestamoSolicitado = parseInt(prestamoSolicitado); 
        btcColateral = parseFloat(btcColateral)
        capacidadCrecito=((cant_btc+btcColateral)*btc)*0.60-prestamoSolicitado;
        
        let inputCantidad = document.getElementById('cantidadDeBTC');
        inputCantidad.value = '';
        redibujarData (cant_btc,dolares,capacidadCrecito);     

        //escuchador para boton 
        document.getElementById("dibujarPedirprestamo").addEventListener("click", dibujarPedirprestamo);
        
        document.getElementById("validarNumero").innerHTML = ``;
        let obj = usuarios.find(x => x.nombre === nombre_usuarioLogueado);
        obj.colateral += cant_btc;
        console.log(usuarios);
        let arreglo_JSON = JSON.stringify(usuarios);
        localStorage.setItem("arreglo_usuarios" , arreglo_JSON);
        Toastify({
            text: "EL colateral ha sido depositado con éxito",
            duration: 3000,
            gravity: "bottom",
            style: {
                background: "linear-gradient(to right, #1fdd32 , #0b5913)",
              }
            }).showToast();
        return capacidadCrecito;
        
    }else{
        document.getElementById("validarNumero").innerHTML = `Debes ingresar solo numeros`;
    }
}

function dibujarPedirprestamo(){
    document.getElementById("pedirPrestamo").innerHTML =
    `<div id="inserteCantPres">
    Inserte la cantidad de USDC que desea pedir prestado: 
    <input type="text" id="cantidadDeUSDC"/> 
    <input type="button" value="Pedir prestamo" id="pedPrestamo"/><br>

    </div>`;
    //escuchador para boton 
    document.getElementById("pedPrestamo").addEventListener("click", pedirPrestamo);

}


function redibujarData (cant_btc,dolares,capacidadCrecito,){
   
    document.getElementById("hide").style.display = "block";
    document.getElementById("cantidadBTC").innerHTML = `${cant_btc} BTC como colateral, equivalente a ${dolares} USDC.<br><br>
    Recuerde que puede sacar un crédito que no supere el 60% de lo que ya ha depositado.<br><br>Capacidad crediticia de ${capacidadCrecito} USDC <input type="button" value="Pedir Prestamo" id="dibujarPedirprestamo">`;

    document.getElementById("dataUsuario").innerHTML = `
    Usuario: ${nombre_usuarioLogueado} - Cantidad de BTC como colateral <span id="btcColateral"> ${col+cant_btc} </span> - Cantidad de prestamo solicitado </span id="cantidadPrestamos">$ ${pre} </span> - Puede solicitar hasta <span id="techo">$ ${capacidadCrecito}</span>
    `;

}

function redibujarDattrassacarprestamo (u){

    let recuperando_usuarios = localStorage.getItem("arreglo_usuarios");
    recuperando_usuarios = JSON.parse(recuperando_usuarios);
    let usuario = recuperando_usuarios.find(usuario => usuario.nombre === u);


    document.getElementById("dataUsuario").innerHTML = `
    Usuario: ${u} - Cantidad de BTC como colateral <span id="btcColateral"> ${usuario.colateral} </span> - Cantidad de prestamo solicitado </span id="cantidadPrestamos">$ ${usuario.prestamo} </span> - Puede solicitar hasta <span id="techo">$ ${((btc*usuario.colateral)*0.60)-usuario.prestamo}</span>
    `;
    document.getElementById("hide").style.display = "none";

};


