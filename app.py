from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

# Load the trained model and scaler
try:
    model = joblib.load("stroke_prediction_modell.pkl")
    scaler = joblib.load("scalerr.pkl")
    expected_features = scaler.n_features_in_
    print(f"✅ Model and Scaler Loaded Successfully! Expecting {expected_features} features.")
except Exception as e:
    raise RuntimeError(f"❌ Error Loading Model or Scaler: {str(e)}")

# Initialize FastAPI
app = FastAPI()

# ✅ Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (use ["http://localhost:3000"] for security)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Define request body format
class StrokePredictionInput(BaseModel):
    gender: int
    age: float
    hypertension: int
    heart_disease: int
    ever_married: int
    work_type: int
    residence_type: int
    avg_glucose_level: float
    bmi: float
    smoking_status: int

@app.post("/predict")
def predict_stroke(data: StrokePredictionInput):
    try:
        input_data = np.array([[data.gender, data.age, data.hypertension, data.heart_disease,
                                data.ever_married, data.work_type, data.residence_type,
                                data.avg_glucose_level, data.bmi, data.smoking_status]])

        if input_data.shape[1] < expected_features:
            input_data = np.append(input_data, np.zeros((1, expected_features - input_data.shape[1])), axis=1)

        input_data = scaler.transform(input_data)
        prediction = model.predict(input_data)[0]
        result = "High Risk of Stroke" if prediction == 1 else "Low Risk of Stroke"

        return {"prediction": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction Error: {str(e)}")

# Run the API server only if executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

