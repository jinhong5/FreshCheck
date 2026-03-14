import { useState, useEffect, useRef } from 'react'
import "../pages/Camera.css"

export default function Camera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [photo, setPhoto] = useState(null);
    const [stream, setStream] = useState(null);
    const [selected, setSelect] = useState(false);

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
    };

    // async function handleSubmit() {

    //     const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/addEntry`, {
    //         method: "POST",
    //         headers: {
    //             "Authorization": `Bearer ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             photo: photo,
    //             rating: rating,
    //             comments: comments
    //         })
    //     });

    //     if (res.ok) {
    //         alert("Review submitted!");
    //     }
    // }

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

                    <button id="checkmark" onClick={handleSubmit}>✓</button>

                </span>
            </div>
        )
    }
}

