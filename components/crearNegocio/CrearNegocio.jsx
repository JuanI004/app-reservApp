import { useState } from "react";
import Pag1 from "./Pag1";
import Pag2 from "./Pag2";

export default function CrearNegocio({ info, setInfo, handleSubmit }) {
  const [page, setPage] = useState(1);

  function handleNextPag(data) {
    setInfo({ ...info, ...data });
    setPage(page + 1);
    if (page === 2) {
      handleSubmit();
    }
  }

  return (
    <>
      {page === 1 && (
        <Pag1
          info={info}
          setInfo={setInfo}
          nextPage={() => handleNextPag(info)}
        />
      )}
      {page === 2 && (
        <Pag2
          info={info}
          setInfo={setInfo}
          nextPage={() => handleNextPag(info)}
          prevPage={() => setPage(page - 1)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
