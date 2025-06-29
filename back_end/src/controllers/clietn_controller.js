import { updateCliente } from "../models/clientModel.js";

//Modificar clietne
export const modificarcliente = async (req, res) => {
  const { celular, cliente, correo } = req.body;
  
  const parte = cliente.split(" ");

  const apellido = parte[0];
  const nombre = parte[1];

  try {
    const clientemodificado = await updateCliente(
      parseInt(celular),
      nombre,
      apellido,
      correo ? correo : ''
    );

    res.json({
      clientemodificado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
