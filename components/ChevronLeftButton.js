export default function ChevronLeftButton(props) {
    const { className = "", children, ...rest } = props;
    return (
        <button className={`${className ? className : ""}`} {...rest}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {children}
        </button>
    );
}
