"use client";
import React, { useState, useRef } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import '../../styles.css';

const QRCodeScanner = ({ onScan }) => {
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader()).current; // Use a ref to persist the codeReader instance
  const scannedValues = useRef([]); // To store scanned values

  const startScan = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");

      if (videoDevices.length === 0) {
        setError("No camera found.");
        return;
      }

      const backCamera = videoDevices.find(device => device.label.toLowerCase().includes("back")) || videoDevices[0];
      const deviceId = backCamera.deviceId;

      // Start continuous scanning
      codeReader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
        if (result) {
          if (!scannedValues.current.includes(result.text)) {
            scannedValues.current.push(result.text); // Store unique scanned values
            console.log('result: ', result.text)
            onScan(result.text); // Call the onScan function with the scanned result
            codeReader.reset(); // Stop scanning after a successful scan
          }
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error(err);
        }
      });
    } catch (err) {
      setError("Error accessing camera.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        className='text0 flex flex-row justify-center items-center rounded-lg p-2 bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300 ease-in-out'
        onClick={startScan} // Start scanning when the button is clicked
      >
        Start Scanning
      </button> 

      <div className="my-4"></div>

      <video ref={videoRef} className="w-full max-w-md border-2 border-gray-300 rounded-lg" autoPlay />

      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
};

export default QRCodeScanner;