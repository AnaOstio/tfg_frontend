interface UnknowIconProps extends React.SVGProps<SVGSVGElement> { }

const UnknowFlag: React.FC<UnknowIconProps> = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={800}
            height={800}
            fill="none"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="#1C274C"
                fillRule="evenodd"
                d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10ZM12 7.75c-.621 0-1.125.504-1.125 1.125a.75.75 0 0 1-1.5 0 2.625 2.625 0 1 1 4.508 1.829c-.092.095-.18.183-.264.267-.216.215-.405.404-.571.617-.22.282-.298.489-.298.662V13a.75.75 0 0 1-1.5 0v-.75c0-.655.305-1.186.614-1.583.229-.294.516-.58.75-.814.07-.07.136-.135.193-.194A1.125 1.125 0 0 0 12 7.75ZM12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default UnknowFlag;
