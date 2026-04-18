import { useState } from "react";
import Pag1 from "./Pag1";
import Pag2 from "./Pag2";

export default function CrearNegocio({
  info,
  setInfo,
  handleSubmit,
  handlePrev = null,
}) {
  const [page, setPage] = useState(1);

  function handleNextPag(data) {
    if (page === 2) {
      handleSubmit();
    } else {
      setPage(page + 1);
    }
  }

  return (
    <>
      {page === 1 && (
        <Pag1
          info={info}
          setInfo={setInfo}
          handlePrev={handlePrev}
          nextPage={handleNextPag}
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
