export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/images/logo.png"
            alt="Oakhaven Academy Logo"
            // Adding h-20 (or your preferred size) and w-auto ensures it stays proportional
            // object-contain prevents the image from being stretched or squished
            className={`h-20 w-auto object-contain ${props.className || ''}`}
        />
    );
}
