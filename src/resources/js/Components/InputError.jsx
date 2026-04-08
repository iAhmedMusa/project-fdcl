export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-[0.8rem] font-medium text-destructive ' + className}
        >
            {message}
        </p>
    ) : null;
}
