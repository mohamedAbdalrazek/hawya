export default function LandingVideo({ className }: { className?: string }) {
    return (
        <video
            autoPlay
            loop
            muted
            playsInline
            className={className}
            preload="metadata"
            poster="/landing-video-poster.jpg"
        >
            <source src="/landing-video-short.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
}
