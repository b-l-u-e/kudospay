// eslint-disable-next-line react/prop-types
const Button = ({ children, onClick, type = "button", className = "", ...props }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 text-white bg-[#3E5879] rounded focus:outline-none ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
