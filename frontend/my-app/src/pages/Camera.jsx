import { useState, useEffect, useRef } from 'react';
import "../pages/Camera.css";

export default function Camera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [photo, setPhoto] = useState(null);
    const [stream, setStream] = useState(null);
    const [selected, setSelect] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);

    // when the page loads, ask the user for camera permissions
    useEffect(() => {
        let mediaStream;

        async function cameraPermission() {
            mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
            videoRef.current.srcObject = mediaStream;
            //videoRef.current.play();
            setStream(mediaStream);
        }

        cameraPermission();

        // turns off the camera when unmounts
        return () => {
            mediaStream?.getTracks().forEach(track => track.stop());
        };

    }, [])

    // display the video stream if retake photo is clicked
    useEffect(() => {
        if (!photo && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => console.log(err));
        }
    }, [photo, stream]);

    function takePicture() {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        // wait until metadata is loaded
        if (!video || video.videoWidth === 0) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");

        context.drawImage(video, 0, 0);

        const data = canvas.toDataURL("image/png");
        setPhoto(data);

    }

    function uploadPhoto(e) {
        const file = e.target.files[0];
        if (!file) return;

        // create a url for the uploaded photo
        const url = URL.createObjectURL(file);
        setPhoto(url);
    }

    const retakePhoto = () => {
        setPhoto(null);
        setSelect(false);
        setAnalysis(null);
        setError(null);
        setIsSubmitting(false);
    };

    async function photoToDataUrl(photoSrc) {
        if (!photoSrc) return null;
        if (photoSrc.startsWith("data:")) return photoSrc;
        if (photoSrc.startsWith("blob:")) {
            const res = await fetch(photoSrc);
            const blob = await res.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        }
        return photoSrc;
    }

    async function handleSubmit() {
        setIsSubmitting(true);
        setError(null);

        try {
            const photoPayload = await photoToDataUrl(photo);

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/addEntry`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    photo: photoPayload
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                if (res.status === 401) {
                    throw new Error(data.message || "Please sign in again.");
                }
                throw new Error(data.error || data.message || "Something went wrong while analyzing your photo.");
            }

            const data = await res.json();
            setAnalysis(data.analysis || null);
        } catch (err) {
            console.error(err);
            setError(err.message || "Unable to analyze photo right now.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!photo) {
        return (
            <div>
                <div className="camera">
                    <video className="video" ref={videoRef} autoPlay></video>
                    <br />
                    <button id="start-button" onClick={() => takePicture()}>Take a photo</button>
                    <label className="custom-upload" htmlFor="fileUpload">Upload</label>
                    <input type="file" id="fileUpload" name="fileUpload" accept="image/*" onChange={uploadPhoto} />
                </div>

                <canvas ref={canvasRef} hidden></canvas>
            </div>

        )
    }

    else if (photo && !selected) {
        return (
            <div>
                <img className="video" src={photo} />
                <br />
                <button onClick={retakePhoto}>Retake</button>
                <button onClick={() => { setSelect(true) }}>Use Photo</button>
                <canvas ref={canvasRef} hidden></canvas>
            </div>
        )
    }

    else {
        return (
            <div>
                <span className="container">
                    <div>
                        <img className="video" src={photo} />
                        <br />
                        <button onClick={retakePhoto}>Retake</button>
                        <button disabled={true}>Use Photo</button>
                        <canvas ref={canvasRef} hidden></canvas>
                    </div>

                    <br />

                    <button
                        id="checkmark"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Analyzing..." : "✓"}
                    </button>

                    {error && (
                        <div className="analysis-error">
                            {error}
                        </div>
                    )}

                    {analysis && (
                        <div className="analysis-card">
                            <h2>Freshness analysis</h2>
                            <p className="analysis-score">
                                Freshness score: <span>{analysis.freshnessScore}</span>/100
                            </p>
                            <p className="analysis-days">
                                Estimated days remaining: <strong>{analysis.daysRemaining}</strong>
                            </p>
                            {analysis.storageTips && analysis.storageTips.length > 0 && (
                                <ul className="analysis-tips">
                                    {analysis.storageTips.map((tip, idx) => (
                                        <li key={idx}>{tip}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </span>
            </div>
        )
    }
}

