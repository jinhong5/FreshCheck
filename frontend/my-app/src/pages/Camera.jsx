import { useState, useEffect, useRef } from 'react';
import "../pages/Camera.css";

export default function Camera() {

    let count = localStorage.getItem("counter");

    if (!count) {
        count = 0;
    }

    localStorage.setItem("counter", count);


    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [photo, setPhoto] = useState(null);
    const [stream, setStream] = useState(null);
    const [selected, setSelect] = useState(false);
    const [hasSubmit, setHasSubmit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const [uploaded, setUploaded] = useState(null);
    const [label, setLabel] = useState(null);
    // const [new, setNew] = useState(false);

    // const [count, setCounter] = useState(1);

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

    useEffect(() => {
        setSelect(false);
    }, [analysis])

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
        setUploaded(null);
    }

    function uploadPhoto(e) {
        const file = e.target.files[0];
        if (!file) return;

        // create a url for the uploaded photo
        const url = URL.createObjectURL(file);
        setPhoto(url);
        setUploaded(file);
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

    function dataURLtoBlob(dataURL) {
      const arr = dataURL.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
      }

      return new Blob([u8arr], { type: mime });
    }

    async function handleSubmit() {
        setHasSubmit(true);
        setIsSubmitting(true);
        setError(null);

        try {
            const photoPayload = await photoToDataUrl(photo);
            const formData = new FormData();
            if(!uploaded) {
              const blob = dataURLtoBlob(photo);
              formData.append("image", blob, "capture.png");
            } else {
              formData.append("image", uploaded);
            }
            const prediction = await fetch(`${import.meta.env.VITE_API_BASE_URL}/predict`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            });

            const predicted = await prediction.json();

              count++;
              localStorage.setItem("counter", count);

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/addEntry`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    photo: photoPayload,
                    category: predicted.prediction,
                    freshness: predicted.not_spoiled,
                    label: label,
                    count: count
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
            setAnalysis(data.entry.category || null);
            console.log(analysis);
            // setSelect(false);
        } catch (err) {
            console.error(err);
            setError(err.message || "Unable to analyze photo right now.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!photo) {
        return (
            <div className="db-main">
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
            <div className="db-main">
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
            <div className="db-main">
                <div className="container">
                    <div>
                        <img className="video" src={photo} />
                        <br />
                        <button onClick={retakePhoto}>Retake</button>
                        <button disabled={true}>Use Photo</button>
                        <canvas ref={canvasRef} hidden></canvas>

                        <br />
                        {console.log("Out: " + selected)}
                        
                        {selected ?
                        (<div className="label-input">
                            <div className="modal">
                                {console.log("In: " + selected)}
                                <label>Enter Food Label</label>
                                    <input type="text" onChange={(e) => {setLabel(e.target.value)}} placeholder={"temp" + count + "-" + new Date().getMonth() + new Date().getDay()}></input>
                                <br />
                                <span>
                                    <button
                                        id="checkmark"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Analyzing..." : "Submit"}
                                        {/* {setSelect(false)} */}
                                    </button>
                                    <button onClick={() => setSelect(false)}>Cancel</button>
                                </span>

                            </div>
                        </div>)
                        : <></>}
                    </div>

                    <br />
 
                    {error && (
                        <div className="analysis-error">
                            {error}
                        </div>
                    )}

                    {console.log("analysis: " + analysis)}
                    
                    {hasSubmit && !isSubmitting && (
                        <div className="analysis-card">
                            <h2>Freshness analysis: </h2>
                            <p className="analysis-score">
                                <span>{analysis}</span>
                            </p>
                            {/* <p className="analysis-days">
                                Estimated days remaining: <strong>{analysis.daysRemaining}</strong>
                            </p>
                            {analysis.storageTips && analysis.storageTips.length > 0 && (
                                <ul className="analysis-tips">
                                    {analysis.storageTips.map((tip, idx) => (
                                        <li key={idx}>{tip}</li>
                                    ))}
                                </ul>
                            )} */}
                        </div> 
                    )}
                </div>
            </div>
        )
    }
}

