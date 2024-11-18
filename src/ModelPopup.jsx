import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import emailjs from 'emailjs-com';
import SuccessPopup from './SuccessPopup';

export default function ModelPopup({ isOpen, onClose, modelTitle, modelUrl, scale }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: `I am interested in learning more about the ${modelTitle} model.`,
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [scene, setScene] = useState(null);

  // Define a default scale if none is provided
  const modelScale = scale && scale.length === 3 ? scale : [0.5, 0.5, 0.5];

  useEffect(() => {
    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          setScene(gltf.scene);
        },
        undefined,
        (error) => {
          console.error("Error loading model:", error);
        }
      );
    }
  }, [modelUrl]);

  if (!isOpen || !scene) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      modelTitle: modelTitle,
    };

    // Send data via EmailJS
    emailjs.send(
      'service_ghmawzk', // Your EmailJS Service ID
      'template_lngf4ha', // Your EmailJS Template ID
      dataToSend,
      'vQzJadpgiPC6d6NLc' // Your EmailJS Public Key
    ).then(
      (result) => {
        console.log('Email successfully sent!', result.text);
        setShowSuccessPopup(true);
        setFormData({
          name: '',
          email: '',
          message: `I am interested in learning more about the ${modelTitle} model.`,
        });
      },
      (error) => {
        console.error('There was an error sending the email:', error);
        alert('Failed to send enquiry. Please try again later.');
      }
    );
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <button className="closebutton" onClick={onClose}></button>

        <div className="popup-body">
          <div className="model-view">
            <h2>{modelTitle}</h2>
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <Suspense fallback={<span>Loading model...</span>}>
                <primitive object={scene} scale={modelScale} />
              </Suspense>
              <OrbitControls enableZoom={true} />
            </Canvas>
          </div>

          <div className="enquiry-form">
            <h3>Enquiry Form</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Message:
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit">Send Enquiry</button>
            </form>
          </div>
        </div>
      </div>

      {showSuccessPopup && (
        <SuccessPopup
          message="Your enquiry has been sent successfully!"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
}
