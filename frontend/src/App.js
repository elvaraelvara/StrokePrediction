import React, { useState } from "react";
import logo from "./logo.png";

function App() {
  const [formData, setFormData] = useState({
    gender: 0,
    age: "",
    hypertension: 0,
    heart_disease: 0,
    ever_married: 0,
    work_type: 0,
    residence_type: 0,
    avg_glucose_level: "",
    bmi: "",
    smoking_status: 0,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: parseFloat(formData.age),
          avg_glucose_level: parseFloat(formData.avg_glucose_level),
          bmi: parseFloat(formData.bmi),
        }),
      });

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error:", error);
      setPrediction("Error making prediction");
    }

    setLoading(false);
  };

  return (
    <div className="wrapper">
      <div className="container">
      <div className="header">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="title">Stroke Prediction</h1>
        </div>
        <div className="title-spacing"></div>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-grid">
            <div className="form-group">
              <label>Gender:</label>
              <select name="gender" onChange={handleChange}>
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>Age:</label>
              <input type="number" name="age" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Hypertension:</label>
              <select name="hypertension" onChange={handleChange}>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Heart Disease:</label>
              <select name="heart_disease" onChange={handleChange}>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ever Married:</label>
              <select name="ever_married" onChange={handleChange}>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Work Type:</label>
              <select name="work_type" onChange={handleChange}>
                <option value="0">Private</option>
                <option value="1">Self-employed</option>
                <option value="2">Government Job</option>
                <option value="3">Children</option>
                <option value="4">Never worked</option>
              </select>
            </div>

            <div className="form-group">
              <label>Residence Type:</label>
              <select name="residence_type" onChange={handleChange}>
                <option value="0">Urban</option>
                <option value="1">Rural</option>
              </select>
            </div>

            <div className="form-group">
              <label>Average Glucose Level:</label>
              <input type="number" step="0.1" name="avg_glucose_level" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>BMI:</label>
              <input type="number" step="0.1" name="bmi" onChange={handleChange} required />
            </div>

            <div className="form-group full-width">
              <label>Smoking Status:</label>
              <select name="smoking_status" onChange={handleChange}>
                <option value="0">Never Smoked</option>
                <option value="1">Formerly Smoked</option>
                <option value="2">Currently Smokes</option>
                <option value="3">Unknown</option>
              </select>
            </div>
          </div>

          <button type="submit">{loading ? "Predicting..." : "Predict Stroke Risk"}</button>
        </form>

        {loading && <p className="loading">Processing...</p>}
        {prediction && <div className="result">{prediction}</div>}
      </div>

      <style>{`
        .wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 20px;
        }

        .container {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          width: 90%;
          max-width: 900px;
        }
          .header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }
          .title-spacing {
          margin-bottom: 20px;
        }
        .logo {
          width: 50px;
          height: auto;
        }
        .title {
          color: #444;
          margin: 0;
        }
        h1 {
          text-align: center;
          color: #444;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .full-width {
          grid-column: span 3;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        label {
          font-weight: bold;
        }

        input, select {
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
          transition: 0.3s;
        }

        button {
          width: 100%;
          padding: 12px;
          background: #667eea;
          color: white;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 20px;
        }

        .result {
          margin-top: 20px;
          padding: 15px;
          background: #222;
          color: #fff;
          font-weight: bold;
          border-radius: 5px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default App;
