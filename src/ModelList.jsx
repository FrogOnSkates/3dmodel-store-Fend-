import React, { useState, useEffect } from 'react';
import sanityClient from './sanityClient';
import ModelPopup from './ModelPopup';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './index.css';

// Component to render each 3D model in the card
function ModelViewer({ modelUrl, scale }) {
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

  if (!scene) return <p>Loading model...</p>;

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <primitive object={scene} scale={modelScale} />
      </Suspense>
      <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
    </Canvas>
  );
}

export default function ModelList() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "threeDModel"]{
        _id,
        title,
        description,
        "modelUrl": modelFile.asset->url,
        "thumbnailUrl": thumbnail.asset->url,
        rotation,
        scale
      }`)
      .then((data) => {
        console.log("Fetched models with URLs:", data);
        setModels(data);
      })
      .catch((error) => console.error("Error fetching models:", error));
  }, []);

  if (models.length === 0) {
    return <p>No models found.</p>;
  }

  return (
    <div className="model-list">
      {models.map((model) => (
        <div
          key={model._id}
          className="model-card"
          onClick={() => setSelectedModel(model)}
        >
          {model.modelUrl ? (
            <ModelViewer modelUrl={model.modelUrl} scale={model.scale} />
          ) : (
            model.thumbnailUrl && (
              <img src={model.thumbnailUrl} alt={model.title} className="model-thumbnail" />
            )
          )}
          <div className="model-info">
            <h3 className="model-title">{model.title}</h3>
            <p className="model-description">{model.description}</p>
          </div>
        </div>
      ))}
      {selectedModel && (
        <ModelPopup
          isOpen={true}
          onClose={() => setSelectedModel(null)}
          modelTitle={selectedModel.title}
          modelUrl={selectedModel.modelUrl}
          scale={selectedModel.scale}
        />
      )}
    </div>
  );
}
