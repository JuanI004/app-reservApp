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
    console.log(info);
  }

  return (
    <>
      <ul className="flex gap-4 mb-6 flex justify-center items-center">
        {[1, 2, 3, 4].map((num) => (
          <li
            key={num}
            className={`  ${page === num ? "bg-brand text-white" : "bg-gray-300 text-gray-600"} w-8 h-8 rounded-full flex items-center justify-center`}
          >
            {num}
          </li>
        ))}
      </ul>
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
