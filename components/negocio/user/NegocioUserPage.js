import { useEffect, useState } from "react";

export default function NegocioUserPage({ negocio, session }) {
  return (
    <div className="p-10 mt-40">Vista de usuario para {negocio?.nombre}</div>
  );
}
