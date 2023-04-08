import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import geneararId from "../helpers/generarId.js";


const registrar = async (req, res) => {
    const {nombre, email, password} = req.body;

    //prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email: email})
    if(existeUsuario){
        const error = new Error('Usuario previamente registrado');
        return res.status(400).json({msg: error.message});
    }


    try {
        //registrar usuario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save()
        res.json(veterinarioGuardado)
        
    } catch (error) {
        console.error(error)
    }
    
};

const perfil =  (req, res) => {
    const {veterinario} = req

    res.json({veterinario})
};

const confirmar = async (req, res) => {
    const {token} = req.params;

    const usuarioConfirmar = await Veterinario.findOne({token});
    if(!usuarioConfirmar){
        const error = new Error('Token no valido')

        return res.status(404).json({msg: error.message})
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({msg: 'Usuario Confirmado Correctamente'})
    } catch (error) {
        console.log(error);
    }
}

const autenticar = async (req, res) => {
    const {email, password} = req.body;

    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email})

    if(!usuario){
        const error = new Error('El usuario no existe')

        return res.status(403).json({msg: error.message})
    }

    //comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada por correo electrónico')

        return res.status(403).json({msg: error.message})
    }

    //revisar password
    if( await usuario.comprobarPassword(password)){
        //autenticar
        res.json({token: generarJWT(usuario.id)})

    } else{
        const error = new Error('Tu contraseña es incorrecta')

        return res.status(403).json({msg: error.message})
    }


};

const olvidePassword = async (req, res) => {
    const {email} = req.body;
    
    const existeVeterinario = await Veterinario.findOne({email});

    if(!existeVeterinario){
        const error = new Error('El usuario no existe');

        return res.status(400).json({msg: error.message});
    }

    try {
        existeVeterinario.token = geneararId();
        await existeVeterinario.save();
        res.json({msg: 'Hemos enviado un Correo con las instrucciones'})
    } catch (error) {
        console.log(error)
    }

};

const comprobarToken = async (req, res) => {
    const {token} = req.params;
    
    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido){
        res.json({msg: 'Token válido y el usuario existe'});
    }else{
        const error = new Error('Token no válido')

        return res.status(400).json({msg: error.message})
    }
};

const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});

    if(!veterinario){
        const error = new Error('Token no válido')

        return res.status(400).json({msg: error.message})
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: 'Contraseña modificada correctamente'})
        console.log(veterinario)
    } catch (error) {
        console.log(error);
    }
};


export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}