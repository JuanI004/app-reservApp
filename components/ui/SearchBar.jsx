export default function SearchBar({ value, onChange, ubicacion }) {
  return (
    <div className="shadow-xl w-full bg-white items-center flex  p-2 rounded-[18px] ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="#999"
        viewBox="0 0 256 256"
        className="ml-2"
      >
        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
      </svg>
      <input
        type="text"
        placeholder="Barbería, peluquería, estética..."
        value={value}
        onChange={onChange}
        className="w-full bg-white px-4 py-2 rounded-xl focus:outline-none "
      />
      <div className="px-4 border-l flex items-center gap-2 border-[#999]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="#0f6e56"
          viewBox="0 0 256 256"
        >
          <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path>
        </svg>
        <p className="text-[#666]">{ubicacion}</p>
      </div>
      <button className="px-6 py-2 bg-brand hover:bg-brand/80 cursor-pointer text-white rounded-[12px] hover:bg-brand-dark transition-colors">
        Buscar
      </button>
    </div>
  );
}
