
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isPrimary?: boolean;
    isDark?: boolean;
    children: React.ReactNode;
}

const Button = ({ children, ...props }: ButtonProps) => {

    const primary = `m-2 p-2 rounded ${props.isDark ? 'bg-blackBackground-primaryButton text-black' : 'bg-lightBackground-primaryButton text-white'}`
    const secondary = `m-2 p-2 rounded ${props.isDark ? 'bg-blackBackground-secondaryButton text-black' : 'bg-lightBackground-secondaryButton text-white'}`

    return (
        <button
            className={props.isPrimary ? primary : secondary}
            {...props}
        >
            {children}
        </button>
    )

}

export default Button; 