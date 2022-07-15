export default function UserButton(props) {
    const { className = '', ...rest } = props;
    return (
        <button
                    className={`border-none hover:rounded-full p-2 
            hover:bg-slate-400 hover:text-slate-50 ${className ? className : ''}`} {...rest}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline-block h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clip-rule="evenodd"
                        />
                    </svg>
        </button>
    );
}
