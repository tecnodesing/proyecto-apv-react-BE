import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;

    //enviar email
    const info = await transport.sendMail({
        from: "APV- Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Restablece tu contraseña",
        text: "Restablece tu contraseña",
        html:`
            <p>Hola: ${nombre}, has solicitado restablecer tu contraseña. </p>

            <p>Has clic en el siguiente enlace para generar una nueva contraseña:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer contraseña</a>
            </p>
            <p>Si tu no solicitaste restablecer la contraseña, puedes ignorar este mensaje</p>
        `
    });

    console.log('mensaje enviado: %s', info.messageId)

};
 
export default emailOlvidePassword;