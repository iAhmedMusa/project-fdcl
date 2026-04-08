export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/images/logo.png"
            alt="Focus Digital Color Lab"
            className={props.className || 'h-16 w-auto'}
        />
    );
}
