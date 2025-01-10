import React from "react";

const YouTubeEmbed = () => {
    return (
        <>
         
            <div className="flex justify-center items-center my-4">

                <iframe
                    width="1024"
                    height="480"
                    src="https://www.youtube.com/embed/hI9HQfCAw64?si=sHqlo3-4OTzB9ekN"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="rounded-lg shadow-lg"
                ></iframe>
            </div>
        </>

    );
};

export default YouTubeEmbed;
