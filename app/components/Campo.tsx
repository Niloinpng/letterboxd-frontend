interface CampoProps {
    id: string;
    label: string;
    name: string;
    placeholder: string;
    valor: string | number;
    tipo: string;
    onChange: (value: string) => void;
    iserro?: boolean;
    formatFunction?: (value: string) => string;  
    onFocus?: () => void;  
  }
  
  const Campo = ({
    id,
    label,
    name,
    placeholder,
    valor,
    tipo,
    onChange,
    iserro,
    formatFunction,
    onFocus,
    
  }: CampoProps) => (
    <div className="w-full">
    <label className="whitespace-nowrap w-14 text-left font-ibm text-preto text-sm font-bold">
        {label}:
      </label>
    <div
      className={`w-full rounded-md flex items-center p-3
        focus-within:ring-1 
        ${iserro ? "bg-laranja" : "bg-white"}
      `}
    >
      
      <input
        className={`
          w-full font-ibm font-medium focus:outline-none
          placeholder:italic bg-transparent
          text-sm
          ${iserro ? "placeholder-cinzaescuro" : "placeholder:text-cinza"}
        `}
        type={tipo}
        name={name}
        id={id}
        placeholder={placeholder}
        value={valor}
        onChange={(e) => {
          let inputVal = e.target.value;
          if (formatFunction) {
            inputVal = formatFunction(inputVal);
          }
          onChange(inputVal);
        }}
        onFocus={() => {
          if(onFocus) onFocus();
        }}
      />
    </div>
    </div>
  );
  
  export default Campo;